# Arquitectura Final — Práctica 4

## Cómo TypeScript reduce los errores en tiempo de ejecución

### 1. Genéricos

El componente `DataTable<T>` acepta cualquier tipo de objeto sin perder seguridad de tipos. Sin TypeScript, la función recibiría `any[]` y la propiedad `clave` podría ser cualquier string, incluyendo uno que no existe en el objeto.

```typescript
// ❌ JavaScript: no hay garantía de que 'clave' sea una propiedad real de T
function DataTable({ datos, columnas }) { ... }

// ✅ TypeScript: el compilador verifica que 'clave' sea un keyof T
function DataTable<T extends object>({ datos, columnas }: DataTableProps<T>) { ... }
```

Si intentas pasar `clave: 'apellidos'` a un `DataTable<Estudiante>` donde `Estudiante` no tiene `apellidos`, el compilador lo detecta antes de ejecutar el código.

### 2. Uniones Discriminadas + never

Sin TypeScript, añadir un cuarto estado a `EstadoMatricula` podría romperse silenciosamente — el `switch` lo ignoraría y devolvería `undefined`. Con el análisis exhaustivo:

```typescript
default:
  const _exhaustivo: never = estado;
  throw new Error(`Estado no manejado`);
```

Si se añade `MatriculaCongelada { tipo: 'CONGELADA' }` y no se actualiza el `switch`, el compilador lanza un error en tiempo de compilación, no en producción.

### 3. Tipos de utilidad

`Partial<T>` en el estado de edición garantiza que el formulario puede tener campos a medio rellenar sin romper el contrato del tipo completo. Sin TypeScript, esto se manejaría con `|| ''` en todos lados, fuente habitual de bugs.

```typescript
// Sin TypeScript: cualquier mutación es válida
editState.nombre = undefined; // Silencioso, rompe en render

// Con TypeScript: Partial<Estudiante> permite undefined pero lo comunica
const [edicion, setEdicion] = useState<Partial<Estudiante>>({});
```

### 4. Librería externa (date-fns)

Los tipos de `date-fns` garantizan que `differenceInDays` recibe dos objetos `Date`, no strings. Sin tipos:

```javascript
// ❌ JavaScript: no da error pero el resultado es NaN
differenceInDays('2024-01-01', '2024-12-31')
```

```typescript
// ✅ TypeScript: error de compilación si pasas string en vez de Date
export function diferenciaEnDias(inicio: Date, fin: Date): number { ... }
```

### 5. Props tipadas en React

Sin TypeScript, olvidar una prop obligatoria solo falla en tiempo de ejecución. Con TypeScript falla en compilación:

```typescript
interface DataTableProps<T extends object> {
  datos:      readonly T[];   // Obligatorio
  columnas:   Columna<T>[];   // Obligatorio
  claveUnica: keyof T;        // Obligatorio y verificado contra T
  onGuardar?: ...;            // Opcional (?)
}
```

### Conclusión

TypeScript convierte una clase entera de errores de runtime (propiedades inexistentes, tipos incorrectos, estados no manejados) en errores de compilación. El resultado es que `npx tsc --noEmit` con `"strict": true` arroja 0 errores, lo que da una garantía mucho mayor de que el código funcionará en producción.

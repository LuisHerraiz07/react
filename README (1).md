# React — Práctica 4, Módulo 3

Proyecto React + TypeScript creado con Vite. Demuestra el uso de genéricos, Uniones Discriminadas, tipos de utilidad y librerías externas tipadas.

## Estructura

```
react/
├── src/
│   ├── components/
│   │   └── DataTable.tsx     Componente genérico DataTable<T>
│   ├── utils/
│   │   └── dates.ts          Utilidades de fechas con date-fns
│   ├── App.tsx               Aplicación principal
│   └── main.tsx              Punto de entrada React
├── docs/
│   └── arquitectura-final.md
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Cómo ejecutar

```bash
npm install
npm run dev       # Servidor de desarrollo en http://localhost:5173
npm run build     # Compilación de producción
npm run typecheck # npx tsc --noEmit → debe dar 0 errores
```

## Conceptos aplicados

| Concepto | Dónde |
|---|---|
| `DataTable<T>` — componente genérico | `components/DataTable.tsx` |
| `Partial<T>` en estado de edición | `useState<Partial<Estudiante>>` |
| `Readonly<T>` en datos | Array `ESTUDIANTES` inmutable |
| Props tipadas con `interface` | `DataTableProps<T>` |
| `keyof T` para claves dinámicas | `Columna<T>.clave` |
| Unión Discriminada `EstadoMatricula` | `App.tsx` |
| Análisis exhaustivo con `never` | `generarReporte()` |
| `date-fns` con tipos | `utils/dates.ts` |

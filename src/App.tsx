/**
 * App.tsx — Práctica 4, Módulo 3
 *
 * Demuestra:
 * - DataTable<T> genérico con Partial<T> en edición
 * - Unión Discriminada + análisis exhaustivo con never
 * - Tipos de utilidad: Partial, Readonly, Pick, Omit
 * - Uso de date-fns con tipos estrictos
 */

import { useState } from 'react';
import { DataTable } from './components/DataTable';
import { formatearFechaES, calcularEdad, diferenciaEnDias } from './utils/dates';

// ── Tipos del dominio (replicados del módulo 2) ─────────────────

interface Estudiante {
  readonly id: string;
  nombre:      string;
  email:       string;
  carrera:     string;
  ingreso:     string; // ISO date string
}

// Unión Discriminada para el estado de matrícula
interface MatriculaActiva     { tipo: 'ACTIVA';     asignaturas: number; }
interface MatriculaSuspendida { tipo: 'SUSPENDIDA'; motivo: string; }
interface MatriculaFinalizada { tipo: 'FINALIZADA'; notaMedia: number; }
type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

// Análisis exhaustivo con never
function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case 'ACTIVA':
      return `📗 Activa — ${estado.asignaturas} asignaturas`;
    case 'SUSPENDIDA':
      return `📙 Suspendida — ${estado.motivo}`;
    case 'FINALIZADA':
      return `📘 Finalizada — Nota: ${estado.notaMedia.toFixed(2)}`;
    default:
      const _exhaustivo: never = estado;
      throw new Error(`Estado no manejado: ${JSON.stringify(_exhaustivo)}`);
  }
}

// ── Datos de ejemplo ────────────────────────────────────────────

const ESTUDIANTES: Readonly<Estudiante[]> = [
  { id: 'est-001', nombre: 'Luis Herraiz',    email: 'luis@uni.es',  carrera: 'Informática',    ingreso: '2022-09-01' },
  { id: 'est-002', nombre: 'Ana Martínez',    email: 'ana@uni.es',   carrera: 'Matemáticas',    ingreso: '2021-09-01' },
  { id: 'est-003', nombre: 'Carlos Ruiz',     email: 'carlos@uni.es',carrera: 'Física',          ingreso: '2023-09-01' },
];

const ESTADOS: EstadoMatricula[] = [
  { tipo: 'ACTIVA',     asignaturas: 5 },
  { tipo: 'FINALIZADA', notaMedia: 8.4 },
  { tipo: 'SUSPENDIDA', motivo: 'Impago' },
];

// ── App ─────────────────────────────────────────────────────────

export default function App() {
  // Partial<Estudiante> en el estado de edición — el usuario puede
  // no haber rellenado todos los campos todavía.
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([...ESTUDIANTES]);
  const [ultimaEdicion, setUltimaEdicion] = useState<string | null>(null);

  const handleGuardar = (cambios: Partial<Estudiante> & Pick<Estudiante, keyof Estudiante>): void => {
    setEstudiantes(prev =>
      prev.map(e => e.id === cambios.id ? { ...e, ...cambios } : e)
    );
    setUltimaEdicion(`Guardado: ${cambios.nombre ?? ''} — ${new Date().toLocaleTimeString('es-ES')}`);
  };

  // Ejemplo de date-fns
  const hoy            = new Date();
  const inicioBootcamp = new Date('2024-09-01');
  const diasBootcamp   = diferenciaEnDias(inicioBootcamp, hoy);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

      <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '28px', marginBottom: '4px' }}>
        Práctica 4
      </h1>
      <p style={{ color: '#6B6860', marginBottom: '32px', fontSize: '14px' }}>
        TypeScript · Genéricos · Uniones Discriminadas · Tipos de Utilidad
      </p>

      {/* ── DataTable genérico ── */}
      <section style={{ marginBottom: '40px' }}>
        <DataTable<Estudiante>
          titulo="Tabla de Estudiantes — DataTable&lt;Estudiante&gt;"
          datos={estudiantes}
          claveUnica="id"
          onGuardar={handleGuardar}
          columnas={[
            { cabecera: 'ID',      clave: 'id' },
            { cabecera: 'Nombre',  clave: 'nombre' },
            { cabecera: 'Email',   clave: 'email' },
            { cabecera: 'Carrera', clave: 'carrera' },
            {
              cabecera: 'Ingreso',
              clave:    'ingreso',
              render:   (valor) => formatearFechaES(new Date(String(valor))),
            },
            {
              cabecera: 'Edad',
              clave:    'ingreso',
              render:   (_v, fila) => `${calcularEdad(new Date(fila.ingreso))} años`,
            },
          ]}
        />
        {ultimaEdicion && (
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#1D9E75' }}>✓ {ultimaEdicion}</p>
        )}
      </section>

      {/* ── Uniones Discriminadas ── */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '12px' }}>Estados de Matrícula — Unión Discriminada</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {ESTADOS.map((e, i) => (
            <div key={i} style={{
              padding: '14px 18px',
              background: '#F0EEE8',
              borderRadius: '10px',
              fontSize: '14px',
              border: '1px solid rgba(0,0,0,0.10)',
            }}>
              {generarReporte(e)}
            </div>
          ))}
        </div>
      </section>

      {/* ── Tipos de utilidad ── */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '12px' }}>Tipos de utilidad demostrados</h3>
        <table style={{ fontSize: '13px', borderCollapse: 'collapse', width: '100%' }}>
          {[
            ['Partial<T>',    'Estado de edición: no todos los campos son obligatorios al editar'],
            ['Readonly<T>',   'Array ESTUDIANTES inmutable — no se puede mutar el array original'],
            ['Pick<T,K>',     'onGuardar recibe Partial<T> & Pick<T, keyof T> para el contrato'],
            ['Record<K,T>',   'Útil para diccionarios; ej: Record<string, Estudiante>'],
            ['Awaited<T>',    'Desenvuelve el tipo de una Promise<T> → T'],
          ].map(([util, desc]) => (
            <tr key={util} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#3D3A8F', whiteSpace: 'nowrap' }}>{util}</td>
              <td style={{ padding: '8px 12px', color: '#6B6860' }}>{desc}</td>
            </tr>
          ))}
        </table>
      </section>

      {/* ── date-fns ── */}
      <section>
        <h3 style={{ marginBottom: '12px' }}>Utilidades de fechas — date-fns</h3>
        <p style={{ fontSize: '14px', color: '#6B6860' }}>
          Días desde el inicio del bootcamp ({formatearFechaES(inicioBootcamp)}): <strong style={{ color: '#3D3A8F' }}>{diasBootcamp} días</strong>
        </p>
      </section>

    </div>
  );
}

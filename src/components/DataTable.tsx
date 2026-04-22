/**
 * DataTable.tsx
 * Componente genérico de tabla de datos.
 *
 * Aplica los conceptos:
 * - Props tipadas con interface
 * - Genérico DataTable<T> con restricción `extends object`
 * - useState con tipo genérico: useState<Partial<T> | null>
 * - Tipos de utilidad: Partial<T>, Readonly<T>
 */

import { useState } from 'react';

// ── Tipos ───────────────────────────────────────────────────────

/** Definición de una columna: qué propiedad de T renderiza */
export interface Columna<T> {
  /** Cabecera visible en la tabla */
  cabecera: string;
  /** Clave del objeto T a renderizar */
  clave:    keyof T;
  /** Renderizador personalizado opcional */
  render?:  (valor: T[keyof T], fila: T) => React.ReactNode;
}

export interface DataTableProps<T extends object> {
  /** Array de datos a mostrar */
  datos:        readonly T[];
  /** Definición de columnas */
  columnas:     Columna<T>[];
  /** Clave única por fila (ej: 'id') */
  claveUnica:   keyof T;
  /** Callback cuando se guarda una edición */
  onGuardar?:   (filaEditada: Partial<T> & Pick<T, keyof T>) => void;
  /** Título de la tabla */
  titulo?:      string;
}

// ── Componente ──────────────────────────────────────────────────

export function DataTable<T extends object>({
  datos,
  columnas,
  claveUnica,
  onGuardar,
  titulo,
}: DataTableProps<T>) {

  // Estado de edición: Partial<T> porque el usuario puede no haber
  // rellenado todos los campos aún. null cuando no se está editando.
  const [filaEditando, setFilaEditando] = useState<string | null>(null);
  const [borradorEdicion, setBorradorEdicion] = useState<Partial<T>>({});

  const iniciarEdicion = (fila: T): void => {
    setFilaEditando(String(fila[claveUnica]));
    setBorradorEdicion({ ...fila });
  };

  const cancelarEdicion = (): void => {
    setFilaEditando(null);
    setBorradorEdicion({});
  };

  const guardarEdicion = (): void => {
    if (onGuardar && filaEditando !== null) {
      onGuardar(borradorEdicion as Partial<T> & Pick<T, keyof T>);
    }
    cancelarEdicion();
  };

  const actualizarCampo = (clave: keyof T, valor: string): void => {
    setBorradorEdicion(prev => ({ ...prev, [clave]: valor }));
  };

  return (
    <div style={{ fontFamily: 'inherit', overflowX: 'auto' }}>
      {titulo && <h3 style={{ marginBottom: '12px', color: 'var(--clr-text, #1A1916)' }}>{titulo}</h3>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ background: 'var(--clr-surface-2, #F0EEE8)', textAlign: 'left' }}>
            {columnas.map(col => (
              <th key={String(col.clave)} style={{ padding: '10px 14px', fontWeight: 600, borderBottom: '2px solid var(--clr-border-md, rgba(0,0,0,0.18))' }}>
                {col.cabecera}
              </th>
            ))}
            {onGuardar && <th style={{ padding: '10px 14px', borderBottom: '2px solid var(--clr-border-md, rgba(0,0,0,0.18))' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => {
            const idFila    = String(fila[claveUnica]);
            const editando  = filaEditando === idFila;

            return (
              <tr
                key={idFila}
                style={{
                  borderBottom: '1px solid var(--clr-border, rgba(0,0,0,0.10))',
                  background: editando ? 'var(--clr-accent-bg, #EEEDFE)' : 'transparent',
                  transition: 'background 180ms',
                }}
              >
                {columnas.map(col => (
                  <td key={String(col.clave)} style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                    {editando ? (
                      <input
                        type="text"
                        value={String(borradorEdicion[col.clave] ?? '')}
                        onChange={e => actualizarCampo(col.clave, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '4px 8px',
                          border: '1.5px solid var(--clr-accent, #3D3A8F)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                        }}
                      />
                    ) : (
                      col.render
                        ? col.render(fila[col.clave], fila)
                        : String(fila[col.clave] ?? '—')
                    )}
                  </td>
                ))}
                {onGuardar && (
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    {editando ? (
                      <>
                        <button onClick={guardarEdicion}  style={btnStyle('#1D9E75')}>✓ Guardar</button>
                        <button onClick={cancelarEdicion} style={{ ...btnStyle('#C93A3A'), marginLeft: '6px' }}>✕ Cancelar</button>
                      </>
                    ) : (
                      <button onClick={() => iniciarEdicion(fila)} style={btnStyle('#3D3A8F')}>✎ Editar</button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
          {datos.length === 0 && (
            <tr>
              <td colSpan={columnas.length + (onGuardar ? 1 : 0)} style={{ textAlign: 'center', padding: '24px', color: 'var(--clr-text-3, #A8A69F)' }}>
                Sin datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Helper de estilos de botón ──────────────────────────────────

function btnStyle(color: string): React.CSSProperties {
  return {
    padding:      '4px 10px',
    background:   'transparent',
    border:       `1.5px solid ${color}`,
    borderRadius: '6px',
    color:        color,
    cursor:       'pointer',
    fontSize:     '12px',
    fontWeight:   500,
    fontFamily:   'inherit',
  };
}

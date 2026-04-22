/**
 * utils/dates.ts
 * Utilidades de fechas usando `date-fns`.
 *
 * Aplica los conceptos:
 * - Tipos de entrada y salida estrictos
 * - Librería externa con tipos (@types incluidos en date-fns v3)
 */

import { differenceInDays, format, isValid, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Calcula la diferencia en días entre dos fechas.
 * El resultado es positivo si `fin` es posterior a `inicio`.
 *
 * @throws Error si alguna de las fechas no es válida
 */
export function diferenciaEnDias(inicio: Date, fin: Date): number {
  if (!isValid(inicio) || !isValid(fin)) {
    throw new Error('Ambas fechas deben ser válidas');
  }
  return differenceInDays(fin, inicio);
}

/**
 * Formatea una fecha al estilo español: "15 de marzo de 2024"
 */
export function formatearFechaES(fecha: Date): string {
  if (!isValid(fecha)) throw new Error('Fecha no válida');
  return format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Comprueba si una fecha está en el futuro respecto a hoy.
 */
export function esFechaFutura(fecha: Date): boolean {
  return isAfter(fecha, new Date());
}

/**
 * Calcula la edad en años a partir de una fecha de nacimiento.
 */
export function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  return Math.floor(diferenciaEnDias(fechaNacimiento, hoy) / 365.25);
}

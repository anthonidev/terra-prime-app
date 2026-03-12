// ============================================================
// UTILIDAD: Formateo de fechas (timezone UTC)
// ============================================================
// Todas las fechas se manejan en UTC para evitar problemas
// de timezone. Las fechas de la API vienen en formato ISO.
// ============================================================

// NOTA: Estas funciones usan date-fns y date-fns-tz.
// Instalar: npm install date-fns date-fns-tz

import { es } from 'date-fns/locale';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const APP_TIME_ZONE = 'UTC';

/**
 * Parsea un string YYYY-MM-DD a Date en UTC.
 * Evita el problema de que new Date('YYYY-MM-DD') se interpreta como UTC
 * y puede cambiar el dia en zonas horarias negativas.
 */
export function parseDateInputValue(dateInputValue: string): Date | null {
  if (!DATE_ONLY_REGEX.test(dateInputValue)) return null;
  const date = fromZonedTime(`${dateInputValue}T00:00:00`, APP_TIME_ZONE);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Formatea un Date a string YYYY-MM-DD (para inputs tipo date).
 */
export function formatDateToInputValue(date: Date): string {
  return formatInTimeZone(date, APP_TIME_ZONE, 'yyyy-MM-dd');
}

/**
 * Retorna la fecha de hoy como YYYY-MM-DD.
 */
export function getTodayDateInputValue(): string {
  return formatInTimeZone(new Date(), APP_TIME_ZONE, 'yyyy-MM-dd');
}

/**
 * Convierte una fecha ISO a YYYY-MM-DD.
 */
export function formatIsoToDateInputValue(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  if (DATE_ONLY_REGEX.test(isoDate)) return isoDate;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return formatInTimeZone(date, APP_TIME_ZONE, 'yyyy-MM-dd');
}

/**
 * Formatea una fecha ISO para mostrar con hora.
 *
 * @example
 * formatDateTime('2024-01-15T10:30:00Z') // "15 de enero, 2024 10:30"
 */
export function formatDateTime(
  dateString: string,
  formatString: string = "dd 'de' MMMM, yyyy HH:mm"
): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return formatInTimeZone(date, APP_TIME_ZONE, formatString, { locale: es });
}

/**
 * Formatea una fecha para mostrar (sin hora).
 *
 * @example
 * formatDateOnly('2024-01-15') // "15 de enero, 2024"
 */
export function formatDateOnly(
  dateString: string,
  formatString: string = "dd 'de' MMMM, yyyy"
): string {
  if (DATE_ONLY_REGEX.test(dateString)) {
    const date = fromZonedTime(`${dateString}T00:00:00`, APP_TIME_ZONE);
    if (Number.isNaN(date.getTime())) return '';
    return formatInTimeZone(date, APP_TIME_ZONE, formatString, { locale: es });
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return formatInTimeZone(date, APP_TIME_ZONE, formatString, { locale: es });
}

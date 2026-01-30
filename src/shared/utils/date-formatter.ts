import { es } from 'date-fns/locale';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// App-wide timezone used to display and normalize dates.
// Business rule: show dates/times exactly as UTC (no device timezone conversion).
export const APP_TIME_ZONE = 'UTC';

/**
 * Parses a YYYY-MM-DD string into a Date in *local* timezone.
 *
 * NOTE: `new Date('YYYY-MM-DD')` is parsed as UTC by spec and can shift the day
 * for users in negative timezones. This helper avoids that.
 */
export function parseDateInputValue(dateInputValue: string): Date | null {
  if (!DATE_ONLY_REGEX.test(dateInputValue)) return null;

  // Interpret the date as midnight in the app timezone.
  const date = fromZonedTime(`${dateInputValue}T00:00:00`, APP_TIME_ZONE);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a JS Date into an <input type="date" /> value (YYYY-MM-DD) in UTC. */
export function formatDateToInputValue(date: Date): string {
  return formatInTimeZone(date, APP_TIME_ZONE, 'yyyy-MM-dd');
}

/** Returns today's date as an <input type="date" /> value (YYYY-MM-DD) in UTC. */
export function getTodayDateInputValue(): string {
  return formatInTimeZone(new Date(), APP_TIME_ZONE, 'yyyy-MM-dd');
}

/**
 * Converts an ISO datetime (or YYYY-MM-DD) into an <input type="date" /> value (YYYY-MM-DD)
 * in UTC.
 */
export function formatIsoToDateInputValue(isoDate: string | null | undefined): string {
  if (!isoDate) return '';

  // If already a date-only value, keep it.
  if (DATE_ONLY_REGEX.test(isoDate)) return isoDate;

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return formatInTimeZone(date, APP_TIME_ZONE, 'yyyy-MM-dd');
}

/** Formats an ISO datetime string in UTC. */
export function formatDateTime(
  dateString: string,
  formatString: string = "dd 'de' MMMM, yyyy HH:mm"
): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return formatInTimeZone(date, APP_TIME_ZONE, formatString, { locale: es });
}

/** Formats a date-only value (YYYY-MM-DD) or ISO datetime using UTC. */
export function formatDateOnly(
  dateString: string,
  formatString: string = "dd 'de' MMMM, yyyy"
): string {
  // If we receive a date-only string, interpret it as midnight UTC.
  if (DATE_ONLY_REGEX.test(dateString)) {
    const date = fromZonedTime(`${dateString}T00:00:00`, APP_TIME_ZONE);
    if (Number.isNaN(date.getTime())) return '';
    return formatInTimeZone(date, APP_TIME_ZONE, formatString, { locale: es });
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return formatInTimeZone(date, APP_TIME_ZONE, formatString, { locale: es });
}

// ============================================================
// UTILIDAD: Formateo de moneda (PEN / USD)
// ============================================================

/**
 * Formatea un numero como moneda con separadores de miles y decimales.
 *
 * @example
 * formatCurrency(64000, 'USD') // "$ 64,000.00"
 * formatCurrency(64000, 'PEN') // "S/ 64,000.00"
 * formatCurrency(64000, 'USD', { showDecimals: false }) // "$ 64,000"
 */
export function formatCurrency(
  amount: number,
  currency: 'PEN' | 'USD' = 'PEN',
  options?: {
    showDecimals?: boolean;
    showSymbol?: boolean;
  }
): string {
  const { showDecimals = true, showSymbol = true } = options || {};

  const currencyConfig = {
    PEN: { symbol: 'S/', locale: 'es-PE' },
    USD: { symbol: '$', locale: 'en-US' },
  };

  const config = currencyConfig[currency];

  const formatted = new Intl.NumberFormat(config.locale, {
    style: 'decimal',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return showSymbol ? `${config.symbol} ${formatted}` : formatted;
}

/**
 * Parsea un string de moneda a numero.
 *
 * @example
 * parseCurrency("S/ 64,000.00") // 64000
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, '');
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let result = cleaned;

  if (lastComma > lastDot) {
    result = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    result = cleaned.replace(/,/g, '');
  }

  return parseFloat(result) || 0;
}

/**
 * Obtiene el simbolo de la moneda.
 */
export function getCurrencySymbol(currency: 'PEN' | 'USD'): string {
  return currency === 'PEN' ? 'S/' : '$';
}

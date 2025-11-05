/**
 * Formatea un número como moneda
 * @param amount - El monto a formatear
 * @param currency - El código de moneda ('PEN' o 'USD')
 * @param options - Opciones adicionales de formateo
 * @returns El monto formateado como string
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
    PEN: {
      symbol: 'S/',
      locale: 'es-PE',
      code: 'PEN',
    },
    USD: {
      symbol: '$',
      locale: 'en-US',
      code: 'USD',
    },
  };

  const config = currencyConfig[currency];

  // Formatear el número con separadores de miles
  const formatted = new Intl.NumberFormat(config.locale, {
    style: 'decimal',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  // Retornar con o sin símbolo
  return showSymbol ? `${config.symbol} ${formatted}` : formatted;
}

/**
 * Formatea un rango de precios
 * @param min - Precio mínimo
 * @param max - Precio máximo
 * @param currency - El código de moneda ('PEN' o 'USD')
 * @returns El rango formateado
 */
export function formatCurrencyRange(
  min: number,
  max: number,
  currency: 'PEN' | 'USD' = 'PEN'
): string {
  const minFormatted = formatCurrency(min, currency);
  const maxFormatted = formatCurrency(max, currency);

  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Parsea un string de moneda a número
 * @param value - El valor formateado como string
 * @returns El número parseado
 */
export function parseCurrency(value: string): number {
  // Remover todo excepto números, puntos y comas
  const cleaned = value.replace(/[^\d.,]/g, '');

  // Determinar si usa punto o coma como separador decimal
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let result = cleaned;

  if (lastComma > lastDot) {
    // Formato europeo: 1.234,56
    result = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // Formato americano: 1,234.56
    result = cleaned.replace(/,/g, '');
  }

  return parseFloat(result) || 0;
}

/**
 * Obtiene el símbolo de la moneda
 * @param currency - El código de moneda ('PEN' o 'USD')
 * @returns El símbolo de la moneda
 */
export function getCurrencySymbol(currency: 'PEN' | 'USD'): string {
  return currency === 'PEN' ? 'S/' : '$';
}

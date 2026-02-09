// Mapeo de nombres de conceptos de pago (versiones cortas)
export const paymentConceptMap: Record<string, string> = {
  'Pago total de venta': 'Pago total de venta',
  'Monto inicial': 'Pago inicial',
  'Pago inicial de financiación de la venta': 'Pago inicial',
  'Pago de cuotas de financiación de la venta': 'Pago de Cuota',
  'Pago de cuotas de financiación': 'Pago de Cuota',
  'Pago de reserva de la venta': 'Pago de reserva',
  'Pago de mora': 'Pago de Mora',
  'Pago de mora de la venta': 'Pago de Mora',
};

// Función para obtener el nombre corto del concepto
export function getShortConceptName(concept: string): string {
  return paymentConceptMap[concept] || concept;
}

// Función para obtener conceptos únicos de un array de pagos
export function getUniqueConceptsFromPayments(payments: { paymentConfig: string }[]): string[] {
  const concepts = new Set(payments.map((p) => p.paymentConfig));
  return Array.from(concepts).sort();
}

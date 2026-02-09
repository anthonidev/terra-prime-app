import { Badge } from '@/components/ui/badge';
import { PaymentConfigCode } from '../../types';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface PaymentConfigBadgeProps {
  code: PaymentConfigCode;
  name: string;
}

interface ConfigStyleItem {
  variant: BadgeVariant;
  className: string;
}

const configStyles = {
  SALE_PAYMENT: {
    variant: 'default',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  FINANCING_PAYMENT: {
    variant: 'secondary',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  FINANCING_INSTALLMENTS_PAYMENT: {
    variant: 'secondary',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  RESERVATION_PAYMENT: {
    variant: 'outline',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  },
  LATE_FEE_PAYMENT: {
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
} as const satisfies Record<PaymentConfigCode, ConfigStyleItem>;

// Display names for payment types (shorter versions)
const displayNames: Record<PaymentConfigCode, string> = {
  SALE_PAYMENT: 'Pago total de venta',
  FINANCING_PAYMENT: 'Pago inicial',
  FINANCING_INSTALLMENTS_PAYMENT: 'Pago de Cuota',
  RESERVATION_PAYMENT: 'Pago de reserva',
  LATE_FEE_PAYMENT: 'Pago de Mora',
};

export function PaymentConfigBadge({ code, name }: PaymentConfigBadgeProps) {
  const config = configStyles[code];
  const displayName = displayNames[code] || name;

  return (
    <Badge variant={config.variant} className={config.className}>
      {displayName}
    </Badge>
  );
}

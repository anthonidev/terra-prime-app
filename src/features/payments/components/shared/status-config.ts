import type { StatusPayment } from '../../types';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface StatusConfigItem {
  label: string;
  variant: BadgeVariant;
}

export const statusConfig = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
} as const satisfies Record<StatusPayment, StatusConfigItem>;

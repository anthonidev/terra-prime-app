import type { StatusSale, StatusFinancingInstallments } from '../../types';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface StatusConfigItem {
  label: string;
  variant: BadgeVariant;
}

export const installmentStatusConfig = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  EXPIRED: { label: 'Vencida', variant: 'destructive' },
  PAID: { label: 'Pagada', variant: 'default' },
} as const satisfies Record<StatusFinancingInstallments, StatusConfigItem>;

export const statusConfig = {
  RESERVATION_PENDING: { label: 'Reserva Pendiente', variant: 'outline' },
  RESERVATION_PENDING_APPROVAL: { label: 'Reserva Por Aprobar', variant: 'secondary' },
  RESERVED: { label: 'Reservado', variant: 'default' },
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PENDING_APPROVAL: { label: 'Por Aprobar', variant: 'secondary' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  IN_PAYMENT_PROCESS: { label: 'En Proceso de Pago', variant: 'secondary' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  RESERVATION_IN_PAYMENT: { label: 'Reserva en Pago', variant: 'secondary' },
  IN_PAYMENT: { label: 'En Pago', variant: 'secondary' },
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
} as const satisfies Record<StatusSale, StatusConfigItem>;

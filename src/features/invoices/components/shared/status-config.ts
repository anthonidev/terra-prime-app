import { InvoiceStatus } from '../../types';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

export const invoiceStatusConfig: Record<InvoiceStatus, StatusConfig> = {
  [InvoiceStatus.DRAFT]: {
    label: 'Borrador',
    variant: 'outline',
  },
  [InvoiceStatus.PENDING]: {
    label: 'Pendiente',
    variant: 'outline',
  },
  [InvoiceStatus.SENT]: {
    label: 'Enviado',
    variant: 'secondary',
  },
  [InvoiceStatus.ACCEPTED]: {
    label: 'Aceptado',
    variant: 'default',
  },
  [InvoiceStatus.REJECTED]: {
    label: 'Rechazado',
    variant: 'destructive',
  },
  [InvoiceStatus.CANCELLED]: {
    label: 'Anulado',
    variant: 'destructive',
  },
};

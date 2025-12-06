import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, DollarSign, FileText, MapPin, Tag, User, Users, Download } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserInfo } from '@/shared/components/user-info';

import type { AdminSale, MySale, StatusSale } from '../../types';
import { AmountBreakdown } from './amount-breakdown';
import { statusConfig } from './status-config';

// Common column type that works for both AdminSale and MySale
type SaleCommonFields = {
  id: string;
  createdAt: string;
  type: string;
  client: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  lot: {
    name: string;
    project: string;
    block: string;
    stage: string;
  };
  totalAmount: number | string;
  totalAmountPaid?: number | null;
  totalAmountPending?: number | null;
  currency: 'USD' | 'PEN';
  status: StatusSale;
  radicationPdfUrl?: string | null;
  paymentAcordPdfUrl?: string | null;
};

// Date Column
export function createDateColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'createdAt',
    enableHiding: false,
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm leading-none font-semibold">
              {format(date, 'dd MMM', { locale: es })}
            </span>
            <span className="text-muted-foreground text-[11px] leading-none">
              {format(date, 'yyyy', { locale: es })}
            </span>
          </div>
        </div>
      );
    },
  };
}

// Type Column
export function createTypeColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'type',
    header: () => (
      <div className="flex items-center gap-2">
        <Tag className="text-muted-foreground h-4 w-4" />
        <span>Tipo</span>
      </div>
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant="outline" className="font-normal">
          {type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
        </Badge>
      );
    },
  };
}

// Client Column
export function createClientColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'client',
    enableHiding: false,
    header: 'Cliente',
    cell: ({ row }) => {
      const client = row.original.client;
      return <UserInfo name={`${client.firstName} ${client.lastName}`} phone={client.phone} />;
    },
  };
}

// Lot Column
export function createLotColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'lot',
    enableHiding: false,
    header: 'Lote',
    cell: ({ row }) => {
      const lot = row.original.lot;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm leading-none font-semibold">{lot.name}</span>
          <span className="text-muted-foreground text-[11px] leading-none">{lot.project}</span>
          <div className="mt-0.5 flex items-center gap-1">
            <Badge variant="outline" className="h-4 px-1 text-[10px] font-normal">
              {lot.stage}
            </Badge>
            <Badge variant="outline" className="h-4 px-1 text-[10px] font-normal">
              {lot.block}
            </Badge>
          </div>
        </div>
      );
    },
  };
}

// Total Amount Column
export function createTotalAmountColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'totalAmount',
    enableHiding: false,
    header: 'Monto Total',
    cell: ({ row }) => {
      const sale = row.original;
      const totalAmount = parseFloat(sale.totalAmount.toString());
      const paid = sale.totalAmountPaid || 0;
      const pending = sale.totalAmountPending || 0;

      return (
        <AmountBreakdown
          total={totalAmount}
          paid={paid}
          pending={pending}
          currency={sale.currency}
        />
      );
    },
  };
}

// Status Column
export function createStatusColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as StatusSale;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  };
}

// Combined Type and Status Column
export function createTypeAndStatusColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'type',
    id: 'typeAndStatus',
    enableHiding: true,
    header: 'Tipo y Estado',
    cell: ({ row }) => {
      const type = row.original.type;
      const status = row.original.status;
      const statusCfg = statusConfig[status];
      const isDirectPayment = type === 'DIRECT_PAYMENT';

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                isDirectPayment ? 'bg-green-500' : 'bg-blue-500'
              }`}
            />
            <span className="text-xs leading-none font-medium">
              {isDirectPayment ? 'Contado' : 'Financiado'}
            </span>
          </div>
          <Badge variant={statusCfg.variant} className="w-fit text-[11px] leading-tight">
            {statusCfg.label}
          </Badge>
        </div>
      );
    },
  };
}

// Unified Reports Column (works for both tables)
export function createReportsColumn<T extends SaleCommonFields>(): ColumnDef<T> {
  return {
    accessorKey: 'radicationPdfUrl',
    id: 'reports',
    header: 'Reportes',
    enableHiding: true,
    cell: ({ row }) => {
      const { radicationPdfUrl, paymentAcordPdfUrl } = row.original;
      const hasReports = radicationPdfUrl || paymentAcordPdfUrl;

      if (!hasReports) return <span className="text-muted-foreground text-xs">-</span>;

      return (
        <div className="flex gap-1">
          <TooltipProvider>
            {radicationPdfUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" asChild>
                    <a href={radicationPdfUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Radicación</TooltipContent>
              </Tooltip>
            )}
            {paymentAcordPdfUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" asChild>
                    <a href={paymentAcordPdfUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Acuerdo de Pagos</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      );
    },
  };
}

// Vendor Column (only for AdminSalesTable)
export function createVendorColumn(): ColumnDef<AdminSale> {
  return {
    accessorKey: 'vendor',
    enableHiding: true,
    header: 'Vendedor',
    cell: ({ row }) => {
      const vendor = row.original.vendor;
      if (!vendor) return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <UserInfo name={`${vendor.firstName} ${vendor.lastName}`} document={vendor.document} />
      );
    },
  };
}

// Participant Columns (only for AdminSalesTable)
export function createParticipantColumn(
  key: keyof Pick<AdminSale, 'liner' | 'closer' | 'telemarketingSupervisor' | 'fieldManager'>,
  header: string
): ColumnDef<AdminSale> {
  return {
    accessorKey: key,
    header,
    enableHiding: true,
    cell: ({ row }) => {
      const p = row.original[key];
      if (!p) return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <span className="text-sm">
          {p.firstName} {p.lastName}
        </span>
      );
    },
  };
}

// Hidden columns for financial details (works for both MySale and AdminSale)
type SaleWithFinancing = MySale | AdminSale;

// Combined Installments Column (Cuotas Lote + Cuotas HU)
export function createCombinedInstallmentsColumn<T extends SaleWithFinancing>(): ColumnDef<T> {
  return {
    accessorKey: 'financing',
    id: 'combinedInstallments',
    header: 'Cuotas',
    enableHiding: true,
    cell: ({ row }) => {
      const financing = row.original.financing;
      const urbanDevelopment = row.original.urbanDevelopment;
      const hasLot = financing?.quantityCoutes;
      const hasHU = urbanDevelopment?.quantityCoutes;

      if (!hasLot && !hasHU) return <span className="text-muted-foreground text-xs">-</span>;

      return (
        <div className="flex flex-col gap-1">
          {hasLot && (
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-blue-500" />
              <span className="text-xs leading-none">
                <span className="font-mono font-semibold">{financing.quantityCoutes}</span>
                <span className="text-muted-foreground ml-1">Lote</span>
              </span>
            </div>
          )}
          {hasHU && (
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-green-500" />
              <span className="text-xs leading-none">
                <span className="font-mono font-semibold">{urbanDevelopment.quantityCoutes}</span>
                <span className="text-muted-foreground ml-1">HU</span>
              </span>
            </div>
          )}
        </div>
      );
    },
  };
}

export function createFinancingQuantityCoutesColumn<T extends SaleWithFinancing>(): ColumnDef<T> {
  return {
    accessorKey: 'financing.quantityCoutes',
    id: 'financing.quantityCoutes',
    header: 'Cuotas Lote',
    enableHiding: true,
    cell: ({ row }) => {
      const financing = row.original.financing;
      if (!financing?.quantityCoutes)
        return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="font-mono">
            {financing.quantityCoutes} cuotas
          </Badge>
        </div>
      );
    },
  };
}

// Initial Amount Column (only Lote)
export function createCombinedInitialAmountColumn<T extends SaleWithFinancing>(): ColumnDef<T> {
  return {
    accessorKey: 'financing',
    id: 'combinedInitialAmount',
    header: 'Inicial Lote',
    enableHiding: true,
    cell: ({ row }) => {
      const financing = row.original.financing;

      if (!financing?.initialAmount)
        return <span className="text-muted-foreground text-xs">-</span>;

      const initial = parseFloat(financing.initialAmount);
      const paid = financing.initialAmountPaid || 0;
      const pending = financing.initialAmountPending || initial - paid;

      return (
        <AmountBreakdown
          total={initial}
          paid={paid}
          pending={pending}
          currency={row.original.currency}
        />
      );
    },
  };
}

export function createFinancingInitialAmountColumn<T extends SaleWithFinancing>(): ColumnDef<T> {
  return {
    accessorKey: 'financing.initialAmount',
    id: 'financing.initialAmount',
    header: 'Inicial Lote',
    enableHiding: true,
    cell: ({ row }) => {
      const financing = row.original.financing;
      if (!financing) return <span className="text-muted-foreground text-xs">-</span>;

      const initial = parseFloat(financing.initialAmount);
      const paid = financing.initialAmountPaid || 0;
      const pending = financing.initialAmountPending || initial - paid;

      return (
        <AmountBreakdown
          total={initial}
          paid={paid}
          pending={pending}
          currency={row.original.currency}
        />
      );
    },
  };
}

export function createUrbanDevelopmentQuantityCoutesColumn<
  T extends SaleWithFinancing,
>(): ColumnDef<T> {
  return {
    accessorKey: 'urbanDevelopment.quantityCoutes',
    id: 'urbanDevelopment.quantityCoutes',
    header: 'Cuotas HU',
    enableHiding: true,
    cell: ({ row }) => {
      const ud = row.original.urbanDevelopment;
      if (!ud?.quantityCoutes) return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="font-mono">
            {ud.quantityCoutes} cuotas
          </Badge>
        </div>
      );
    },
  };
}

export function createUrbanDevelopmentInitialAmountColumn<
  T extends SaleWithFinancing,
>(): ColumnDef<T> {
  return {
    accessorKey: 'urbanDevelopment.initialAmount',
    id: 'urbanDevelopment.initialAmount',
    header: 'Inicial HU',
    enableHiding: true,
    cell: ({ row }) => {
      const ud = row.original.urbanDevelopment;
      if (!ud) return <span className="text-muted-foreground text-xs">-</span>;

      const initial = parseFloat(ud.initialAmount);
      const paid = ud.initialAmountPaid || 0;
      const pending =
        typeof ud.initialAmountPending === 'string'
          ? parseFloat(ud.initialAmountPending)
          : ud.initialAmountPending || initial - paid;

      return (
        <AmountBreakdown
          total={initial}
          paid={paid}
          pending={pending}
          currency={row.original.currency}
        />
      );
    },
  };
}

export function createReservationAmountColumn<T extends SaleWithFinancing>(): ColumnDef<T> {
  return {
    accessorKey: 'reservationAmount',
    header: 'Reserva',
    enableHiding: true,
    cell: ({ row }) => {
      const sale = row.original;
      if (!sale.reservationAmount) return <span className="text-muted-foreground text-xs">-</span>;

      const total =
        typeof sale.reservationAmount === 'string'
          ? parseFloat(sale.reservationAmount)
          : sale.reservationAmount;
      const paid = sale.reservationAmountPaid || 0;
      const pending = sale.reservationAmountPending || total - paid;

      return (
        <AmountBreakdown
          total={total}
          paid={paid}
          pending={pending}
          currency={row.original.currency}
        />
      );
    },
  };
}

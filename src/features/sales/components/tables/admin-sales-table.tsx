'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Eye, Users, FileText, FilePlus, MoreVertical } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { type PaginationMeta } from '@/shared/types/pagination';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import type { AdminSale } from '../../types';
import { AssignParticipantsModal } from '../dialogs/assign-participants-modal';
import {
  useGenerateRadicationPdf,
  useRegenerateRadicationPdf,
  useGeneratePaymentAccordPdf,
  useRegeneratePaymentAccordPdf,
} from '../../hooks/use-generate-pdfs';
import {
  createDateColumn,
  createVendorColumn,
  createClientColumn,
  createLotColumn,
  createTotalAmountColumn,
  createTypeAndStatusColumn,
  createCombinedInstallmentsColumn,
  createCombinedInitialAmountColumn,
  createReservationAmountColumn,
  createReportsColumn,
} from '../shared/column-definitions';

interface AdminSalesTableProps {
  data: AdminSale[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

function ActionsCell({ sale }: { sale: AdminSale }) {
  const { user } = useAuth();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const generateRadicationPdf = useGenerateRadicationPdf();
  const regenerateRadicationPdf = useRegenerateRadicationPdf();
  const generatePaymentAccordPdf = useGeneratePaymentAccordPdf();
  const regeneratePaymentAccordPdf = useRegeneratePaymentAccordPdf();

  const isJVE = user?.role?.code === 'JVE';

  const handleGenerateRadication = () => {
    if (sale.radicationPdfUrl) {
      regenerateRadicationPdf.mutate(sale.id);
    } else {
      generateRadicationPdf.mutate(sale.id);
    }
  };

  const handleGeneratePaymentAccord = () => {
    if (sale.paymentAcordPdfUrl) {
      regeneratePaymentAccordPdf.mutate(sale.id);
    } else {
      generatePaymentAccordPdf.mutate(sale.id);
    }
  };

  const isLoading =
    generateRadicationPdf.isPending ||
    regenerateRadicationPdf.isPending ||
    generatePaymentAccordPdf.isPending ||
    regeneratePaymentAccordPdf.isPending;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/ventas/detalle/${sale.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Link>
        </Button>

        {isJVE && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsAssignModalOpen(true)}>
                <Users className="mr-2 h-4 w-4" />
                Asignar Participantes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleGenerateRadication}>
                {sale.radicationPdfUrl ? (
                  <>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Regenerar PDF Radicación
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generar PDF Radicación
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGeneratePaymentAccord}>
                {sale.paymentAcordPdfUrl ? (
                  <>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Regenerar PDF Acuerdo de Pagos
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generar PDF Acuerdo de Pagos
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isJVE && (
        <AssignParticipantsModal
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          saleId={sale.id}
        />
      )}
    </>
  );
}

const columns: ColumnDef<AdminSale>[] = [
  createDateColumn<AdminSale>(),
  createVendorColumn(),
  createClientColumn<AdminSale>(),
  createLotColumn<AdminSale>(),
  createTypeAndStatusColumn<AdminSale>(),
  createTotalAmountColumn<AdminSale>(),

  // Financial Columns (Hidden by default)
  createCombinedInstallmentsColumn<AdminSale>(),
  createCombinedInitialAmountColumn<AdminSale>(),
  createReservationAmountColumn<AdminSale>(),

  createReportsColumn<AdminSale>(),
  {
    id: 'actions',
    header: 'Acciones',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell sale={row.original} />,
  },
];

export function AdminSalesTable({ data, meta, onPageChange }: AdminSalesTableProps) {
  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        enableColumnVisibility={true}
        initialColumnVisibility={{
          combinedInstallments: false,
          combinedInitialAmount: false,
          reservationAmount: false,
        }}
        storageKey="admin-sales-table-columns-v3"
      />

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}

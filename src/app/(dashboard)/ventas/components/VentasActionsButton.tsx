'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MoreHorizontal, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PaymentSummary } from './PaymentSummary';
import { SaleList, StatusSale } from '@domain/entities/sales/salevendor.entity';
import { ExtendSeparation } from './ExtendSeparation';

interface Props {
  sale: SaleList;
}

export default function VentasActionsButton({ sale }: Props) {
  const router = useRouter();
  const [state, setState] = useState<{
    pagoModal: boolean;
    extendModal: boolean;
  }>({
    pagoModal: false,
    extendModal: false
  });

  const handlePagoModal = () => setState({ ...state, pagoModal: true });
  const handleExtendModal = () => setState({ ...state, extendModal: true });

  const handleClosePagoModal = () => setState({ ...state, pagoModal: false });
  const handleCloseExtendModal = () => setState({ ...state, extendModal: false });

  const handleVerDetalle = async () => router.push(`/ventas/detalle/${sale.id}`);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleVerDetalle}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalle
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handlePagoModal}
            disabled={
              sale.status === StatusSale.IN_PAYMENT_PROCESS ||
              sale.status === StatusSale.PENDING_APPROVAL ||
              sale.status === StatusSale.COMPLETED ||
              sale.status === StatusSale.RESERVATION_PENDING_APPROVAL
            }
          >
            <Receipt className="mr-2 h-4 w-4" />
            Registrar pago
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleExtendModal}
            disabled={
              sale.status !== StatusSale.RESERVATION_PENDING || sale.reservationAmount === '0'
            }
          >
            <Receipt className="mr-2 h-4 w-4" />
            Extender separación
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PaymentSummary isOpen={state.pagoModal} onClose={handleClosePagoModal} sale={sale} />
      <ExtendSeparation isOpen={state.extendModal} onClose={handleCloseExtendModal} sale={sale} />
    </>
  );
}

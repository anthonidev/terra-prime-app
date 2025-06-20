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

interface Props {
  sale: SaleList;
}

export default function VentasActionsButton({ sale }: Props) {
  const router = useRouter();
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleVerDetalle = async () => {
    router.push(`/ventas/detalle/${sale.id}`);
  };

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
            onClick={() => setOpen(true)}
            disabled={
              sale.status === StatusSale.IN_PAYMENT_PROCESS ||
              sale.status === StatusSale.PENDING_APPROVAL
            }
          >
            <Receipt className="mr-2 h-4 w-4" />
            Registrar pago
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PaymentSummary isOpen={isOpen} onClose={() => setOpen(false)} sale={sale} />
    </>
  );
}

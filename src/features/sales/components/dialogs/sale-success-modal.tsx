'use client';

import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CreatedSaleResponse } from '../../types';

interface SaleSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: CreatedSaleResponse | null;
}

export function SaleSuccessModal({ open, onOpenChange, sale }: SaleSuccessModalProps) {
  const router = useRouter();

  if (!sale) return null;

  const handleViewSale = () => {
    onOpenChange(false);
    router.push(`/ventas/detalle/${sale.id}`);
  };

  const handleViewMySales = () => {
    onOpenChange(false);
    router.push('/ventas/mis-ventas');
  };

  const handleCreateAnother = () => {
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <DialogTitle className="text-center text-2xl">¡Venta Registrada!</DialogTitle>
          <DialogDescription className="text-center">
            La venta se ha registrado exitosamente en el sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">ID de Venta:</div>
            <div className="font-medium">{sale.id.slice(0, 8).toUpperCase()}</div>

            <div className="text-muted-foreground">Cliente:</div>
            <div className="font-medium">
              {sale.client.firstName} {sale.client.lastName}
            </div>

            <div className="text-muted-foreground">Lote:</div>
            <div className="font-medium">{sale.lot.name}</div>

            <div className="text-muted-foreground">Monto Total:</div>
            <div className="font-medium">
              {sale.currency} {sale.totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>

            <div className="text-muted-foreground">Tipo:</div>
            <div className="font-medium">
              {sale.type === 'FINANCED' ? 'Financiado' : 'Pago Directo'}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleViewSale} className="w-full">
            Ver Detalle de Venta
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" onClick={handleViewMySales} className="w-full">
              Mis Ventas
            </Button>
            <Button variant="secondary" onClick={handleCreateAnother} className="w-full">
              Crear Otra
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

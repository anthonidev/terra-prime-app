'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Bell } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SaleModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-96 w-full max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Bell className="h-5 w-5" />
            Notificación
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-md bg-gray-50 p-4 text-center text-gray-500">
          No hay vendedores disponibles
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            className="border-input hover:bg-accent"
          >
            Ver todas las ventas
          </Button>
          <Button type="button" className="text-primary-foreground bg-green-600 hover:bg-green-500">
            Ver detalles de la venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

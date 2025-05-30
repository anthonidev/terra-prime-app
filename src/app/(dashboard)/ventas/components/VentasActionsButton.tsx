'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SaleResponse } from '@/types/sales';
import { Eye, MoreHorizontal, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { registrarPago } from '../action';

interface VentasActionsButtonProps {
  sale: SaleResponse;
}

export default function VentasActionsButton({ sale }: VentasActionsButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerDetalle = async () => {
    router.push(`/ventas/detalle/${sale.id}`);
  };

  const handleRegistrarPago = async () => {
    setIsLoading(true);
    try {
      const result = await registrarPago(sale.id);

      if (result.success) {
        toast.success('Pago registrado correctamente');
        router.refresh();
      } else {
        toast.error(result.error || 'Error al registrar pago');
      }
    } catch {
      toast.error('Error al registrar pago');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleVerDetalle} disabled={isLoading}>
          <Eye className="mr-2 h-4 w-4" />
          {isLoading ? 'Cargando...' : 'Ver detalle'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleRegistrarPago} disabled={isLoading}>
          <Receipt className="mr-2 h-4 w-4" />
          {isLoading ? 'Registrando...' : 'Registrar pago'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

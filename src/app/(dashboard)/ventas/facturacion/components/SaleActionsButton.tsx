'use client';

import { useState } from 'react';
import { MoreHorizontal, UserPlus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import AssignParticipantModal from './AssignParticipantModal';
import SaleDetailModal from './SaleDetailModal';

interface Props {
  sale: SaleList;
}

export default function SaleActionsButton({ sale }: Props) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setIsDetailModalOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAssignModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar Participante
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignParticipantModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        sale={sale}
      />

      <SaleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        sale={sale}
      />
    </>
  );
}

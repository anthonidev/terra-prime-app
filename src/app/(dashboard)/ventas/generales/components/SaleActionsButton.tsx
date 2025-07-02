'use client';

import { useState } from 'react';
import { MoreHorizontal, UserPlus, Eye, FileArchive, RefreshCw } from 'lucide-react';
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
import { toast } from 'sonner';
import {
  generateAcordPayment,
  generateRadicationPayment,
  regenerateAcordPayment,
  regenerateRadicationPayment
} from '@/lib/infrastructure/server-actions/sales.actions';

interface Props {
  sale: SaleList;
}

const DOCUMENTS = {
  acord: {
    field: 'paymentAcordPdfUrl' as keyof SaleList,
    generateAction: generateAcordPayment,
    regenerateAction: regenerateAcordPayment,
    generateLabel: 'Generar acuerdo de pago',
    regenerateLabel: 'Regenerar acuerdo de pago'
  },
  radication: {
    field: 'radicationPdfUrl' as keyof SaleList,
    generateAction: generateRadicationPayment,
    regenerateAction: regenerateRadicationPayment,
    generateLabel: 'Generar hoja de radicación',
    regenerateLabel: 'Regenerar hoja de radicación'
  }
} as const;

type DocumentKey = keyof typeof DOCUMENTS;

export default function SaleActionsButton({ sale }: Props) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<DocumentKey, boolean>>({
    acord: false,
    radication: false
  });

  const handleDocumentAction = async (documentKey: DocumentKey) => {
    const document = DOCUMENTS[documentKey];
    const hasDocument = Boolean(sale[document.field]);
    const action = hasDocument ? document.regenerateAction : document.generateAction;

    setLoadingStates((prev) => ({ ...prev, [documentKey]: true }));

    try {
      const result = await action(sale.id);
      if (result?.success) {
        toast.success('Reporte procesado correctamente');
      } else {
        toast.error('Error al procesar el reporte');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar el reporte');
    } finally {
      setLoadingStates((prev) => ({ ...prev, [documentKey]: false }));
    }
  };

  const renderDocumentItem = (documentKey: DocumentKey) => {
    const document = DOCUMENTS[documentKey];
    const hasDocument = Boolean(sale[document.field]);
    const isLoading = loadingStates[documentKey];

    return (
      <DropdownMenuItem
        key={documentKey}
        onClick={() => handleDocumentAction(documentKey)}
        disabled={isLoading}
      >
        {hasDocument ? (
          <RefreshCw className="mr-2 h-4 w-4" />
        ) : (
          <FileArchive className="mr-2 h-4 w-4" />
        )}
        {isLoading
          ? 'Procesando...'
          : hasDocument
            ? document.regenerateLabel
            : document.generateLabel}
      </DropdownMenuItem>
    );
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
          <DropdownMenuItem onClick={() => setIsDetailModalOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalle
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsAssignModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar Participante
          </DropdownMenuItem>

          {Object.keys(DOCUMENTS).map((key) => renderDocumentItem(key as DocumentKey))}
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

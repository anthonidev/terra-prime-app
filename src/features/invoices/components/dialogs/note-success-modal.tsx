'use client';

import { CheckCircle2, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentType, DocumentTypeLabels, InvoiceStatusLabels, type Invoice } from '../../types';

interface NoteSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function NoteSuccessModal({ open, onOpenChange, invoice }: NoteSuccessModalProps) {
  if (!invoice) return null;

  const handleDownloadPdf = () => {
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const isDebitNote = invoice.documentType === DocumentType.DEBIT_NOTE;
  const noteTypeLabel = isDebitNote ? 'Nota de Débito' : 'Nota de Crédito';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isDebitNote ? 'bg-orange-500/10' : 'bg-green-500/10'
            }`}
          >
            <CheckCircle2
              className={`h-6 w-6 ${isDebitNote ? 'text-orange-600' : 'text-green-600'}`}
            />
          </div>
          <DialogTitle className="text-center">{noteTypeLabel} Generada</DialogTitle>
          <DialogDescription className="text-center">
            La {noteTypeLabel.toLowerCase()} ha sido generada exitosamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Invoice Number */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-muted-foreground mb-1 text-sm">
              {DocumentTypeLabels[invoice.documentType]}
            </p>
            <p className="text-2xl font-bold">{invoice.fullNumber}</p>
          </div>

          {/* Invoice Details */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estado:</span>
              <Badge variant="outline">{InvoiceStatusLabels[invoice.status]}</Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="max-w-[200px] truncate font-medium">{invoice.clientName}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Documento:</span>
              <span className="font-medium">{invoice.clientDocumentNumber}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold">{formatCurrency(invoice.total)}</span>
            </div>

            {invoice.notes && invoice.notes.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Comprobante Relacionado:</span>
                <span className="font-medium">{invoice.notes[0].fullNumber}</span>
              </div>
            )}

            {invoice.noteReasonDescription && (
              <div className="text-sm">
                <span className="text-muted-foreground">Motivo:</span>
                <p className="mt-1 font-medium">{invoice.noteReasonDescription}</p>
              </div>
            )}

            {invoice.issueDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha de Emisión:</span>
                <span className="font-medium">
                  {new Date(invoice.issueDate).toLocaleDateString('es-PE')}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
          {invoice.pdfUrl && (
            <Button type="button" onClick={handleDownloadPdf} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

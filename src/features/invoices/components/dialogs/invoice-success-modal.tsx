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
import { DocumentTypeLabels, InvoiceStatusLabels, type Invoice } from '../../types';

interface InvoiceSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceSuccessModal({ open, onOpenChange, invoice }: InvoiceSuccessModalProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Comprobante Generado</DialogTitle>
          <DialogDescription className="text-center">
            El comprobante ha sido generado exitosamente.
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

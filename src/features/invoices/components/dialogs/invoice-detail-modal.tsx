'use client';

import { Download, FileText, ExternalLink } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
  DocumentTypeLabels,
  InvoiceStatusLabels,
  InvoiceStatus,
  ClientDocumentTypeLabels,
  type Invoice,
} from '../../types';

interface InvoiceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceDetailModal({ open, onOpenChange, invoice }: InvoiceDetailModalProps) {
  if (!invoice) return null;

  const handleDownloadPdf = () => {
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
    }
  };

  const handleDownloadXml = () => {
    if (invoice.xmlUrl) {
      window.open(invoice.xmlUrl, '_blank');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusVariant = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.ACCEPTED:
        return 'default';
      case InvoiceStatus.REJECTED:
        return 'destructive';
      case InvoiceStatus.CANCELLED:
        return 'secondary';
      case InvoiceStatus.PENDING:
      case InvoiceStatus.SENT:
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            Detalle del Comprobante
          </DialogTitle>
          <DialogDescription>Información del comprobante electrónico generado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Invoice Header */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {DocumentTypeLabels[invoice.documentType]}
                </p>
                <p className="text-2xl font-bold">{invoice.fullNumber}</p>
              </div>
              <Badge variant={getStatusVariant(invoice.status)}>
                {InvoiceStatusLabels[invoice.status]}
              </Badge>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Información del Cliente</h4>
            <div className="bg-muted/30 space-y-2 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nombre / Razón Social:</span>
                <span className="max-w-[200px] truncate text-right font-medium">
                  {invoice.clientName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {ClientDocumentTypeLabels[invoice.clientDocumentType]}:
                </span>
                <span className="font-medium">{invoice.clientDocumentNumber}</span>
              </div>
              {invoice.clientAddress && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dirección:</span>
                  <span className="max-w-[200px] truncate text-right font-medium">
                    {invoice.clientAddress}
                  </span>
                </div>
              )}
              {invoice.clientEmail && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Correo:</span>
                  <span className="font-medium">{invoice.clientEmail}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Financial Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Detalle Financiero</h4>
            <div className="space-y-2">
              {invoice.totalTaxed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Gravado:</span>
                  <span>{formatCurrency(invoice.totalTaxed)}</span>
                </div>
              )}
              {invoice.totalUnaffected > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Inafecto:</span>
                  <span>{formatCurrency(invoice.totalUnaffected)}</span>
                </div>
              )}
              {invoice.totalExonerated > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Exonerado:</span>
                  <span>{formatCurrency(invoice.totalExonerated)}</span>
                </div>
              )}
              {invoice.totalIgv > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IGV (18%):</span>
                  <span>{formatCurrency(invoice.totalIgv)}</span>
                </div>
              )}
              {invoice.totalDiscounts > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Descuentos:</span>
                  <span className="text-destructive">
                    -{formatCurrency(invoice.totalDiscounts)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Fechas</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha de Emisión:</span>
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              {invoice.dueDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha de Vencimiento:</span>
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha de Creación:</span>
                <span>{formatDate(invoice.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* SUNAT Response */}
          {invoice.sunatDescription && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Respuesta SUNAT</h4>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm">{invoice.sunatDescription}</p>
                  {invoice.sunatNote && (
                    <p className="text-muted-foreground mt-2 text-xs">{invoice.sunatNote}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Observations */}
          {invoice.observations && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Observaciones</h4>
                <p className="text-muted-foreground text-sm">{invoice.observations}</p>
              </div>
            </>
          )}
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
          {invoice.xmlUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadXml}
              className="w-full sm:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver XML
            </Button>
          )}
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

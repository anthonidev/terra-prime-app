'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  ExternalLink,
  FilePlus2,
  FileMinus2,
  ChevronRight,
} from 'lucide-react';
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
  DocumentType,
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
  const [selectedNote, setSelectedNote] = useState<Invoice | null>(null);
  const [noteDetailOpen, setNoteDetailOpen] = useState(false);

  if (!invoice) return null;

  const handleNoteClick = (note: Invoice) => {
    setSelectedNote(note);
    setNoteDetailOpen(true);
  };

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

          {/* Related Notes (Credit/Debit Notes) */}
          {invoice.notes && invoice.notes.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Notas Relacionadas</h4>
                <div className="space-y-2">
                  {invoice.notes.map((note) => {
                    const isDebitNote = note.documentType === DocumentType.DEBIT_NOTE;
                    const isCreditNote = note.documentType === DocumentType.CREDIT_NOTE;

                    return (
                      <button
                        key={note.id}
                        onClick={() => handleNoteClick(note)}
                        className="hover:bg-muted/50 group flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isDebitNote
                                ? 'bg-orange-500/10'
                                : isCreditNote
                                  ? 'bg-purple-500/10'
                                  : 'bg-muted'
                            }`}
                          >
                            {isDebitNote ? (
                              <FilePlus2 className="h-4 w-4 text-orange-600" />
                            ) : isCreditNote ? (
                              <FileMinus2 className="h-4 w-4 text-purple-600" />
                            ) : (
                              <FileText className="text-muted-foreground h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{note.fullNumber}</p>
                            <p className="text-muted-foreground text-xs">
                              {DocumentTypeLabels[note.documentType]} - {formatCurrency(note.total)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(note.status)} className="text-xs">
                            {InvoiceStatusLabels[note.status]}
                          </Badge>
                          <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </button>
                    );
                  })}
                </div>
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

      {/* Note Detail Modal */}
      <NoteDetailModal open={noteDetailOpen} onOpenChange={setNoteDetailOpen} note={selectedNote} />
    </Dialog>
  );
}

// Separate component for Note Detail Modal
interface NoteDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Invoice | null;
}

function NoteDetailModal({ open, onOpenChange, note }: NoteDetailModalProps) {
  if (!note) return null;

  const handleDownloadPdf = () => {
    if (note.pdfUrl) {
      window.open(note.pdfUrl, '_blank');
    }
  };

  const handleDownloadXml = () => {
    if (note.xmlUrl) {
      window.open(note.xmlUrl, '_blank');
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

  const isDebitNote = note.documentType === DocumentType.DEBIT_NOTE;
  const isCreditNote = note.documentType === DocumentType.CREDIT_NOTE;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDebitNote ? (
              <FilePlus2 className="h-5 w-5 text-orange-600" />
            ) : isCreditNote ? (
              <FileMinus2 className="h-5 w-5 text-purple-600" />
            ) : (
              <FileText className="text-primary h-5 w-5" />
            )}
            Detalle de {DocumentTypeLabels[note.documentType]}
          </DialogTitle>
          <DialogDescription>Información de la nota electrónica generada.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Note Header */}
          <div
            className={`rounded-lg p-4 ${
              isDebitNote ? 'bg-orange-500/10' : isCreditNote ? 'bg-purple-500/10' : 'bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {DocumentTypeLabels[note.documentType]}
                </p>
                <p className="text-2xl font-bold">{note.fullNumber}</p>
              </div>
              <Badge variant={getStatusVariant(note.status)}>
                {InvoiceStatusLabels[note.status]}
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
                  {note.clientName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {ClientDocumentTypeLabels[note.clientDocumentType]}:
                </span>
                <span className="font-medium">{note.clientDocumentNumber}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Note Reason */}
          {note.noteReasonDescription && (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Motivo</h4>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm">{note.noteReasonDescription}</p>
                  {note.noteReasonCode && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Código: {note.noteReasonCode}
                    </p>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Financial Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Detalle Financiero</h4>
            <div className="space-y-2">
              {note.totalTaxed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Gravado:</span>
                  <span>{formatCurrency(note.totalTaxed)}</span>
                </div>
              )}
              {note.totalUnaffected > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Inafecto:</span>
                  <span>{formatCurrency(note.totalUnaffected)}</span>
                </div>
              )}
              {note.totalExonerated > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Exonerado:</span>
                  <span>{formatCurrency(note.totalExonerated)}</span>
                </div>
              )}
              {note.totalIgv > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IGV (18%):</span>
                  <span>{formatCurrency(note.totalIgv)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total:</span>
                <span
                  className={
                    isDebitNote ? 'text-orange-600' : isCreditNote ? 'text-purple-600' : ''
                  }
                >
                  {formatCurrency(note.total)}
                </span>
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
                <span>{formatDate(note.issueDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha de Creación:</span>
                <span>{formatDate(note.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* SUNAT Response */}
          {note.sunatDescription && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Respuesta SUNAT</h4>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm">{note.sunatDescription}</p>
                  {note.sunatNote && (
                    <p className="text-muted-foreground mt-2 text-xs">{note.sunatNote}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Observations */}
          {note.observations && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Observaciones</h4>
                <p className="text-muted-foreground text-sm">{note.observations}</p>
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
          {note.xmlUrl && (
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
          {note.pdfUrl && (
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

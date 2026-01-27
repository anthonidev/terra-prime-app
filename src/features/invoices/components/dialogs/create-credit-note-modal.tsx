'use client';

import { useState } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/shared/lib/api-client';
import {
  CreditNoteType,
  CreditNoteTypeLabels,
  type Invoice,
  type CreateCreditNoteInput,
} from '../../types';

interface CreateCreditNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedInvoice: Invoice;
  paymentId: string;
  onSuccess: (invoice: Invoice) => void;
}

export function CreateCreditNoteModal({
  open,
  onOpenChange,
  relatedInvoice,
  paymentId,
  onSuccess,
}: CreateCreditNoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creditNoteType, setCreditNoteType] = useState<CreditNoteType | ''>('');
  const [reasonDescription, setReasonDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!creditNoteType) {
      newErrors.creditNoteType = 'Seleccione un tipo de nota de crédito';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const data: CreateCreditNoteInput = {
        relatedInvoiceId: relatedInvoice.id,
        creditNoteType: creditNoteType as CreditNoteType,
        ...(reasonDescription.trim() && { reasonDescription: reasonDescription.trim() }),
      };

      const response = await apiClient.post('/api/invoices/credit-note', data);

      toast.success('Nota de crédito creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['invoice-by-payment', paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payment-detail', paymentId] });
      handleClose();
      onSuccess(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la nota de crédito');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCreditNoteType('');
      setReasonDescription('');
      setErrors({});
      onOpenChange(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Crear Nota de Crédito
          </DialogTitle>
          <DialogDescription>
            Crear una nota de crédito relacionada al comprobante {relatedInvoice.fullNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Related Invoice Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Comprobante Relacionado</p>
            <p className="font-medium">{relatedInvoice.fullNumber}</p>
            <p className="text-muted-foreground text-sm">{relatedInvoice.clientName}</p>
            <p className="mt-1 text-sm font-medium">
              Total: {formatCurrency(relatedInvoice.total)}
            </p>
          </div>

          {/* Credit Note Type */}
          <div className="space-y-2">
            <Label htmlFor="creditNoteType">Tipo de Nota de Crédito *</Label>
            <Select
              value={creditNoteType.toString()}
              onValueChange={(value) => {
                setCreditNoteType(parseInt(value) as CreditNoteType);
                if (errors.creditNoteType) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.creditNoteType;
                    return newErrors;
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CreditNoteTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.creditNoteType && (
              <p className="text-destructive text-sm">{errors.creditNoteType}</p>
            )}
          </div>

          {/* Reason Description */}
          <div className="space-y-2">
            <Label htmlFor="reasonDescription">Descripción del Motivo (Opcional)</Label>
            <Textarea
              id="reasonDescription"
              placeholder="Describa el motivo de la nota de crédito"
              value={reasonDescription}
              onChange={(e) => setReasonDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Nota de Crédito'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

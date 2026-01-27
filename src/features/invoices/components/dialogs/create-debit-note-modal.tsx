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
import { Input } from '@/components/ui/input';
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
  DebitNoteType,
  DebitNoteTypeLabels,
  type Invoice,
  type CreateDebitNoteInput,
} from '../../types';

interface CreateDebitNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedInvoice: Invoice;
  paymentId: string;
  onSuccess: (invoice: Invoice) => void;
}

export function CreateDebitNoteModal({
  open,
  onOpenChange,
  relatedInvoice,
  paymentId,
  onSuccess,
}: CreateDebitNoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [debitNoteType, setDebitNoteType] = useState<DebitNoteType | ''>('');
  const [chargeDescription, setChargeDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }

    if (!debitNoteType) {
      newErrors.debitNoteType = 'Seleccione un tipo de nota de débito';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const data: CreateDebitNoteInput = {
        relatedInvoiceId: relatedInvoice.id,
        amount: parseFloat(amount),
        debitNoteType: debitNoteType as DebitNoteType,
        ...(chargeDescription.trim() && { chargeDescription: chargeDescription.trim() }),
        ...(observations.trim() && { observations: observations.trim() }),
      };

      const response = await apiClient.post('/api/invoices/debit-note', data);

      toast.success('Nota de débito creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['invoice-by-payment', paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payment-detail', paymentId] });
      handleClose();
      onSuccess(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la nota de débito');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount('');
      setDebitNoteType('');
      setChargeDescription('');
      setObservations('');
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Crear Nota de Débito
          </DialogTitle>
          <DialogDescription>
            Crear una nota de débito relacionada al comprobante {relatedInvoice.fullNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Related Invoice Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Comprobante Relacionado</p>
            <p className="font-medium">{relatedInvoice.fullNumber}</p>
            <p className="text-muted-foreground text-sm">{relatedInvoice.clientName}</p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.amount;
                    return newErrors;
                  });
                }
              }}
            />
            {errors.amount && <p className="text-destructive text-sm">{errors.amount}</p>}
          </div>

          {/* Debit Note Type */}
          <div className="space-y-2">
            <Label htmlFor="debitNoteType">Tipo de Nota de Débito *</Label>
            <Select
              value={debitNoteType.toString()}
              onValueChange={(value) => {
                setDebitNoteType(parseInt(value) as DebitNoteType);
                if (errors.debitNoteType) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.debitNoteType;
                    return newErrors;
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DebitNoteTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.debitNoteType && (
              <p className="text-destructive text-sm">{errors.debitNoteType}</p>
            )}
          </div>

          {/* Charge Description */}
          <div className="space-y-2">
            <Label htmlFor="chargeDescription">Descripción del Cargo (Opcional)</Label>
            <Input
              id="chargeDescription"
              type="text"
              placeholder="Descripción del cargo"
              value={chargeDescription}
              onChange={(e) => setChargeDescription(e.target.value)}
            />
          </div>

          {/* Observations */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones (Opcional)</Label>
            <Textarea
              id="observations"
              placeholder="Observaciones adicionales"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
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
              'Crear Nota de Débito'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

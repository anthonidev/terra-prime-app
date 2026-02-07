'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Send, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
  VoucherForm,
  type VoucherFormData,
} from '@/features/sales/components/containers/components/voucher-form';
import { apiClient } from '@/shared/lib/api-client';
import { getTodayDateInputValue } from '@/shared/utils/date-formatter';

interface RegisterReservationPaymentApprovedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: string;
  currency?: string;
  reservationAmount: number;
  reservationAmountPaid: number;
  reservationAmountPending: number;
  onSuccess?: () => void;
}

const initialVoucherData: VoucherFormData = {
  bankName: '',
  transactionReference: '',
  transactionDate: '',
  amount: '',
  codeOperation: '',
  file: null,
};

export function RegisterReservationPaymentApprovedModal({
  open,
  onOpenChange,
  saleId,
  currency = 'PEN',
  reservationAmount,
  reservationAmountPaid,
  reservationAmountPending,
  onSuccess,
}: RegisterReservationPaymentApprovedModalProps) {
  const [vouchers, setVouchers] = useState<VoucherFormData[]>([{ ...initialVoucherData }]);
  const [dateOperation, setDateOperation] = useState<string>(getTodayDateInputValue());
  const [numberTicket, setNumberTicket] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  const totalAmount = useMemo(() => {
    return vouchers.reduce((sum, voucher) => {
      const amount = parseFloat(voucher.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [vouchers]);

  const exceedsLimit = totalAmount > reservationAmountPending;

  const handleAddVoucher = () => {
    setVouchers([...vouchers, { ...initialVoucherData }]);
  };

  const handleRemoveVoucher = (index: number) => {
    if (vouchers.length === 1) return;
    const newVouchers = vouchers.filter((_, i) => i !== index);
    setVouchers(newVouchers);

    const newErrors = { ...errors };
    delete newErrors[index];

    const reindexedErrors: Record<number, Record<string, string>> = {};
    Object.keys(newErrors).forEach((key) => {
      const oldIndex = parseInt(key);
      const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
      reindexedErrors[newIndex] = newErrors[oldIndex];
    });
    setErrors(reindexedErrors);
  };

  const handleVoucherChange = (index: number, data: VoucherFormData) => {
    const newVouchers = [...vouchers];
    newVouchers[index] = data;
    setVouchers(newVouchers);

    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newFormErrors: Record<string, string> = {};

    if (!dateOperation) {
      newFormErrors.dateOperation = 'La fecha de operación es requerida';
    }

    setFormErrors(newFormErrors);
    return Object.keys(newFormErrors).length === 0;
  };

  const validateVouchers = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    vouchers.forEach((voucher, index) => {
      const voucherErrors: Record<string, string> = {};

      if (!voucher.transactionReference.trim()) {
        voucherErrors.transactionReference = 'La referencia es requerida';
        isValid = false;
      }

      if (!voucher.codeOperation.trim()) {
        voucherErrors.codeOperation = 'El código de operación es requerido';
        isValid = false;
      }

      if (!voucher.transactionDate) {
        voucherErrors.transactionDate = 'La fecha es requerida';
        isValid = false;
      }

      const amount = parseFloat(voucher.amount);
      if (!voucher.amount || isNaN(amount) || amount <= 0) {
        voucherErrors.amount = 'Ingrese un monto válido mayor a 0';
        isValid = false;
      }

      if (!voucher.bankName) {
        voucherErrors.bankName = 'El banco es requerido';
        isValid = false;
      }

      if (!voucher.file) {
        voucherErrors.file = 'El comprobante es requerido';
        isValid = false;
      }

      if (Object.keys(voucherErrors).length > 0) {
        newErrors[index] = voucherErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isFormValid = validateForm();
    const areVouchersValid = validateVouchers();

    if (!isFormValid || !areVouchersValid) {
      return;
    }

    if (totalAmount <= 0) {
      toast.error('El monto total debe ser mayor a 0');
      return;
    }

    if (totalAmount > reservationAmountPending) {
      toast.error(
        `El monto total (${currencySymbol} ${totalAmount.toFixed(2)}) excede el monto pendiente (${currencySymbol} ${reservationAmountPending.toFixed(2)})`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append('amountPaid', totalAmount.toString());
      formData.append('dateOperation', dateOperation);
      if (numberTicket.trim()) {
        formData.append('numberTicket', numberTicket.trim());
      }
      if (observation.trim()) {
        formData.append('observation', observation.trim());
      }

      vouchers.forEach((voucher, index) => {
        formData.append(`payments[${index}][amount]`, voucher.amount);
        formData.append(`payments[${index}][transactionDate]`, voucher.transactionDate);
        formData.append(`payments[${index}][transactionReference]`, voucher.transactionReference);
        formData.append(`payments[${index}][bankName]`, voucher.bankName || '');
        formData.append(`payments[${index}][codeOperation]`, voucher.codeOperation);
        formData.append(`payments[${index}][fileIndex]`, index.toString());

        if (voucher.file) {
          formData.append('files', voucher.file);
        }
      });

      await apiClient.post(`/api/sales/reservation/paid-approved/${saleId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Pago de separación registrado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['sale-detail', saleId] });
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      let message = 'Error al registrar el pago de separación';
      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setVouchers([{ ...initialVoucherData }]);
      setDateOperation(getTodayDateInputValue());
      setNumberTicket('');
      setObservation('');
      setErrors({});
      setFormErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Registrar Pago de Separación</DialogTitle>
          <DialogDescription>
            Registre un pago de separación para la venta. Este pago será aprobado automáticamente.
          </DialogDescription>
        </DialogHeader>

        {/* Reservation Amount Summary */}
        <div className="grid grid-cols-3 gap-3 px-1 py-4">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground mb-1 text-xs">Separación Total</p>
            <p className="text-sm font-semibold">
              {currencySymbol}{' '}
              {reservationAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground mb-1 text-xs">Pagado</p>
            <p className="text-sm font-semibold text-emerald-600">
              {currencySymbol}{' '}
              {reservationAmountPaid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground mb-1 text-xs">Pendiente</p>
            <p className="text-sm font-semibold text-amber-600">
              {currencySymbol}{' '}
              {reservationAmountPending.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Amount to Register */}
        <div className="px-1">
          <div
            className={`rounded-lg border p-3 ${
              exceedsLimit ? 'border-destructive bg-destructive/10' : 'bg-primary/10 border-primary'
            }`}
          >
            <p className="text-muted-foreground mb-1 text-xs">Monto a Registrar</p>
            <p
              className={`text-lg font-bold ${exceedsLimit ? 'text-destructive' : 'text-primary'}`}
            >
              {currencySymbol} {totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
            {exceedsLimit && (
              <p className="text-destructive mt-1 text-xs">
                El monto excede el saldo pendiente de {currencySymbol}{' '}
                {reservationAmountPending.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>

        {/* Main Form Fields */}
        <div className="grid gap-4 px-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dateOperation">Fecha de Operación *</Label>
            <Input
              id="dateOperation"
              type="date"
              value={dateOperation}
              onChange={(e) => {
                setDateOperation(e.target.value);
                if (formErrors.dateOperation) {
                  setFormErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.dateOperation;
                    return newErrors;
                  });
                }
              }}
            />
            {formErrors.dateOperation && (
              <p className="text-destructive text-sm">{formErrors.dateOperation}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberTicket">N° de Boleta (Opcional)</Label>
            <Input
              id="numberTicket"
              type="text"
              placeholder="Ej: 001-0001234"
              value={numberTicket}
              onChange={(e) => setNumberTicket(e.target.value)}
            />
          </div>
        </div>

        {/* Observation Field */}
        <div className="px-1">
          <div className="space-y-2">
            <Label htmlFor="observation">Observación (Opcional)</Label>
            <Textarea
              id="observation"
              placeholder="Ingrese una observación..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Vouchers List */}
        <div className="max-h-[40vh] flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            <AnimatePresence>
              {vouchers.map((voucher, index) => (
                <VoucherForm
                  key={index}
                  index={index}
                  data={voucher}
                  onChange={handleVoucherChange}
                  onRemove={handleRemoveVoucher}
                  currencySymbol={currencySymbol}
                  errors={errors[index]}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddVoucher}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Comprobante
          </Button>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || exceedsLimit}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Registrar Pago
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

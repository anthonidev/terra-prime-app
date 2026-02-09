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

interface RegisterSingleInstallmentPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installmentId: string;
  saleId: string;
  currency?: string;
  pendingAmount: number;
  mode: 'installment' | 'late-fee';
  title?: string;
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

export function RegisterSingleInstallmentPaymentModal({
  open,
  onOpenChange,
  installmentId,
  saleId,
  currency = 'PEN',
  pendingAmount,
  mode,
  title,
  onSuccess,
}: RegisterSingleInstallmentPaymentModalProps) {
  const [vouchers, setVouchers] = useState<VoucherFormData[]>([{ ...initialVoucherData }]);
  const [dateOperation, setDateOperation] = useState<string>(getTodayDateInputValue());
  const [numberTicket, setNumberTicket] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  const defaultTitle =
    mode === 'installment' ? 'Registrar Pago de Cuota' : 'Registrar Pago de Mora';
  const resolvedTitle = title || defaultTitle;

  const description =
    mode === 'installment'
      ? 'Registre un pago para esta cuota específica. Este pago será aprobado automáticamente.'
      : 'Registre un pago para la mora de esta cuota. Este pago será aprobado automáticamente.';

  const pendingLabel = mode === 'installment' ? 'Monto Pendiente de Cuota' : 'Mora Pendiente';

  // Calculate total amount from all vouchers
  const totalAmount = useMemo(() => {
    return vouchers.reduce((sum, voucher) => {
      const amount = parseFloat(voucher.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [vouchers]);

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

    if (totalAmount > pendingAmount) {
      toast.error(
        `El monto total (${currencySymbol} ${totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}) no puede ser mayor al monto pendiente (${currencySymbol} ${pendingAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })})`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Main fields
      formData.append('amountPaid', totalAmount.toString());
      formData.append('dateOperation', dateOperation);
      if (numberTicket.trim()) {
        formData.append('numberTicket', numberTicket.trim());
      }
      if (observation.trim()) {
        formData.append('observation', observation.trim());
      }

      // Payments (vouchers)
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

      const url =
        mode === 'installment'
          ? `/api/sales/financing/installment/paid-approved/${installmentId}`
          : `/api/sales/financing/installment/late-fee/paid-approved/${installmentId}`;

      await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const successMsg =
        mode === 'installment'
          ? 'Pago de cuota registrado exitosamente'
          : 'Pago de mora registrado exitosamente';
      toast.success(successMsg);
      // Invalidate sale detail query to refresh data
      queryClient.invalidateQueries({ queryKey: ['sale-detail', saleId] });
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      const defaultMsg =
        mode === 'installment'
          ? 'Error al registrar el pago de cuota'
          : 'Error al registrar el pago de mora';
      let message = defaultMsg;
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
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Pending Amount and Total Info */}
        <div className="grid gap-4 px-1 py-4 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
            <p className="mb-1 text-xs text-amber-700 dark:text-amber-300">{pendingLabel}</p>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
              {currencySymbol} {pendingAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-primary/10 border-primary rounded-lg border p-3">
            <p className="text-muted-foreground mb-1 text-xs">Monto a Registrar</p>
            <p className="text-primary text-lg font-bold">
              {currencySymbol} {totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
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
              disabled={isSubmitting}
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

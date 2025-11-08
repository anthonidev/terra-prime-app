'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Send, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoucherForm, type VoucherFormData } from '../containers/components/voucher-form';
import { useRegisterPayment } from '../../hooks/use-register-payment';
import type { CurrencyType, VoucherInput } from '../../types';

interface RegisterPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: string;
  pendingAmount: number;
  currency: CurrencyType;
}

const initialVoucherData: VoucherFormData = {
  bankName: '',
  transactionReference: '',
  transactionDate: '',
  amount: '',
  file: null,
};

export function RegisterPaymentModal({
  open,
  onOpenChange,
  saleId,
  pendingAmount,
  currency,
}: RegisterPaymentModalProps) {
  const [vouchers, setVouchers] = useState<VoucherFormData[]>([{ ...initialVoucherData }]);
  const [errors, setErrors] = useState<Record<number, any>>({});

  const { mutate, isPending } = useRegisterPayment(saleId);
  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  // Calculate total amount from all vouchers
  const totalAmount = useMemo(() => {
    return vouchers.reduce((sum, voucher) => {
      const amount = parseFloat(voucher.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [vouchers]);

  // Check if amount is valid
  const amountError = useMemo(() => {
    if (totalAmount === 0) return 'El monto total debe ser mayor a 0';
    if (totalAmount > pendingAmount) return 'El monto total no puede ser mayor al pendiente';
    if (totalAmount < pendingAmount) return 'El monto total debe ser igual al pendiente';
    return null;
  }, [totalAmount, pendingAmount]);

  const handleAddVoucher = () => {
    setVouchers([...vouchers, { ...initialVoucherData }]);
  };

  const handleRemoveVoucher = (index: number) => {
    if (vouchers.length === 1) return; // Keep at least one voucher
    const newVouchers = vouchers.filter((_, i) => i !== index);
    setVouchers(newVouchers);
    // Remove errors for this voucher
    const newErrors = { ...errors };
    delete newErrors[index];
    // Reindex remaining errors
    const reindexedErrors: Record<number, any> = {};
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
    // Clear errors for this voucher field when user types
    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const validateVouchers = () => {
    const newErrors: Record<number, any> = {};
    let isValid = true;

    vouchers.forEach((voucher, index) => {
      const voucherErrors: any = {};

      if (!voucher.transactionReference.trim()) {
        voucherErrors.transactionReference = 'La referencia es requerida';
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

  const handleSubmit = () => {
    // Validate all vouchers
    if (!validateVouchers()) {
      return;
    }

    // Check amount
    if (amountError) {
      return;
    }

    // Prepare data for API
    const files: File[] = [];
    const payments: VoucherInput[] = [];

    vouchers.forEach((voucher, index) => {
      if (voucher.file) {
        files.push(voucher.file);
        payments.push({
          bankName: voucher.bankName || undefined,
          transactionReference: voucher.transactionReference,
          transactionDate: voucher.transactionDate,
          amount: parseFloat(voucher.amount),
          fileIndex: index,
        });
      }
    });

    // Submit
    mutate(
      { payments, files },
      {
        onSuccess: () => {
          // Reset and close
          setVouchers([{ ...initialVoucherData }]);
          setErrors({});
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setVouchers([{ ...initialVoucherData }]);
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogDescription>
            Agrega los comprobantes de pago. El monto total debe ser igual al monto pendiente.
          </DialogDescription>
        </DialogHeader>

        {/* Amount Summary */}
        <div className="grid grid-cols-2 gap-4 py-4 px-1">
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground mb-1">Monto Pendiente</p>
            <p className="text-lg font-bold">
              {currencySymbol} {pendingAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              amountError ? 'bg-destructive/10 border-destructive' : 'bg-primary/10 border-primary'
            }`}
          >
            <p className="text-xs text-muted-foreground mb-1">Monto a Registrar</p>
            <p
              className={`text-lg font-bold ${
                amountError ? 'text-destructive' : 'text-primary'
              }`}
            >
              {currencySymbol} {totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Amount Error Alert */}
        {amountError && (
          <Alert variant="destructive">
            <AlertDescription>{amountError}</AlertDescription>
          </Alert>
        )}

        {/* Vouchers List */}
        <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2">
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

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddVoucher}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Comprobante
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !!amountError}
              className="flex-1 sm:flex-none"
            >
              <Send className="h-4 w-4 mr-2" />
              {isPending ? 'Registrando...' : 'Registrar Pago'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

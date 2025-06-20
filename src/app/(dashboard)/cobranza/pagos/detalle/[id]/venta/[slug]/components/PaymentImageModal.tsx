import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentImageModalSchema, PaymentImageModalType } from '../validations/suscription.zod';
import { toast } from 'sonner';

interface PaymentImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: Omit<PaymentImageModalType, 'fileIndex'>) => void;
  initialData?: Partial<Omit<PaymentImageModalType, 'fileIndex'>>;
  maxAmount?: number;
}

const BANK_OPTIONS = [
  'BCP',
  'BCP SOLES',
  'INTERBANK',
  'BBVA',
  'BBVA SOLES',
  'BBVA DOLARES',
  'BANCO DE LA NACION',
  'SCOTIABANK',
  'OTRO'
];

export function PaymentImageModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  maxAmount
}: PaymentImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>(initialData?.bankName || '');
  const [customBankName, setCustomBankName] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    clearErrors
  } = useForm<Omit<PaymentImageModalType, 'fileIndex'>>({
    resolver: zodResolver(PaymentImageModalSchema),
    defaultValues: {
      bankName: initialData?.bankName || '',
      transactionReference: initialData?.transactionReference || '',
      transactionDate: initialData?.transactionDate
        ? initialData.transactionDate
        : format(new Date(), 'yyyy-MM-dd'),
      amount: initialData?.amount || 0,
      file: undefined
    }
  });

  const watchedAmount = watch('amount');

  // Validate amount in real-time
  useEffect(() => {
    if (maxAmount !== undefined && watchedAmount > 0) {
      if (watchedAmount > maxAmount) {
        setAmountError(
          `El monto no puede exceder ${new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
          }).format(maxAmount)}`
        );
      } else {
        setAmountError('');
        clearErrors('amount');
      }
    }
  }, [watchedAmount, maxAmount, clearErrors]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedBank(initialData.bankName || '');
        if (initialData.bankName && !BANK_OPTIONS.includes(initialData.bankName)) {
          setSelectedBank('OTRO');
          setCustomBankName(initialData.bankName);
        }
      }
    } else {
      reset();
      setSelectedFile(null);
      setSelectedBank('');
      setCustomBankName('');
      setAmountError('');
    }
  }, [isOpen, initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning('El archivo no puede ser mayor a 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.warning('Solo se permiten archivos JPG, JPEG y PNG');
        return;
      }

      setSelectedFile(file);
      setValue('file', file);
      clearErrors('file');
    }
  };

  const handleBankChange = (value: string) => {
    setSelectedBank(value);
    if (value !== 'OTRO') {
      setValue('bankName', value);
      setCustomBankName('');
    } else {
      setValue('bankName', customBankName);
    }
  };

  const handleCustomBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomBankName(value);
    setValue('bankName', value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    if (maxAmount !== undefined && value > maxAmount) {
      setAmountError(
        `El monto no puede exceder ${new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN'
        }).format(maxAmount)}`
      );
    } else {
      setAmountError('');
    }
  };

  const onSubmitHandler = (data: Omit<PaymentImageModalType, 'fileIndex'>) => {
    // Validate amount against maxAmount
    if (maxAmount !== undefined && data.amount > maxAmount) {
      toast.warning(
        `El monto no puede exceder ${new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN'
        }).format(maxAmount)}`
      );
      return;
    }

    if (!selectedFile) {
      toast.warning('Debe seleccionar un comprobante de pago');
      return;
    }

    if (data.amount <= 0) {
      toast.warning('El monto debe ser mayor a cero');
      return;
    }

    const finalBankName = selectedBank === 'OTRO' ? customBankName : selectedBank;

    if (!finalBankName.trim()) {
      toast.warning('Debe seleccionar o ingresar un banco');
      return;
    }

    onSubmit({
      ...data,
      bankName: finalBankName,
      file: selectedFile
    });

    // Reset form after successful submission
    reset();
    setSelectedFile(null);
    setSelectedBank('');
    setCustomBankName('');
    setAmountError('');
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setSelectedBank('');
    setCustomBankName('');
    setAmountError('');
    onClose();
  };

  const isFormValid = !amountError && selectedFile && watchedAmount > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="px-4 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Comprobante de Pago' : 'Agregar Comprobante de Pago'}
          </DialogTitle>
          <DialogDescription>
            Ingrese los detalles del comprobante de pago
            {maxAmount !== undefined && (
              <span className="mt-1 block font-medium text-blue-600">
                Monto máximo disponible:{' '}
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: 'PEN'
                }).format(maxAmount)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div className="max-h-[calc(60vh)] space-y-4 overflow-y-auto">
            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bankSelect">Banco *</Label>
              <Select value={selectedBank} onValueChange={handleBankChange}>
                <SelectTrigger id="bankSelect" className="w-full bg-white dark:bg-gray-900">
                  <SelectValue placeholder="Seleccione un banco" />
                </SelectTrigger>
                <SelectContent>
                  {BANK_OPTIONS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedBank === 'OTRO' && (
                <div className="pt-2">
                  <Label htmlFor="customBank">Nombre del banco</Label>
                  <Input
                    id="customBank"
                    className="w-full bg-white dark:bg-gray-800"
                    value={customBankName}
                    onChange={handleCustomBankChange}
                    placeholder="Ingrese el nombre del banco"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Transaction Reference */}
              <div className="space-y-2">
                <Label htmlFor="transactionReference">Referencia de Transacción *</Label>
                <Input
                  id="transactionReference"
                  className="w-full bg-white dark:bg-gray-900"
                  {...register('transactionReference')}
                  placeholder="Número de referencia"
                />
                {errors.transactionReference && (
                  <p className="text-destructive flex items-center gap-1 text-sm">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.transactionReference.message}
                  </p>
                )}
              </div>

              {/* Transaction Date */}
              <div className="space-y-2">
                <Label>Fecha de Transacción *</Label>
                <Controller
                  name="transactionDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), 'dd/MM/yyyy')
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                          }
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.transactionDate && (
                  <p className="text-destructive flex items-center gap-1 text-sm">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.transactionDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monto (PEN) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={maxAmount}
                {...register('amount', {
                  setValueAs: (v) => parseFloat(v) || 0,
                  onChange: handleAmountChange
                })}
                className={cn(
                  'w-full bg-white dark:bg-gray-900',
                  amountError && 'border-red-500 focus:border-red-500'
                )}
                placeholder="Ingrese el monto del pago"
              />
              {amountError && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertTriangle className="h-3 w-3" />
                  {amountError}
                </p>
              )}
              {errors.amount && !amountError && (
                <p className="text-destructive flex items-center gap-1 text-sm">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.amount.message}
                </p>
              )}
              {maxAmount !== undefined && !amountError && (
                <p className="text-muted-foreground text-xs">
                  Monto máximo disponible:{' '}
                  {new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                  }).format(maxAmount)}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Comprobante de Pago *</Label>
              <Input
                className="w-full bg-white dark:bg-gray-900"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2 dark:border-green-800 dark:bg-green-950">
                  <span className="text-sm text-green-700 dark:text-green-300">
                    ✓ {selectedFile.name}
                  </span>
                </div>
              )}
              {errors.file && (
                <p className="text-destructive flex items-center gap-1 text-sm">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.file.message}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                Formatos permitidos: JPG, JPEG, PNG. Tamaño máximo: 5MB
              </p>
            </div>
          </div>

          <DialogFooter className="w-full space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid} className="min-w-[140px]">
              {initialData ? 'Actualizar' : 'Guardar'} Comprobante
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

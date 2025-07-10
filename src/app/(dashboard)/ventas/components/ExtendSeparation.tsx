import { Button } from '@components/ui/button';
import { CircleCheck, File } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { useExtendSeparation } from '../hooks/useExtendSeparation';
import { useState } from 'react';
import ValidatePinModal from '../crear-venta/components/modals/ValidatePinModal';

interface Props {
  sale: SaleList;
  isOpen: boolean;
  onClose: () => void;
}

export function ExtendSeparation({ sale, isOpen, onClose }: Props) {
  const [extensionDays, setExtensionDays] = useState<string>('7');
  const { isSubmitting, handleAction } = useExtendSeparation(sale.id);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isPinValid, setIsPinValid] = useState<boolean>(false);

  const handlePinValidation = (isValid: boolean) => {
    setIsPinValid(isValid);
    if (isValid) {
      setOpenModal(false);
      handleExtendSeparation();
    }
  };

  const handleExtendSeparation = async () => {
    const success = await handleAction(Number(extensionDays));
    if (success) {
      onClose();
      setIsPinValid(false);
    }
  };

  const handleExtendButtonClick = () => setOpenModal(true);

  const calculateDueDate = (maximumHoldPeriod: string | null | undefined) => {
    if (!maximumHoldPeriod || isNaN(Number(maximumHoldPeriod))) return '--';

    const currentDate = new Date();
    const dueDate = new Date(currentDate);
    dueDate.setDate(currentDate.getDate() + Number(maximumHoldPeriod));

    return dueDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const calculateNewDueDate = () => {
    if (!sale.maximumHoldPeriod || isNaN(Number(sale.maximumHoldPeriod))) {
      return '--';
    }

    const currentDate = new Date();
    const newDueDate = new Date(currentDate);
    const totalDays = Number(sale.maximumHoldPeriod) + Number(extensionDays);
    newDueDate.setDate(currentDate.getDate() + totalDays);

    return newDueDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const dayOptions = [
    { value: '3', label: '3 días' },
    { value: '7', label: '7 días' },
    { value: '15', label: '15 días' },
    { value: '30', label: '30 días' },
    { value: '45', label: '45 días' },
    { value: '60', label: '60 días' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <File className="h-5 w-5" />
            <span className="inline-flex items-center gap-2">
              Extender Separación {isPinValid ?? <CircleCheck className="h-4 w-4 text-green-600" />}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border bg-white p-3 dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fecha actual de vencimiento:
              </p>
              <span className="font-semibold text-blue-500">
                {calculateDueDate(sale.maximumHoldPeriod)}
              </span>
            </div>
            <div className="rounded-md border bg-green-50 p-3 dark:bg-green-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nueva fecha de vencimiento:
              </p>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {calculateNewDueDate()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Seleccionar días a extender:
            </label>
            <Select value={extensionDays} onValueChange={setExtensionDays}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <SelectValue placeholder="Seleccionar días" />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {extensionDays && (
            <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Resumen:</strong> Se extenderá la reservación por {extensionDays} días
                adicionales.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 px-4 pt-0 pb-4 sm:gap-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="w-full"
            onClick={handleExtendButtonClick}
            disabled={isSubmitting || !extensionDays}
          >
            <span className="ml-2 text-xs">Extender por {extensionDays} días</span>
          </Button>
        </DialogFooter>

        <ValidatePinModal
          onPinValidated={handlePinValidation}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, FileImage, File, Plus } from 'lucide-react';
import { PaymentImageModal } from './PaymentImageModal';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { usePaidCollection } from '../hooks/usePaidCollection';
import { SalesCollector, UrbanFinancing } from '@domain/entities/cobranza';
import { PaymentImageModalType } from '../validations/suscription.zod';

interface Props {
  isUrban?: boolean;
  urbanFinancing?: UrbanFinancing;
  sale: SalesCollector;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentSummary({ isUrban = false, urbanFinancing, sale, isOpen, onClose }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const {
    isSubmitting,
    payments,
    isPaymentComplete,
    addPayment,
    deletePayment,
    editPayment,
    handleAction,
    resetPayments
  } = usePaidCollection(isUrban, urbanFinancing, sale);

  const [editingPayment, setEditingPayment] = useState<{
    index: number;
    payment: PaymentImageModalType;
  } | null>(null);

  const handleEditPayment = async (payment: Omit<PaymentImageModalType, 'fileIndex'>) => {
    if (editingPayment) {
      const success = editPayment(editingPayment.index, payment);
      if (success) {
        setEditingPayment(null);
      }
    }
  };

  const handleAddPayment = (payment: Omit<PaymentImageModalType, 'fileIndex'>) => {
    const success = addPayment(payment);
    if (success) {
      setOpenModal(false);
    }
  };

  const handleRegisterPayment = async () => {
    const success = await handleAction();
    if (success) {
      resetPayments();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <File className="h-5 w-5" />
            <span>Registrar pago</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-4">
          <Button
            className="w-full gap-2 bg-gradient-to-r from-[#025864] to-[#00CA7C] hover:from-[#014751] hover:to-[#00b56e]"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Agregar comprobante
          </Button>

          {payments.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
              <FileImage className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No se han agregado comprobantes de pago
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-start gap-3 p-4">
                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                      <FileImage className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <h4 className="text-sm leading-none font-medium">
                        {payment.bankName || 'Comprobante de Pago'}
                      </h4>
                      <div className="text-muted-foreground space-y-1 text-xs">
                        <p className="truncate">Ref: {payment.transactionReference || 'N/A'}</p>
                        <p>
                          {format(new Date(payment.transactionDate || new Date()), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-primary font-semibold">
                          {new Intl.NumberFormat('es-PE', {
                            style: 'currency',
                            currency: 'PEN'
                          }).format(payment.amount || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t p-2 dark:border-gray-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary h-8 w-8 p-0 text-gray-600 dark:text-gray-400"
                      onClick={() => setEditingPayment({ index, payment })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-destructive h-8 w-8 p-0 text-gray-600 dark:text-gray-400"
                      onClick={() => deletePayment(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 px-4 pt-0 pb-4 sm:gap-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="w-full"
            onClick={handleRegisterPayment}
            disabled={isSubmitting || !isPaymentComplete}
          >
            {isSubmitting ? 'Registrando pago...' : 'Registrar Pago'}
          </Button>
        </DialogFooter>

        <PaymentImageModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleAddPayment}
        />
        {editingPayment && (
          <PaymentImageModal
            isOpen={!!editingPayment}
            onClose={() => setEditingPayment(null)}
            onSubmit={(payment) => handleEditPayment(payment)}
            initialData={editingPayment.payment}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

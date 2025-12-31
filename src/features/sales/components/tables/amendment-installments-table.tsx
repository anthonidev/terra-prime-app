'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Save, X, AlertCircle, CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/shared/lib/utils';
import { AddInstallmentsModal } from '../dialogs/add-installments-modal';
import { EditInstallmentModal } from '../dialogs/edit-installment-modal';
import { SaveAmendmentModal } from '../dialogs/save-amendment-modal';
import type { AmendmentInstallmentLocal, AmendmentInstallmentStatus } from '../../types';

const statusConfig: Record<
  AmendmentInstallmentStatus,
  { label: string; variant: 'default' | 'outline' | 'destructive' }
> = {
  PAID: { label: 'Pagada', variant: 'default' },
  PENDING: { label: 'Pendiente', variant: 'outline' },
  EXPIRED: { label: 'Vencida', variant: 'destructive' },
};

interface AmendmentInstallmentsTableProps {
  installments: AmendmentInstallmentLocal[];
  additionalAmount: number;
  totalPaidAmount: number;
  expectedTotal: number;
  pendingInstallmentsTotal: number;
  isBalanceValid: boolean;
  balanceDifference: number;
  isSaving: boolean;
  onAddInstallments: (quantity: number, totalAmount: number, startDate: string) => void;
  onUpdateInstallment: (id: string, updates: Partial<AmendmentInstallmentLocal>) => void;
  onDeleteInstallment: (id: string) => void;
  onClearPendingInstallments: () => void;
  onSetAdditionalAmount: (amount: number) => void;
  onSave: (observation?: string) => void;
  onCancel: () => void;
}

export function AmendmentInstallmentsTable({
  installments,
  additionalAmount,
  totalPaidAmount,
  expectedTotal,
  pendingInstallmentsTotal,
  isBalanceValid,
  balanceDifference,
  isSaving,
  onAddInstallments,
  onUpdateInstallment,
  onDeleteInstallment,
  onClearPendingInstallments,
  onSetAdditionalAmount,
  onSave,
  onCancel,
}: AmendmentInstallmentsTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<AmendmentInstallmentLocal | null>(
    null
  );

  const pendingInstallments = installments.filter((i) => i.status === 'PENDING');

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader className="bg-amber-50 dark:bg-amber-950/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-5 w-5" />
              Modo Adenda - Edición de Cuotas
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Configure el nuevo cronograma de pagos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={() => setIsSaveModalOpen(true)}
              disabled={!isBalanceValid || isSaving || pendingInstallments.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Adenda
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Additional Amount Input */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="additionalAmount">Monto Adicional / Descuento</Label>
              <Input
                id="additionalAmount"
                type="number"
                step="0.01"
                value={additionalAmount}
                onChange={(e) => onSetAdditionalAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              <p className="text-muted-foreground text-xs">
                Positivo = monto adicional (aumenta deuda) | Negativo = descuento (reduce deuda)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cuotas
              </Button>
              {pendingInstallments.length > 0 && (
                <Button
                  variant="outline"
                  onClick={onClearPendingInstallments}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-sm">Cuota Pagada</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(totalPaidAmount)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-sm">Total Esperado</p>
            <p className="text-lg font-semibold">{formatCurrency(expectedTotal)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-sm">Cuotas Pendientes</p>
            <p className="text-lg font-semibold">{formatCurrency(pendingInstallmentsTotal)}</p>
          </div>
          <div
            className={`rounded-lg border p-3 ${
              isBalanceValid
                ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
            }`}
          >
            <p
              className={`text-sm ${isBalanceValid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}
            >
              Balance
            </p>
            <div className="flex items-center gap-2">
              {isBalanceValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p
                className={`text-lg font-semibold ${isBalanceValid ? 'text-green-600' : 'text-red-600'}`}
              >
                {isBalanceValid ? 'Válido' : formatCurrency(balanceDifference)}
              </p>
            </div>
          </div>
        </div>

        {/* Installments Table */}
        {installments.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">N° Cuota</TableHead>
                  <TableHead>Fecha de Vencimiento</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-24 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installments.map((installment) => {
                  const config = statusConfig[installment.status];
                  const isPaid = installment.status === 'PAID';

                  return (
                    <TableRow key={installment.id}>
                      <TableCell className="font-mono font-medium">
                        #{installment.numberCuote}
                      </TableCell>
                      <TableCell>
                        {format(new Date(installment.dueDate), 'dd MMM yyyy', { locale: es })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(installment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingInstallment(installment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!isPaid && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => onDeleteInstallment(installment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
            <p className="text-muted-foreground">No hay cuotas configuradas</p>
          </div>
        )}

        {/* Validation Message */}
        {!isBalanceValid && pendingInstallments.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              {balanceDifference > 0
                ? `El total de cuotas pendientes excede el monto esperado por ${formatCurrency(balanceDifference)}`
                : `Faltan ${formatCurrency(Math.abs(balanceDifference))} para cubrir el monto esperado`}
            </p>
          </div>
        )}
      </CardContent>

      {/* Modals */}
      <AddInstallmentsModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={onAddInstallments}
        suggestedAmount={balanceDifference < 0 ? Math.abs(balanceDifference) : 0}
      />

      <EditInstallmentModal
        open={!!editingInstallment}
        onOpenChange={(open) => !open && setEditingInstallment(null)}
        installment={editingInstallment}
        onSave={onUpdateInstallment}
      />

      <SaveAmendmentModal
        open={isSaveModalOpen}
        onOpenChange={setIsSaveModalOpen}
        onConfirm={onSave}
        isLoading={isSaving}
        installments={installments}
        additionalAmount={additionalAmount}
        totalPaidAmount={totalPaidAmount}
      />
    </Card>
  );
}

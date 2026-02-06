'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateOnly } from '@/shared/utils/date-formatter';
import {
  Table as TableIcon,
  Receipt,
  Home,
  Coins,
  Pencil,
  Trash2,
  Plus,
  Layers,
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  Scale,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { cn } from '@/lib/utils';
import { EditAmortizationInstallmentDialog } from './edit-amortization-installment-dialog';
import { AddAmortizationInstallmentsDialog } from './add-amortization-installments-dialog';
import { BulkEditAmortizationDialog } from './bulk-edit-amortization-dialog';
import type { AmortizationResponse, EditableInstallment, AmortizationMeta } from '../../../types';

interface EditableAmortizationProps {
  editable: true;
  editableInstallments: EditableInstallment[];
  canAddDelete: boolean;
  meta: AmortizationMeta;
  isLotBalanceValid: boolean;
  isHuBalanceValid: boolean;
  lotBalanceDifference: number;
  huBalanceDifference: number;
  expectedLotTotal: number;
  expectedHuTotal: number;
  onUpdateInstallment: (
    id: string,
    updates: {
      lotInstallmentAmount?: number;
      huInstallmentAmount?: number;
      expectedPaymentDate?: string;
    }
  ) => void;
  onDeleteInstallments: (ids: Set<string>) => void;
  onAddInstallments: (qty: number, lotTotal: number, huTotal: number, startDate: string) => void;
  onBulkUpdateLotAmount: (ids: Set<string>, total: number) => void;
  onBulkUpdateHuAmount: (ids: Set<string>, total: number) => void;
  onBulkUpdateDates: (ids: Set<string>, startDate: string) => void;
  onAdjustLastInstallment: () => void;
}

interface ReadOnlyAmortizationProps {
  editable?: false;
  editableInstallments?: undefined;
  canAddDelete?: undefined;
  meta?: undefined;
  isLotBalanceValid?: undefined;
  isHuBalanceValid?: undefined;
  lotBalanceDifference?: undefined;
  huBalanceDifference?: undefined;
  expectedLotTotal?: undefined;
  expectedHuTotal?: undefined;
  onUpdateInstallment?: undefined;
  onDeleteInstallments?: undefined;
  onAddInstallments?: undefined;
  onBulkUpdateLotAmount?: undefined;
  onBulkUpdateHuAmount?: undefined;
  onBulkUpdateDates?: undefined;
  onAdjustLastInstallment?: undefined;
}

type AmortizationTableProps = {
  amortization: AmortizationResponse | undefined;
  isCalculating: boolean;
  hasUrbanization: boolean;
  currency: 'USD' | 'PEN';
} & (EditableAmortizationProps | ReadOnlyAmortizationProps);

export function AmortizationTable(props: AmortizationTableProps) {
  const { amortization, isCalculating, hasUrbanization, currency } = props;
  const currencyType = currency === 'USD' ? 'USD' : 'PEN';

  // Selection state for editable mode
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingInstallment, setEditingInstallment] = useState<EditableInstallment | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);

  const isEditable = props.editable === true;

  // Determine the data source and meta
  const displayInstallments = isEditable ? props.editableInstallments : amortization?.installments;
  const displayMeta = isEditable ? props.meta : amortization?.meta;

  const editableInstallments = isEditable ? props.editableInstallments : undefined;

  const allIds = useMemo(() => {
    if (!isEditable || !editableInstallments) return new Set<string>();
    return new Set(editableInstallments.map((i) => i.id));
  }, [isEditable, editableInstallments]);

  const isAllSelected = isEditable && selectedIds.size > 0 && selectedIds.size === allIds.size;
  const isSomeSelected = isEditable && selectedIds.size > 0 && selectedIds.size < allIds.size;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleEdit = (installment: EditableInstallment) => {
    setEditingInstallment(installment);
    setShowEditDialog(true);
  };

  const handleDelete = (ids: Set<string>) => {
    if (!isEditable) return;
    props.onDeleteInstallments(ids);
    setSelectedIds(new Set());
  };

  const handleBulkAmounts = (lotTotal: number, huTotal: number) => {
    if (!isEditable) return;
    if (lotTotal > 0) props.onBulkUpdateLotAmount(selectedIds, lotTotal);
    if (huTotal > 0) props.onBulkUpdateHuAmount(selectedIds, huTotal);
    setSelectedIds(new Set());
  };

  const handleBulkDates = (startDate: string) => {
    if (!isEditable) return;
    props.onBulkUpdateDates(selectedIds, startDate);
    setSelectedIds(new Set());
  };

  if (!amortization && !isCalculating && !(isEditable && props.editableInstallments.length > 0)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <TableIcon className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Tabla de Amortización</CardTitle>
                <CardDescription>
                  {isEditable
                    ? 'Edite las cuotas según necesite. El balance debe cuadrar antes de continuar.'
                    : 'Cronograma detallado de pagos mensuales'}
                </CardDescription>
              </div>
            </div>

            {isEditable && props.canAddDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4" />
                Agregar Cuotas
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isCalculating ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : displayInstallments && displayInstallments.length > 0 ? (
            <>
              {/* Selection bar */}
              <AnimatePresence>
                {isEditable && selectedIds.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-primary/5 border-primary/20 mb-4 overflow-hidden rounded-lg border"
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="text-primary h-4 w-4" />
                        <span className="text-sm font-medium">
                          {selectedIds.size} cuota{selectedIds.size > 1 ? 's' : ''} seleccionada
                          {selectedIds.size > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setShowBulkDialog(true)}
                        >
                          <Layers className="h-3.5 w-3.5" />
                          Editar Seleccionados
                        </Button>
                        {props.canAddDelete && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 gap-1.5"
                            onClick={() => handleDelete(selectedIds)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isEditable && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={isAllSelected}
                            ref={(el) => {
                              if (el) {
                                (el as unknown as HTMLInputElement).indeterminate = isSomeSelected;
                              }
                            }}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                      )}
                      <TableHead className="w-20">N° Cuota</TableHead>
                      <TableHead>Cuota Lote</TableHead>
                      {hasUrbanization && <TableHead>Cuota HU</TableHead>}
                      <TableHead className="font-semibold">Total Cuota</TableHead>
                      <TableHead>Fecha de Pago</TableHead>
                      {isEditable && <TableHead className="w-24">Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayInstallments.map((installment, index) => {
                      const isEditableRow = isEditable;
                      const editableInst = isEditableRow
                        ? (installment as EditableInstallment)
                        : null;
                      const rowId = editableInst?.id ?? String(index);
                      const isSelected = isEditable && selectedIds.has(rowId);

                      return (
                        <motion.tr
                          key={rowId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={cn(
                            'hover:bg-muted/50 transition-colors',
                            isSelected && 'bg-primary/5'
                          )}
                        >
                          {isEditable && (
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSelect(rowId)}
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              #{installment.lotInstallmentNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(installment.lotInstallmentAmount, currencyType)}
                          </TableCell>
                          {hasUrbanization && (
                            <TableCell className="font-medium">
                              {formatCurrency(installment.huInstallmentAmount, currencyType)}
                            </TableCell>
                          )}
                          <TableCell className="text-primary font-bold">
                            {formatCurrency(installment.totalInstallmentAmount, currencyType)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateOnly(installment.expectedPaymentDate, 'dd/MM/yyyy')}
                          </TableCell>
                          {isEditable && editableInst && (
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(editableInst)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                {props.canAddDelete && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                    onClick={() => handleDelete(new Set([editableInst.id]))}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Balance Indicators (editable mode only) */}
              {isEditable && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 space-y-2"
                >
                  <BalanceIndicator
                    label="Balance Lote"
                    isValid={props.isLotBalanceValid}
                    difference={props.lotBalanceDifference}
                    expected={props.expectedLotTotal}
                    actual={props.meta.lotTotalAmount}
                    currency={currencyType}
                  />
                  {hasUrbanization && props.expectedHuTotal > 0 && (
                    <BalanceIndicator
                      label="Balance HU"
                      isValid={props.isHuBalanceValid}
                      difference={props.huBalanceDifference}
                      expected={props.expectedHuTotal}
                      actual={props.meta.huTotalAmount}
                      currency={currencyType}
                    />
                  )}
                  {(!props.isLotBalanceValid ||
                    (hasUrbanization && props.expectedHuTotal > 0 && !props.isHuBalanceValid)) && (
                    <div className="flex justify-end pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={props.onAdjustLastInstallment}
                      >
                        <Scale className="h-3.5 w-3.5" />
                        Ajustar última cuota
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/30 mt-6 rounded-lg p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Coins className="text-primary h-5 w-5" />
                  <h4 className="text-base font-semibold">Resumen de Financiamiento</h4>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Total Lote */}
                  <div className="bg-background rounded-lg border p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <Receipt className="text-primary h-4 w-4" />
                      <p className="text-muted-foreground text-sm font-medium">Total Lote</p>
                    </div>
                    <p className="text-foreground text-2xl font-bold">
                      {formatCurrency(displayMeta!.lotTotalAmount, currencyType)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {displayMeta!.lotInstallmentsCount} cuotas
                    </p>
                  </div>

                  {/* Total HU */}
                  {hasUrbanization && displayMeta!.huInstallmentsCount > 0 && (
                    <div className="bg-background rounded-lg border p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <Home className="text-primary h-4 w-4" />
                        <p className="text-muted-foreground text-sm font-medium">Total HU</p>
                      </div>
                      <p className="text-foreground text-2xl font-bold">
                        {formatCurrency(displayMeta!.huTotalAmount, currencyType)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {displayMeta!.huInstallmentsCount} cuotas
                      </p>
                    </div>
                  )}

                  {/* Total General */}
                  <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Coins className="text-primary h-4 w-4" />
                      <p className="text-primary text-sm font-bold">Total General</p>
                    </div>
                    <p className="text-primary text-2xl font-bold">
                      {formatCurrency(displayMeta!.totalAmount, currencyType)}
                    </p>
                    <p className="text-primary/70 mt-1 text-xs font-medium">
                      {displayMeta!.totalInstallmentsCount} cuotas totales
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TableIcon className="text-muted-foreground/50 mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                Complete los datos y genere la tabla para ver el cronograma de pagos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs (editable mode) */}
      {isEditable && (
        <>
          <EditAmortizationInstallmentDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            installment={editingInstallment}
            hasUrbanization={hasUrbanization}
            onSave={props.onUpdateInstallment}
          />
          <AddAmortizationInstallmentsDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            hasUrbanization={hasUrbanization}
            currency={currency}
            lotBalanceDifference={props.lotBalanceDifference}
            huBalanceDifference={props.huBalanceDifference}
            onAdd={props.onAddInstallments}
          />
          <BulkEditAmortizationDialog
            open={showBulkDialog}
            onOpenChange={setShowBulkDialog}
            selectedCount={selectedIds.size}
            hasUrbanization={hasUrbanization}
            onBulkUpdateAmounts={handleBulkAmounts}
            onBulkUpdateDates={handleBulkDates}
          />
        </>
      )}
    </motion.div>
  );
}

// Balance indicator sub-component
function BalanceIndicator({
  label,
  isValid,
  difference,
  expected,
  actual,
  currency,
}: {
  label: string;
  isValid: boolean;
  difference: number;
  expected: number;
  actual: number;
  currency: 'USD' | 'PEN';
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border px-4 py-2',
        isValid
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
      )}
    >
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          Esperado: {formatCurrency(expected, currency)}
        </span>
        <span className="text-muted-foreground">Actual: {formatCurrency(actual, currency)}</span>
        {!isValid && (
          <span
            className={cn(
              'font-semibold',
              difference > 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-amber-600 dark:text-amber-400'
            )}
          >
            {difference > 0 ? '+' : ''}
            {formatCurrency(difference, currency)}
          </span>
        )}
      </div>
    </div>
  );
}

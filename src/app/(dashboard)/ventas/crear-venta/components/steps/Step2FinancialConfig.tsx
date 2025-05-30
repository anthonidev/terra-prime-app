'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Calculator, Calendar as CalendarDays, DollarSign, Percent } from 'lucide-react';

import FormInputField from '@/components/common/form/FormInputField';
import { AmortizationItem } from '@/types/sales';
import { calculateAmortization } from '../../action';
import {
  AmortizationCalculationData,
  CreateSaleFormData,
  Step2FormData,
  amortizationCalculationSchema,
  step2Schema
} from '../../validations/saleValidation';

interface Step2Props {
  formData: Partial<CreateSaleFormData> & {
    financingInstallments?: any[];
    initialAmount?: number;
    interestRate?: number;
    quantitySaleCoutes?: number;
  };
  updateFormData: (
    data: Partial<CreateSaleFormData> & {
      financingInstallments?: any[];
      initialAmount?: number;
      interestRate?: number;
      quantitySaleCoutes?: number;
    }
  ) => void;
  updateStepValidation: (step: 'step2', isValid: boolean) => void;
}

export default function Step2FinancialConfig({
  formData,
  updateFormData,
  updateStepValidation
}: Step2Props) {
  const [amortizationTable, setAmortizationTable] = useState<AmortizationItem[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  const isFinanced = formData.saleType === 'FINANCED';
  const hasUrbanization = (formData.totalAmountUrbanDevelopment || 0) > 0;

  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      saleType: formData.saleType || 'DIRECT_PAYMENT',
      totalAmount: formData.totalAmount || 0,
      totalAmountUrbanDevelopment: formData.totalAmountUrbanDevelopment || 0,
      firstPaymentDateHu: formData.firstPaymentDateHu || '',
      initialAmountUrbanDevelopment: formData.initialAmountUrbanDevelopment || 0,
      quantityHuCuotes: formData.quantityHuCuotes || 0,
      // Campos de financiamiento - siempre presentes
      initialAmount: formData.initialAmount || 0,
      interestRate: formData.interestRate || 12,
      quantitySaleCoutes: formData.quantitySaleCoutes || 12,
      financingInstallments: formData.financingInstallments || []
    }
  });

  // Formulario separado para el cálculo de amortización
  const amortizationForm = useForm<AmortizationCalculationData>({
    resolver: zodResolver(amortizationCalculationSchema),
    defaultValues: {
      totalAmount: 0,
      initialAmount: 0,
      interestRate: 12,
      quantitySaleCoutes: 12,
      firstPaymentDate: ''
    }
  });

  // Validar formulario cuando cambie
  useEffect(() => {
    const subscription = form.watch((value) => {
      let isValid = false;

      if (value.saleType === 'DIRECT_PAYMENT') {
        isValid = !!(value.totalAmount && value.totalAmount > 0);
      } else if (value.saleType === 'FINANCED') {
        isValid = !!(
          value.totalAmount &&
          value.totalAmount > 0 &&
          (value as any).initialAmount !== undefined &&
          (value as any).initialAmount >= 0 &&
          (value as any).interestRate &&
          (value as any).interestRate > 0 &&
          (value as any).quantitySaleCoutes &&
          (value as any).quantitySaleCoutes > 0 &&
          (value as any).financingInstallments &&
          (value as any).financingInstallments.length > 0
        );
      }

      updateStepValidation('step2', isValid);

      if (value) {
        updateFormData({
          totalAmount: value.totalAmount,
          totalAmountUrbanDevelopment: value.totalAmountUrbanDevelopment,
          firstPaymentDateHu: value.firstPaymentDateHu,
          initialAmountUrbanDevelopment: value.initialAmountUrbanDevelopment,
          quantityHuCuotes: value.quantityHuCuotes,
          initialAmount: (value as any).initialAmount,
          interestRate: (value as any).interestRate,
          quantitySaleCoutes: (value as any).quantitySaleCoutes,
          financingInstallments: (value as any).financingInstallments
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation, isFinanced]);

  // Sincronizar datos para el cálculo de amortización
  useEffect(() => {
    if (isFinanced) {
      const subscription = form.watch((values) => {
        if (values.totalAmount !== undefined) {
          amortizationForm.setValue('totalAmount', values.totalAmount);
        }
        if (
          values.saleType === 'FINANCED' &&
          'initialAmount' in values &&
          values.initialAmount !== undefined
        ) {
          amortizationForm.setValue('initialAmount', values.initialAmount);
        }
        if (
          values.saleType === 'FINANCED' &&
          'interestRate' in values &&
          values.interestRate !== undefined
        ) {
          amortizationForm.setValue('interestRate', values.interestRate);
        }
        if (
          values.saleType === 'FINANCED' &&
          'quantitySaleCoutes' in values &&
          values.quantitySaleCoutes !== undefined
        ) {
          amortizationForm.setValue('quantitySaleCoutes', values.quantitySaleCoutes);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isFinanced, form, amortizationForm]);

  const handleCalculateAmortization = async () => {
    const isAmortizationValid = await amortizationForm.trigger();
    if (!isAmortizationValid) {
      toast.error('Complete todos los campos de financiamiento');
      return;
    }

    const values = amortizationForm.getValues();

    setIsCalculating(true);
    try {
      const result = await calculateAmortization({
        totalAmount: values.totalAmount,
        initialAmount: values.initialAmount,
        reservationAmount: 0, // Siempre 0 según especificaciones
        interestRate: values.interestRate,
        numberOfPayments: values.quantitySaleCoutes,
        firstPaymentDate: values.firstPaymentDate,
        includeDecimals: true
      });

      setAmortizationTable(result.installments);
      setShowAmortization(true);

      // Actualizar formulario principal con las cuotas calculadas
      form.setValue('financingInstallments', result.installments);

      toast.success('Cronograma de pagos calculado correctamente');
    } catch (error) {
      console.error('Error calculating amortization:', error);
      toast.error('Error al calcular el cronograma de pagos');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Configuración Financiera
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure los montos y condiciones de pago
        </p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Configuración de montos */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
              Montos de Venta
            </h3>

            {/* Monto Total del Lote */}
            <FormInputField<Step2FormData>
              name="totalAmount"
              label="Monto Total del Lote"
              placeholder="0.00"
              type="number"
              icon={<DollarSign className="h-4 w-4" />}
              control={form.control}
              errors={form.formState.errors}
            />

            {/* Campos de Habilitación Urbana - Solo si el monto es mayor a 0 */}
            {hasUrbanization && (
              <>
                <FormInputField<Step2FormData>
                  name="totalAmountUrbanDevelopment"
                  label="Monto Total Habilitación Urbana"
                  placeholder="0.00"
                  type="number"
                  icon={<DollarSign className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />

                <FormInputField<Step2FormData>
                  name="initialAmountUrbanDevelopment"
                  label="Monto Inicial HU"
                  placeholder="0.00"
                  type="number"
                  icon={<DollarSign className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />

                <FormInputField<Step2FormData>
                  name="quantityHuCuotes"
                  label="Cantidad de Cuotas HU"
                  placeholder="0"
                  type="number"
                  icon={<CalendarDays className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />

                <FormInputField<Step2FormData>
                  name="firstPaymentDateHu"
                  label="Fecha Primer Pago HU"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  icon={<CalendarDays className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />
              </>
            )}
          </div>

          {/* Configuración de Financiamiento - Solo para ventas financiadas */}
          {isFinanced && (
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                Configuración de Financiamiento
              </h3>

              <FormInputField<Step2FormData>
                name="initialAmount"
                label="Monto Inicial"
                placeholder="0.00"
                type="number"
                icon={<DollarSign className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />

              <FormInputField<Step2FormData>
                name="interestRate"
                label="Tasa de Interés (%)"
                placeholder="12.0"
                type="number"
                icon={<Percent className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />

              <FormInputField<Step2FormData>
                name="quantitySaleCoutes"
                label="Cantidad de Cuotas (máx. 74)"
                placeholder="12"
                type="number"
                icon={<CalendarDays className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />

              {/* Campo separado para fecha de primer pago (solo para cálculo) */}
              <Form {...amortizationForm}>
                <FormInputField<AmortizationCalculationData>
                  name="firstPaymentDate"
                  label="Fecha Primer Pago"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  icon={<CalendarDays className="h-4 w-4" />}
                  control={amortizationForm.control}
                  errors={amortizationForm.formState.errors}
                />
              </Form>

              <Button
                type="button"
                onClick={handleCalculateAmortization}
                disabled={isCalculating}
                className="flex w-full items-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    Calcular Cronograma
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Resumen */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Monto del Lote:
                      </span>
                      <span className="font-semibold">
                        S/ {(form.watch('totalAmount') || 0).toFixed(2)}
                      </span>
                    </div>
                    {hasUrbanization && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Habilitación Urbana:
                        </span>
                        <span className="font-semibold">
                          S/ {(form.watch('totalAmountUrbanDevelopment') || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">Total:</span>
                      <span className="text-lg font-bold">
                        S/{' '}
                        {(
                          (form.watch('totalAmount') || 0) +
                          (form.watch('totalAmountUrbanDevelopment') || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant={isFinanced ? 'default' : 'secondary'} className="w-fit">
                      {isFinanced ? 'Venta Financiada' : 'Pago Directo'}
                    </Badge>

                    {isFinanced && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Monto Inicial:</span>
                          <span>S/ {(form.watch('initialAmount') || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Tasa de Interés:</span>
                          <span>{form.watch('interestRate') || 0}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Cuotas:</span>
                          <span>{form.watch('quantitySaleCoutes') || 0} pagos</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Form>

      {/* Tabla de Amortización */}
      {showAmortization && amortizationTable.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cronograma de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cuota</TableHead>
                    <TableHead>Fecha de Pago</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amortizationTable.map((installment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {format(new Date(installment.expectedPaymentDate), 'dd/MM/yyyy', {
                          locale: es
                        })}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        S/ {installment.couteAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total de cuotas: {amortizationTable.length}
              </span>
              <span className="text-lg font-bold">
                Total a pagar: S/{' '}
                {amortizationTable.reduce((sum, item) => sum + item.couteAmount, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

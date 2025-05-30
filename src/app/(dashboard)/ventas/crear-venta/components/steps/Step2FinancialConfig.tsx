'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  CalendarIcon,
  Calculator,
  DollarSign,
  Percent,
  Calendar as CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { step2Schema, Step2FormData } from '../../validations/saleValidation';
import { CreateSaleFormData } from '../../validations/saleValidation';
import { calculateAmortization } from '../../action';
import { AmortizationItem } from '@/types/sales';

interface Step2Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
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
      initialAmount: formData.initialAmount || 0,
      interestRate: formData.interestRate || 12,
      quantitySaleCoutes: formData.quantitySaleCoutes || 12,
      firstPaymentDate: formData.firstPaymentDate || '',
      financingInstallments: formData.financingInstallments || []
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
          value.initialAmount !== undefined &&
          value.initialAmount >= 0 &&
          value.interestRate &&
          value.interestRate > 0 &&
          value.quantitySaleCoutes &&
          value.quantitySaleCoutes > 0 &&
          value.firstPaymentDate &&
          value.financingInstallments &&
          value.financingInstallments.length > 0
        );
      }

      updateStepValidation('step2', isValid);

      if (value.totalAmount !== undefined && value.totalAmount !== formData.totalAmount) {
        updateFormData({ totalAmount: value.totalAmount });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation, formData.totalAmount]);

  const handleCalculateAmortization = async () => {
    const values = form.getValues();

    if (
      !values.totalAmount ||
      !values.initialAmount ||
      !values.interestRate ||
      !values.quantitySaleCoutes ||
      !values.firstPaymentDate
    ) {
      toast.error('Complete todos los campos de financiamiento');
      return;
    }

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

      // Actualizar formulario con las cuotas calculadas
      form.setValue('financingInstallments', result.installments);
      updateFormData({
        financingInstallments: result.installments,
        initialAmount: values.initialAmount,
        interestRate: values.interestRate,
        quantitySaleCoutes: values.quantitySaleCoutes,
        firstPaymentDate: values.firstPaymentDate
      });

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
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monto Total del Lote
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos de Habilitación Urbana - Solo si el monto es mayor a 0 */}
            {hasUrbanization && (
              <>
                <FormField
                  control={form.control}
                  name="totalAmountUrbanDevelopment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto Total Habilitación Urbana</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initialAmountUrbanDevelopment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto Inicial HU</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantityHuCuotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad de Cuotas HU</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstPaymentDateHu"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha Primer Pago HU</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'PPP', { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString() || '')}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
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

              <FormField
                control={form.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monto Inicial
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Tasa de Interés (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="12.0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantitySaleCoutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Cantidad de Cuotas (máx. 74)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="74"
                        placeholder="12"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstPaymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Primer Pago</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP', { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString() || '')}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        S/ {form.watch('totalAmount')?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    {hasUrbanization && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Habilitación Urbana:
                        </span>
                        <span className="font-semibold">
                          S/ {form.watch('totalAmountUrbanDevelopment')?.toFixed(2) || '0.00'}
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
                          <span>S/ {form.watch('initialAmount')?.toFixed(2) || '0.00'}</span>
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

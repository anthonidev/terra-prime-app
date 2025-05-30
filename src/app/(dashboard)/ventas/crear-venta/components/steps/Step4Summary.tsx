'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import FormInputField from '@/components/common/form/FormInputField';
import { Building, Clock, CreditCard, DollarSign, FileText, User, UserCheck } from 'lucide-react';

import { CreateSaleFormData, Step4FormData, step4Schema } from '../../validations/saleValidation';

interface Step4Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step4', isValid: boolean) => void;
}

export default function Step4Summary({
  formData,
  updateFormData,
  updateStepValidation
}: Step4Props) {
  const form = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      saleDate: formData.saleDate || '',
      contractDate: formData.contractDate || '',
      paymentDate: formData.paymentDate || ''
    }
  });

  // Validar formulario cuando cambie
  useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid = !!(value.saleDate && value.contractDate && value.paymentDate);

      updateStepValidation('step4', isValid);

      if (isValid) {
        updateFormData({
          saleDate: value.saleDate,
          contractDate: value.contractDate,
          paymentDate: value.paymentDate
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation]);

  const isFinanced = formData.saleType === 'FINANCED';
  const hasUrbanization = (formData.totalAmountUrbanDevelopment || 0) > 0;
  const totalAmount = (formData.totalAmount || 0) + (formData.totalAmountUrbanDevelopment || 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Resumen y Finalización
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Revisa todos los detalles y configura las fechas finales de la venta
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Resumen de la Venta */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
            Resumen de la Venta
          </h3>

          {/* Información del Lote */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4" />
                Información del Lote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tipo de Venta:</span>
                <Badge variant={isFinanced ? 'default' : 'secondary'}>
                  {isFinanced ? 'Financiada' : 'Pago Directo'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Información Financiera */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                Información Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Monto del Lote:</span>
                <span className="font-medium">S/ {formData.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
              {hasUrbanization && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Habilitación Urbana:</span>
                  <span className="font-medium">
                    S/ {formData.totalAmountUrbanDevelopment?.toFixed(2) || '0.00'}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-sm">
                <span className="font-medium text-gray-600 dark:text-gray-400">Total:</span>
                <span className="text-lg font-bold">S/ {totalAmount.toFixed(2)}</span>
              </div>

              {isFinanced && (
                <>
                  <div className="space-y-1 border-t pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Monto Inicial:</span>
                      <span className="font-medium">
                        S/ {formData.initialAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tasa de Interés:</span>
                      <span className="font-medium">{formData.interestRate || 0}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Número de Cuotas:</span>
                      <span className="font-medium">{formData.quantitySaleCoutes || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Cliente ID:</span>
                <span className="font-medium">{formData.clientId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Garante ID:</span>
                <span className="font-medium">{formData.guarantorId}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuración de Fechas */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
            Fechas de la Venta
          </h3>

          <Form {...form}>
            <div className="space-y-4">
              {/* Fecha de Venta */}
              <FormInputField<Step4FormData>
                name="saleDate"
                label="Fecha de Venta"
                placeholder="YYYY-MM-DD"
                type="date"
                icon={<Clock className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />

              {/* Fecha de Contrato */}
              <FormInputField<Step4FormData>
                name="contractDate"
                label="Fecha de Contrato"
                placeholder="YYYY-MM-DD"
                type="date"
                icon={<FileText className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />

              {/* Fecha de Pago */}
              <FormInputField<Step4FormData>
                name="paymentDate"
                label="Fecha de Pago"
                placeholder="YYYY-MM-DD"
                type="date"
                icon={<CreditCard className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />
            </div>
          </Form>

          {/* Resumen de Cronograma (solo para ventas financiadas) */}
          {isFinanced &&
            formData.financingInstallments &&
            formData.financingInstallments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <UserCheck className="h-4 w-4" />
                    Cronograma de Pagos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total de cuotas:</span>
                      <span className="font-medium">{formData.financingInstallments.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Monto por cuota:</span>
                      <span className="font-medium">
                        S/ {formData.financingInstallments[0]?.couteAmount.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Primera cuota:</span>
                      <span className="font-medium">
                        {formData.financingInstallments[0] &&
                          format(
                            new Date(formData.financingInstallments[0].expectedPaymentDate),
                            'dd/MM/yyyy',
                            { locale: es }
                          )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Última cuota:</span>
                      <span className="font-medium">
                        {formData.financingInstallments[
                          formData.financingInstallments.length - 1
                        ] &&
                          format(
                            new Date(
                              formData.financingInstallments[
                                formData.financingInstallments.length - 1
                              ].expectedPaymentDate
                            ),
                            'dd/MM/yyyy',
                            { locale: es }
                          )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-sm">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Total a pagar:
                      </span>
                      <span className="font-bold">
                        S/{' '}
                        {formData.financingInstallments
                          .reduce((sum, item) => sum + item.couteAmount, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Mensaje de confirmación */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
              <FileText className="h-3 w-3 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Listo para crear la venta
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Revisa todos los datos antes de proceder. Una vez creada la venta, se generará el
                contrato y se
                {isFinanced
                  ? ' configurará el cronograma de pagos automáticamente.'
                  : ' registrará el pago.'}
              </p>
              {isFinanced && (
                <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  Se crearán {formData.financingInstallments?.length || 0} cuotas de financiamiento
                  automáticamente.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

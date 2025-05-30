'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { AlertCircle, Check, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import { useStepper } from '@/hooks/stepper/useStepper';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import {
  LeadsVendorItems,
  ProyectBlocksItems,
  ProyectsActivesItems,
  ProyectStagesItems
} from '@/types/sales';
import { useLeadsVendor } from '../hooks/useLeadsVendor';
import { InformationStep } from '../components/InformationStep';
import { FinancingStep } from '../components/FinancingStep';
import { ClientStep } from '../components/ClientStep';
import { useClients } from '../hooks/useClients';
import { createSaleFinanceSchema, SaleFormData } from '@/lib/validations/sales';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateFormatDisplay } from '@/components/common/table/DateFormatDisplay';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Form } from '@/components/ui/form';
import { createSaleFinanced } from '@/lib/actions/sales/saleAction';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SaleModal } from '../components/SaleModal';

const _steps = [{ id: 'step_01' }, { id: 'step_02' }, { id: 'step_03' }, { id: 'step_04' }];

export default function Page() {
  const form = useForm<SaleFormData>({
    resolver: zodResolver(createSaleFinanceSchema),
    defaultValues: {
      quantityHuCuotes: 0,
      initialAmount: 0,
      quantitySaleCoutes: 0,
      interestRate: 13,
      paymentDate: '',
      initialAmountUrbanDevelopment: 0,
      saleDate: new Date().toISOString().split('T')[0],
      contractDate: new Date().toISOString().split('T')[0]
    }
  });
  const { steps, currentStepId, nextStep, prevStep } = useStepper(_steps);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<ProyectsActivesItems | null>(null);
  const [selectedStage, setSelectedStage] = React.useState<ProyectStagesItems | null>(null);
  const [selectedBlock, setSelectedBlock] = React.useState<ProyectBlocksItems | null>(null);
  const [selectedLeadVendor, setSelectedLeadVendor] = React.useState<LeadsVendorItems | null>(null);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const { data: leadsData } = useLeadsVendor();
  const { client, searchClient, createClientGuarantor } = useClients();

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  React.useEffect(() => {
    if (selectedLeadVendor?.document) {
      searchClient(Number(selectedLeadVendor.document));
    }
  }, [selectedLeadVendor?.document, searchClient]);

  const formValues = form.getValues();

  const onSubmit = async (data: SaleFormData) => {
    setIsSubmitting(true);
    setError(null);
    console.table(data);
    try {
      const result = await createSaleFinanced(data);

      if (result.success) {
        toast.success('Venta creada correctamente');
        form.reset();
      } else {
        setError(result.error || 'Error al crear');
        toast.error(result.error || 'Error al crear');
      }
      setOpenModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepContent = () => {
    switch (currentStepId) {
      case 'step_01':
        return (
          <InformationStep
            selectedProject={selectedProject}
            selectedStage={selectedStage}
            selectedBlock={selectedBlock}
            setSelectedProject={setSelectedProject}
            setSelectedStage={setSelectedStage}
            setSelectedBlock={setSelectedBlock}
            form={form}
          />
        );
      case 'step_02':
        return <FinancingStep form={form} />;
      case 'step_03':
        return (
          <ClientStep
            client={client}
            selectedLeadVendor={selectedLeadVendor}
            setSelectedLeadVendor={setSelectedLeadVendor}
            leadsData={leadsData}
            createClientGuarantor={createClientGuarantor}
            form={form}
          />
        );
      case 'step_04':
        return (
          <div className="space-y-3">
            <Card className="bg-slate-50 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Resumen de la Venta</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-xs">Proyecto:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedProject?.name}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Etapa:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedStage?.name}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Manzana:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedBlock?.name}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Método de Pago:</p>
                  <Badge variant={formValues.saleType === 'FINANCED' ? 'default' : 'outline'}>
                    {formValues.saleType === 'FINANCED' ? 'Financiado' : 'Contado'}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Precio Total:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedProject?.currency == 'USD' ? '$' : 'S/.'}&nbsp;{formValues.totalAmount}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fecha de Venta</p>
                  <DateFormatDisplay date={formValues.saleDate} />
                </div>
              </CardContent>
            </Card>
            {formValues.saleType === 'FINANCED' && (
              <Card className="bg-slate-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Detalles de Financiamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Cuota Inicial</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                        {selectedProject?.currency == 'USD' ? '$' : 'S/.'}&nbsp;
                        {formValues.initialAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Tasa de Interés</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                        {formValues.interestRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Número de Cuotas</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                        {formValues.quantitySaleCoutes}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Fecha inicial de pago</p>
                      <DateFormatDisplay date={formValues.paymentDate} />
                    </div>
                  </div>
                  <h4 className="mb-2 font-medium">Cronograma de Pagos</h4>
                  <div className="rounded-md border bg-white dark:bg-gray-900">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N° Cuota</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Fecha de Pago</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formValues.financingInstallments?.map((installment, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              S/ {installment.couteAmount.toLocaleString('es-PE')}
                            </TableCell>
                            <TableCell>
                              <DateFormatDisplay date={installment.expectedPaymentDate} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="bg-slate-50 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Datos del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div>
                  <p className="text-muted-foreground text-xs">Nombre:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedLeadVendor?.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Apellido:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedLeadVendor?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedLeadVendor?.age}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Documento:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedLeadVendor?.document}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono:</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-100">
                    {selectedLeadVendor?.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="container pt-8" onSubmit={form.handleSubmit(onSubmit)}>
          <PageHeader
            icon={User}
            title="Crear Venta"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            variant="default"
          />
          <div className="container">
            <Stepper steps={steps} currentStepId={currentStepId} className="mb-4" />
            <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}
              {Object.entries(form.formState.errors).map(([fieldName, error]) => (
                <Alert
                  key={fieldName}
                  variant="destructive"
                  className="bg-destructive/10 not-only:border-destructive/30 mb-4"
                >
                  <AlertCircle className="text-destructive h-4 w-4" />
                  <AlertDescription className="text-destructive text-sm">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>
                        {fieldName}: {error.message}
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              ))}

              {stepContent()}
              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  className="text-sm font-normal"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepId === _steps[0].id}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                {currentStepId !== _steps[_steps.length - 1].id ? (
                  <Button
                    type="button"
                    className="border border-blue-500 bg-blue-500 text-sm font-normal transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => nextStep()}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 font-normal" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#025864] to-[#00CA7C] font-normal hover:bg-left"
                  >
                    {isSubmitting ? 'Creando...' : 'Finalizar'}
                    <Check className="" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
      <SaleModal isOpen={openModal} onClose={handleCloseModal} />
    </>
  );
}

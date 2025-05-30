import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useAmortization } from '../hooks/useAmortization';
import { DateFormatDisplay } from '@/components/common/table/DateFormatDisplay';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormData } from '@/lib/validations/sales';
import FormInputField from '@/components/common/form/FormInputField';

interface Props {
  form: UseFormReturn<SaleFormData>;
}

export function FinancingStep({ form }: Props) {
  const [includeDecimal, setIncludeDecimal] = React.useState<boolean>(false);

  const { data, meta, isLoading, calculateAmortization } = useAmortization({
    totalAmount: form.getValues().totalAmount,
    initialAmount: form.getValues().initialAmount,
    reservationAmount: 200.0,
    interestRate: form.getValues().interestRate,
    numberOfPayments: form.getValues().quantitySaleCoutes,
    firstPaymentDate: form.getValues().paymentDate,
    includeDecimals: includeDecimal
  });

  React.useEffect(() => {
    if (data && data.length > 0) {
      form.setValue(
        'financingInstallments',
        data.map((item) => ({
          couteAmount: item.couteAmount,
          expectedPaymentDate: item.expectedPaymentDate
        })),
        { shouldValidate: true }
      );
    }
  }, [data, form]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-4"
    >
      <div className="rounded border-l-2 border-green-600 bg-gray-50 p-4 dark:border-green-700 dark:bg-gray-900">
        <h3 className="text-base font-medium text-[#035c64] dark:text-slate-200">
          Método de pago&nbsp;
          <strong>{form.getValues().saleType == 'DIRECT_PAYMENT' ? 'Cash' : 'Financiado'}</strong>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInputField<SaleFormData>
          type="number"
          name="totalAmount"
          label="Precio Lote:"
          placeholder="Precio lote"
          icon={<User className="h-4 w-4" />}
          control={form.control}
          errors={form.formState.errors}
          disabled={data && data.length > 0}
        />
        {form.getValues().totalAmountUrbanDevelopment > 0.0 && (
          <div className="space-y-1">
            <FormInputField<SaleFormData>
              type="number"
              name="totalAmountUrbanDevelopment"
              label="Precio HU:"
              placeholder="Precio HU"
              icon={<User className="h-4 w-4" />}
              control={form.control}
              errors={form.formState.errors}
            />
          </div>
        )}
      </div>
      {form.getValues().totalAmountUrbanDevelopment > 0.0 && (
        <div className="">
          <div className="py-2">
            <h3 className="text-primary inline-flex items-center gap-2 text-base font-medium dark:text-gray-300">
              <User /> Financiamiento de HU
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormInputField<SaleFormData>
              type="number"
              name="quantityHuCuotes"
              label="Nº Cuotas:"
              placeholder="cuotas"
              icon={<User className="h-4 w-4" />}
              control={form.control}
              errors={form.formState.errors}
            />
            <FormInputField<SaleFormData>
              type="number"
              name="initialAmountUrbanDevelopment"
              label="Inicial"
              placeholder="Inicial"
              icon={<User className="h-4 w-4" />}
              control={form.control}
              errors={form.formState.errors}
            />
            <FormInputField<SaleFormData>
              type="date"
              name="firstPaymentDateHu"
              label="Fecha inicial de pago:"
              placeholder="none"
              icon={<User className="h-4 w-4" />}
              control={form.control}
              errors={form.formState.errors}
            />
          </div>
        </div>
      )}
      {form.getValues().saleType == 'FINANCED' && (
        <>
          <div className="">
            <div className="py-2">
              <h3 className="text-primary inline-flex items-center gap-2 text-base font-medium dark:text-gray-300">
                <User /> Financiamiento de Lote
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormInputField<SaleFormData>
                type="number"
                name="quantitySaleCoutes"
                label="Nº Cuotas:"
                placeholder="Cuotas"
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />
              <FormInputField<SaleFormData>
                type="number"
                name="initialAmount"
                label="Precio Inicial:"
                placeholder="Inicial"
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />
              <FormInputField<SaleFormData>
                type="number"
                name="interestRate"
                label="Interes:"
                placeholder="Interes"
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />
              <FormInputField<SaleFormData>
                type="date"
                name="paymentDate"
                label="Fecha inicial de pago:"
                placeholder="Fecha"
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />
              <div className="space-y-1">
                <label
                  htmlFor="includeDecimals"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  Incluir decimales:
                </label>
                <Checkbox
                  id="includeDecimals"
                  checked={includeDecimal}
                  onCheckedChange={(checked) => {
                    setIncludeDecimal(checked === true);
                  }}
                  className="h-5 w-5 rounded-full bg-gray-100"
                  disabled={data && data.length > 0}
                />
              </div>
              <div className="space-y-1">
                <Button
                  type="button"
                  onClick={async () => {
                    await calculateAmortization();
                  }}
                  variant="outline"
                  size="icon"
                  className="w-full bg-gradient-to-r from-[#025864] to-[#00CA7C] px-2 font-normal text-white hover:text-slate-200"
                >
                  {isLoading ? 'Calculando' : 'Calcular amortización'}
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border bg-slate-50 dark:bg-gray-900">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Cuotas</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>{meta.totalCouteAmountSum}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((amort, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Input
                          className="bg-white dark:bg-gray-900"
                          type="number"
                          defaultValue={amort.couteAmount}
                          placeholder="cuota"
                        />
                      </TableCell>
                      <TableCell>
                        <DateFormatDisplay date={amort.expectedPaymentDate} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                      Sin registros existentes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </motion.div>
  );
}

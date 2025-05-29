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

interface Props {
  form: UseFormReturn<SaleFormData>;
}

export function FinancingStep({ form }: Props) {
  const [includeDecimal, setIncludeDecimal] = React.useState<boolean>(false);

  const { data, isLoading, calculateAmortization } = useAmortization({
    totalAmount: form.getValues().totalAmount,
    initialAmount: form.getValues().initialAmount,
    reservationAmount: 200.0,
    interestRate: form.getValues().interestRate,
    numberOfPayments: form.getValues().quantitySaleCoutes,
    firstPaymentDate: form.getValues().paymentDate,
    includeDecimals: includeDecimal
  });

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
          <strong>
            {form.getValues().methodPayment == 'DIRECT_PAYMENT' ? 'Cash' : 'Financiado'}
          </strong>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="totalAmount"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Precio lote:
          </label>
          <Input
            id="totalAmount"
            type="number"
            placeholder="Precio total"
            value={form.watch('totalAmount')}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              form.setValue('totalAmount', value, {
                shouldValidate: true
              });
            }}
            className="bg-background w-full"
          />
        </div>
        {form.getValues().totalAmountUrbanDevelopment > 0.0 && (
          <div className="space-y-1">
            <label
              htmlFor="totalAmountUrbanDevelopment"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Precio HU:
            </label>
            <Input
              placeholder="totalAmountUrbanDevelopment"
              defaultValue={form.watch('totalAmountUrbanDevelopment')}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                form.setValue('totalAmountUrbanDevelopment', value, {
                  shouldValidate: true
                });
              }}
              className="bg-background w-full"
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
            <div className="space-y-1">
              <label
                htmlFor="quantityHuCuotes"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Nº Cuotas:
              </label>
              <Input
                id="quantityHuCuotes"
                defaultValue={form.watch('quantityHuCuotes')}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  form.setValue('quantityHuCuotes', value, {
                    shouldValidate: true
                  });
                }}
                placeholder="Nº cuotas"
                className="bg-background w-full"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="initialAmountUrbanDevelopment"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Inicial:
              </label>
              <Input
                id="initialAmountUrbanDevelopment"
                placeholder="Inicial"
                defaultValue={form.watch('initialAmountUrbanDevelopment')}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  form.setValue('initialAmountUrbanDevelopment', value, {
                    shouldValidate: true
                  });
                }}
                className="bg-background w-full"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="firstPaymentDateHu"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Fecha inicial de pago:
              </label>
              <Input
                id="firstPaymentDateHu"
                type="date"
                defaultValue={form.getValues().firstPaymentDateHu}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                  form.setValue('firstPaymentDateHu', formattedDate, {
                    shouldValidate: true
                  });
                }}
                className="bg-background w-full"
              />
            </div>
          </div>
        </div>
      )}
      {form.getValues().methodPayment == 'FINANCED' && (
        <>
          <div className="">
            <div className="py-2">
              <h3 className="text-primary inline-flex items-center gap-2 text-base font-medium dark:text-gray-300">
                <User /> Financiamiento de Lote
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <label
                  htmlFor="quantitySaleCoutes"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  Nº Cuotas:
                </label>
                <Input
                  type="number"
                  id="quantitySaleCoutes"
                  defaultValue={form.watch('quantitySaleCoutes')}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    form.setValue('quantitySaleCoutes', value, {
                      shouldValidate: true
                    });
                  }}
                  placeholder="Nº cuotas"
                  className="bg-background w-full"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="initialAmount"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  Precio Inicial:
                </label>
                <Input
                  type="number"
                  id="initialAmount"
                  value={form.getValues('initialAmount')}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    form.setValue('initialAmount', value, {
                      shouldValidate: true
                    });
                  }}
                  placeholder="Precio Inicial"
                  className="bg-background w-full"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="interestRate"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  Interes:
                </label>
                <Input
                  type="number"
                  id="interestRate"
                  defaultValue={form.getValues('interestRate')}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    form.setValue('interestRate', value, {
                      shouldValidate: true
                    });
                  }}
                  placeholder="Interes"
                  className="bg-background w-full"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="paymentDate"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  Fecha inicial de pago:
                </label>
                <Input
                  type="date"
                  id="paymentDate"
                  defaultValue={form.getValues().paymentDate}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                    form.setValue('paymentDate', formattedDate, {
                      shouldValidate: true
                    });
                  }}
                  className="bg-background w-full"
                />
              </div>
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
                  onCheckedChange={() => setIncludeDecimal(!includeDecimal)}
                  className="h-5 w-5 rounded-full bg-gray-100"
                />
              </div>
              <div className="space-y-1">
                <Button
                  type="button"
                  onClick={calculateAmortization}
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

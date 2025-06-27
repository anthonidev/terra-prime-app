'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { motion } from 'framer-motion';
import { ArrowRight, Dock, DockIcon, Square, UserIcon, UserPlus, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { UrbanFinancing, SalesCollector } from '@domain/entities/cobranza';
import { CurrencyType } from '@domain/entities/sales/salevendor.entity';
import VentaTable from './VentaTable';
import { StatusBadge } from '@/components/common/table/StatusBadge';
import HuTable from './HuTable';
import { Button } from '@/components/ui/button';
import { PaymentSummary } from './PaymentSummary';
import { cn } from '@/lib/utils';
import VentaCard from './VentaCard';
import HuCard from './HuCard';

interface Props {
  sale: SalesCollector;
  urbanDevelopment: UrbanFinancing;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DataForm({ sale, urbanDevelopment }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isUrban, setIsUrban] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('venta');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleUrban = () => {
    setOpen(true);
    setIsUrban(true);
  };

  return (
    <>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex aspect-video h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      activeTab === 'venta'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    <Dock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Venta</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Información general</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <div className="flex items-center gap-4">
                  <div
                    className={`flex aspect-video h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      activeTab === 'hu'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                    }`}
                  >
                    <Square className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Habilitación urbana
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Información general</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="flex items-center justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 dark:bg-gray-800">
                <TabsTrigger
                  value="venta"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900"
                >
                  <Dock className="h-4 w-4" />
                  Venta
                </TabsTrigger>
                <TabsTrigger
                  value="hu"
                  disabled={urbanDevelopment.financing ? false : true}
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900"
                >
                  <UserPlus className="h-4 w-4" />
                  Habilitación Urbana
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="venta" className="space-y-6">
              <div
                className={cn(
                  'grid gap-4',
                  sale.secondaryClients?.length > 0 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-2'
                )}
              >
                <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <DockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Detalles del Financiamiento</CardTitle>
                        <CardDescription>Información general de la transacción</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
                        <p className="font-medium">
                          <StatusBadge status={sale.type} />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monto Total</p>
                        <p className="font-medium text-green-500">
                          {formatCurrency(Number(sale.totalAmount), sale.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                        <p className="font-medium">
                          <StatusBadge status={sale.status} />
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                        <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Cliente Principal</CardTitle>
                        <CardDescription>Información del titular</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                        <p className="font-medium">
                          {sale.client.firstName} {sale.client.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                        <p className="font-medium">{sale.client.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                        <p className="font-medium">{sale.client.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {sale.secondaryClients?.length > 0 && (
                  <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <UsersIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Clientes Secundarios</CardTitle>
                          <CardDescription>Personas adicionales asociadas</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {sale.secondaryClients.map((secondaryClient, index) => (
                        <div key={index} className="mb-4 grid grid-cols-2 gap-4 last:mb-0">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                            <p className="font-medium">
                              {secondaryClient.firstName} {secondaryClient.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                            <p className="font-medium">{secondaryClient.phone}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                            <p className="font-medium">{secondaryClient.address}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <div className="inline-flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <DockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Cuotas</CardTitle>
                        <CardDescription>Plan de pagos</CardDescription>
                      </div>
                    </div>
                    <Button onClick={() => setOpen(true)}>Realizar pago</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="hidden md:block">
                    <VentaTable
                      currency={sale.currency}
                      data={sale.financing.financingInstallments}
                    />
                  </div>
                  <div className="md:hidden">
                    <VentaCard
                      currency={sale.currency}
                      data={sale.financing.financingInstallments}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {urbanDevelopment ? (
              <TabsContent value="hu" className="space-y-6">
                <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <DockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Detalles del Financiamiento (Habilitación Urbana)
                        </CardTitle>
                        <CardDescription>Información general de la transacción</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cuota Inicial</p>
                        <p className="font-medium text-green-500">
                          {formatCurrency(
                            Number(urbanDevelopment?.financing?.initialAmount),
                            sale.currency
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Interes</p>
                        <p className="font-medium">% {urbanDevelopment?.financing?.interestRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nº Cuotas</p>
                        <p className="font-medium">{urbanDevelopment?.financing?.quantityCoutes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <div className="inline-flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <DockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Cuotas</CardTitle>
                          <CardDescription>Plan de pagos</CardDescription>
                        </div>
                      </div>
                      <Button onClick={handleUrban}>Realizar pago</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="hidden md:block">
                      <HuTable
                        currency={sale.currency}
                        data={urbanDevelopment?.financing?.financingInstallments}
                      />
                    </div>
                    <div className="md:hidden">
                      <HuCard
                        currency={sale.currency}
                        data={urbanDevelopment?.financing?.financingInstallments}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ) : null}
          </Tabs>
        </motion.div>
      </motion.div>
      <PaymentSummary
        isUrban={isUrban}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        urbanFinancing={urbanDevelopment}
        sale={sale}
      />
    </>
  );
}

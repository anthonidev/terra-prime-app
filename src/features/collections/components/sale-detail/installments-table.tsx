'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCurrency } from '@/shared/lib/utils';
import { StatusPayment, type Installment } from '../../types';
import { PaymentsModal } from './payments-modal';

interface InstallmentsTableProps {
  installments: Installment[];
}

const statusConfig: Record<
  StatusPayment,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  [StatusPayment.PENDING]: { label: 'Pendiente', variant: 'outline' },
  [StatusPayment.APPROVED]: { label: 'Aprobado', variant: 'default' },
  [StatusPayment.COMPLETED]: { label: 'Completado', variant: 'default' },
  [StatusPayment.REJECTED]: { label: 'Rechazado', variant: 'destructive' },
  [StatusPayment.CANCELLED]: { label: 'Cancelado', variant: 'destructive' },
};

export function InstallmentsTable({ installments }: InstallmentsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {installments.map((installment, index) => {
            const status = statusConfig[installment.status];
            return (
              <Card key={installment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Cuota #{index + 1}</CardTitle>
                    {/* <Badge variant={status.variant}>{status.label}</Badge> */}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vencimiento:</span>
                    <span>{new Date(installment.expectedPaymentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto:</span>
                    <span>{formatCurrency(Number(installment.couteAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagado:</span>
                    <span className="text-green-600">{formatCurrency(installment.coutePaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendiente:</span>
                    <span className="text-red-600">
                      {formatCurrency(Number(installment.coutePending))}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setSelectedInstallment(installment)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Pagos ({installment.payments.length})
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {selectedInstallment && (
          <PaymentsModal
            open={!!selectedInstallment}
            onOpenChange={(open) => !open && setSelectedInstallment(null)}
            payments={selectedInstallment.payments}
            installmentNumber={installments.indexOf(selectedInstallment) + 1}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Pagado</TableHead>
              <TableHead>Pendiente</TableHead>
              <TableHead>Mora Pend.</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installments.map((installment, index) => {
              // const status = statusConfig[installment.status];
              return (
                <TableRow key={installment.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {new Date(installment.expectedPaymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatCurrency(Number(installment.couteAmount))}</TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(installment.coutePaid)}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {formatCurrency(Number(installment.coutePending))}
                  </TableCell>
                  <TableCell>{formatCurrency(Number(installment.lateFeeAmountPending))}</TableCell>
                  {/* <TableCell>
                    <Badge>{status.label}</Badge>
                  </TableCell> */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInstallment(installment)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Pagos ({installment.payments.length})
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedInstallment && (
        <PaymentsModal
          open={!!selectedInstallment}
          onOpenChange={(open) => !open && setSelectedInstallment(null)}
          payments={selectedInstallment.payments}
          installmentNumber={installments.indexOf(selectedInstallment) + 1}
        />
      )}
    </>
  );
}

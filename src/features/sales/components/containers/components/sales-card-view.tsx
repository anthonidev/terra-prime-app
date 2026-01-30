'use client';

import { motion } from 'framer-motion';
import { formatDateTime } from '@/shared/utils/date-formatter';
import {
  Calendar,
  User,
  MapPin,
  Building2,
  DollarSign,
  Eye,
  Package,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SaleType, type MySale, StatusSale } from '../../../types';

// Status badge configurations
const statusConfig: Record<
  StatusSale,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  RESERVATION_PENDING: { label: 'Reserva Pendiente', variant: 'outline' },
  RESERVATION_PENDING_APPROVAL: { label: 'Reserva Por Aprobar', variant: 'secondary' },
  RESERVED: { label: 'Reservado', variant: 'default' },
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PENDING_APPROVAL: { label: 'Por Aprobar', variant: 'secondary' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  IN_PAYMENT_PROCESS: { label: 'En Proceso', variant: 'secondary' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  RESERVATION_IN_PAYMENT: { label: 'Reserva en Pago', variant: 'secondary' },
  IN_PAYMENT: { label: 'En Pago', variant: 'secondary' },
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
};

interface SalesCardViewProps {
  sales: MySale[];
}

export function SalesCardView({ sales }: SalesCardViewProps) {
  return (
    <div className="grid gap-4">
      {sales.map((sale, index) => {
        const totalAmount = parseFloat(sale.totalAmount.toString());
        const paid = sale.totalAmountPaid || 0;
        const pending = parseFloat(sale.totalAmount) - paid;

        const hasReports = sale.radicationPdfUrl || sale.paymentAcordPdfUrl;

        return (
          <motion.div
            key={sale.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Building2 className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="leading-none font-semibold">{sale.lot.name}</p>
                      <p className="text-muted-foreground mt-1 text-xs">{sale.lot.project}</p>
                    </div>
                  </div>
                  <Badge variant={statusConfig[sale.status].variant}>
                    {statusConfig[sale.status].label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                {/* Client Info */}
                <div className="flex items-start gap-2">
                  <User className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {sale.client.firstName} {sale.client.lastName}
                    </p>
                    <p className="text-muted-foreground text-xs">{sale.client.phone}</p>
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      {sale.lot.stage} - {sale.lot.block}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Sale Details */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Sale Type */}
                  <div className="flex items-start gap-2">
                    <Package className="text-muted-foreground mt-0.5 h-4 w-4" />
                    <div>
                      <p className="text-muted-foreground text-xs">Tipo</p>
                      <Badge variant="secondary" className="mt-0.5 font-normal">
                        {sale.type === SaleType.DIRECT_PAYMENT ? 'Contado' : 'Financiado'}
                      </Badge>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="text-muted-foreground mt-0.5 h-4 w-4" />
                    <div>
                      <p className="text-muted-foreground text-xs">Monto Total</p>
                      <p className="text-primary text-sm font-semibold">
                        {sale.currency === 'USD' ? '$' : 'S/'} {totalAmount.toLocaleString('es-PE')}
                      </p>
                    </div>
                  </div>

                  {/* Paid Amount */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="mt-0.5 h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-muted-foreground text-xs">Pagado</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {sale.currency === 'USD' ? '$' : 'S/'} {paid.toLocaleString('es-PE')}
                      </p>
                    </div>
                  </div>

                  {/* Pending Amount */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="mt-0.5 h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-muted-foreground text-xs">Pendiente</p>
                      <p className="text-sm font-semibold text-orange-600">
                        {sale.currency === 'USD' ? '$' : 'S/'} {pending.toLocaleString('es-PE')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reports Links if available */}
                {hasReports && (
                  <>
                    <Separator />
                    <div className="flex justify-end gap-2">
                      {sale.radicationPdfUrl && (
                        <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                          <a href={sale.radicationPdfUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-3 w-3 text-blue-600" />
                            Radicación
                          </a>
                        </Button>
                      )}
                      {sale.paymentAcordPdfUrl && (
                        <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                          <a
                            href={sale.paymentAcordPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="mr-2 h-3 w-3 text-green-600" />
                            Acuerdo Pago
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 pt-1">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <p className="text-muted-foreground text-xs">
                    {formatDateTime(sale.createdAt, "dd 'de' MMMM, yyyy")}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-3">
                <Button variant="default" size="sm" className="w-full" asChild>
                  <Link href={`/ventas/detalle/${sale.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalle
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

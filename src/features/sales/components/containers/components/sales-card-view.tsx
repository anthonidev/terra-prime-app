'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, User, MapPin, Building2, DollarSign, Eye, Package } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { MySale, StatusSale } from '../../../types';

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
  IN_PAYMENT_PROCESS: { label: 'En Proceso de Pago', variant: 'secondary' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
};

interface SalesCardViewProps {
  sales: MySale[];
}

export function SalesCardView({ sales }: SalesCardViewProps) {
  return (
    <div className="grid gap-4">
      {sales.map((sale, index) => (
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold leading-none">{sale.lot.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sale.lot.project}
                    </p>
                  </div>
                </div>
                <Badge variant={statusConfig[sale.status].variant}>
                  {statusConfig[sale.status].label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pb-3 space-y-3">
              {/* Client Info */}
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {sale.client.firstName} {sale.client.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{sale.client.phone}</p>
                </div>
              </div>

              {/* Location Info */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
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
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">
                      {sale.type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Monto Total</p>
                    <p className="text-sm font-semibold text-primary">
                      {sale.currency === 'USD' ? '$' : 'S/'}{' '}
                      {sale.totalAmount.toLocaleString('es-PE')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 pt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {format(new Date(sale.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </CardContent>

            <CardFooter className="pt-3">
              <Button variant="default" size="sm" className="w-full" asChild>
                <Link href={`/ventas/detalle/${sale.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalle
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

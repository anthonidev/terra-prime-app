'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/shared/utils/date-formatter';
import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  DollarSign,
  Download,
  Eye,
  FilePlus,
  FileText,
  MapPin,
  MoreVertical,
  Package,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  useGeneratePaymentAccordPdf,
  useGenerateRadicationPdf,
  useRegeneratePaymentAccordPdf,
  useRegenerateRadicationPdf,
} from '../../hooks/use-generate-pdfs';
import type { AdminSale } from '../../types';
import { AssignParticipantsModal } from '../dialogs/assign-participants-modal';
import { UserInfo } from '@/shared/components/user-info';
import { statusConfig } from '../shared/status-config';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface AdminSalesCardViewProps {
  sales: AdminSale[];
}

function SaleCard({ sale, index }: { sale: AdminSale; index: number }) {
  const { user } = useAuth();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const generateRadicationPdf = useGenerateRadicationPdf();
  const regenerateRadicationPdf = useRegenerateRadicationPdf();
  const generatePaymentAccordPdf = useGeneratePaymentAccordPdf();
  const regeneratePaymentAccordPdf = useRegeneratePaymentAccordPdf();

  const isJVE = user?.role?.code === 'JVE';

  const handleGenerateRadication = () => {
    if (sale.radicationPdfUrl) {
      regenerateRadicationPdf.mutate(sale.id);
    } else {
      generateRadicationPdf.mutate(sale.id);
    }
  };

  const handleGeneratePaymentAccord = () => {
    if (sale.paymentAcordPdfUrl) {
      regeneratePaymentAccordPdf.mutate(sale.id);
    } else {
      generatePaymentAccordPdf.mutate(sale.id);
    }
  };

  const isLoading =
    generateRadicationPdf.isPending ||
    regenerateRadicationPdf.isPending ||
    generatePaymentAccordPdf.isPending ||
    regeneratePaymentAccordPdf.isPending;

  return (
    <>
      <motion.div
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
            <UserInfo
              name={`${sale.client.firstName} ${sale.client.lastName}`}
              phone={sale.client.phone}
              className="p-0"
            />

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
                  <p className="text-sm font-medium">
                    {sale.type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start gap-2">
                <DollarSign className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Monto Total</p>
                  <p className="text-primary text-sm font-semibold">
                    {sale.currency === 'USD' ? '$' : 'S/'}{' '}
                    {parseFloat(sale.totalAmount.toString()).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>

              {/* Paid Amount */}
              <div className="flex items-start gap-2">
                <DollarSign className="mt-0.5 h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-muted-foreground text-xs">Pagado</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {sale.currency === 'USD' ? '$' : 'S/'}{' '}
                    {(sale.totalAmountPaid || 0).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>

              {/* Pending Amount */}
              <div className="flex items-start gap-2">
                <DollarSign className="mt-0.5 h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-muted-foreground text-xs">Pendiente</p>
                  <p className="text-sm font-semibold text-orange-600">
                    {sale.currency === 'USD' ? '$' : 'S/'}{' '}
                    {(
                      parseFloat(sale.totalAmount.toString()) - (sale.totalAmountPaid || 0)
                    ).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 pt-1">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs">
                {formatDateTime(sale.createdAt, "dd 'de' MMMM, yyyy")}
              </p>
            </div>

            {/* Reports Section */}
            {(sale.radicationPdfUrl || sale.paymentAcordPdfUrl) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium">Reportes</p>
                  <div className="flex flex-col gap-1.5">
                    {sale.radicationPdfUrl && (
                      <Button variant="outline" size="sm" className="h-8 justify-start" asChild>
                        <a href={sale.radicationPdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          <span className="text-xs">PDF Radicación</span>
                        </a>
                      </Button>
                    )}
                    {sale.paymentAcordPdfUrl && (
                      <Button variant="outline" size="sm" className="h-8 justify-start" asChild>
                        <a href={sale.paymentAcordPdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          <span className="text-xs">PDF Acuerdo de Pagos</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 pt-3">
            <Button variant="default" size="sm" className="flex-1" asChild>
              <Link href={`/ventas/detalle/${sale.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver
              </Link>
            </Button>

            {isJVE && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsAssignModalOpen(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Asignar Participantes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleGenerateRadication}>
                    {sale.radicationPdfUrl ? (
                      <>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Regenerar PDF Radicación
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generar PDF Radicación
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGeneratePaymentAccord}>
                    {sale.paymentAcordPdfUrl ? (
                      <>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Regenerar PDF Acuerdo de Pagos
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generar PDF Acuerdo de Pagos
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {isJVE && (
        <AssignParticipantsModal
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          saleId={sale.id}
        />
      )}
    </>
  );
}

export function AdminSalesCardView({ sales }: AdminSalesCardViewProps) {
  return (
    <div className="grid gap-4">
      {sales.map((sale, index) => (
        <SaleCard key={sale.id} sale={sale} index={index} />
      ))}
    </div>
  );
}

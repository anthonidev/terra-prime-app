'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { FileText, Eye, Download, User, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { InvoiceListItem } from '../../types';
import { DocumentTypeLabels, Currency } from '../../types';
import { invoiceStatusConfig } from '../shared/status-config';

interface InvoicesCardViewProps {
  invoices: InvoiceListItem[];
}

function InvoiceCard({ invoice, index }: { invoice: InvoiceListItem; index: number }) {
  const symbol = invoice.currency === Currency.USD ? '$' : 'S/';
  const docTypeLabel = DocumentTypeLabels[invoice.documentType] || 'Comprobante';
  const statusConfig = invoiceStatusConfig[invoice.status] || {
    label: invoice.status,
    variant: 'outline' as const,
  };
  const isFactura = invoice.documentType === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
        <CardHeader className="bg-muted/30 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border">
                <FileText className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-lg leading-none font-bold">{invoice.fullNumber}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant={isFactura ? 'default' : 'secondary'} className="text-xs">
                    {docTypeLabel}
                  </Badge>
                </div>
              </div>
            </div>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Total Amount */}
          <div className="flex items-center gap-3">
            <div className="bg-muted/50 rounded-md p-2">
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total</p>
              <p className="text-lg font-bold">
                {symbol} {invoice.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Client Info */}
          <div className="flex items-start gap-3">
            <div className="bg-muted/50 rounded-md p-2">
              <User className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{invoice.clientName}</p>
              <p className="text-muted-foreground font-mono text-xs">
                {invoice.clientDocumentNumber}
              </p>
            </div>
          </div>

          <Separator />

          {/* Created Info */}
          <div className="bg-muted/20 border-border/50 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Fecha de creación</span>
              <span className="text-sm font-medium">
                {format(new Date(invoice.createdAt), 'dd MMM yyyy', { locale: es })}
              </span>
            </div>
            {invoice.createdBy && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Creado por</span>
                <span className="text-sm">
                  {invoice.createdBy.firstName} {invoice.createdBy.lastName}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-0 pb-4">
          {invoice.pdfUrl && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </a>
            </Button>
          )}
          {invoice.payment?.id && (
            <Button variant="default" size="sm" className="flex-1 shadow-sm" asChild>
              <Link href={`/pagos/detalle/${invoice.payment.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Pago
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function InvoicesCardView({ invoices }: InvoicesCardViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {invoices.map((invoice, index) => (
        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
      ))}
    </div>
  );
}

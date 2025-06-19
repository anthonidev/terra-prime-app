import { Card, CardContent } from '@/components/ui/card';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { User } from 'lucide-react';

export default function PaymentClientSection({ payment }: { payment: PaymentDetailItem }) {
  return (
    <div className="space-y-5 rounded-md border bg-white p-6 dark:bg-gray-900">
      <Card className="bg-background rounded-xl shadow-sm">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Información del Cliente</h3>
              <p className="text-muted-foreground text-sm">Detalles del cliente</p>
            </div>
          </div>

          <div className="border-primary/20 mt-4 border-l-2 pl-2">
            <p className="text-muted-foreground mt-3 mb-1 text-sm">Nombre completo:</p>
            <p className="text-sm">
              {payment.client.lead.firstName + ' ' + payment.client.lead.lastName}
            </p>
            <p className="text-muted-foreground mt-3 mb-1 text-sm">Número de documento:</p>
            <p className="text-sm">{payment.client.lead.document ?? 'Sin documento'}</p>
            <p className="text-muted-foreground mt-3 mb-1 text-sm">Dirección:</p>
            <p className="text-sm">{payment.client.address ?? '--'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

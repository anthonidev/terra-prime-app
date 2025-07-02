import { Card, CardContent } from '@/components/ui/card';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { Building, User } from 'lucide-react';

export default function PaymentUserSection({ payment }: { payment: PaymentDetailItem }) {
  return (
    <div className="space-y-5 rounded-md border bg-white p-6 dark:bg-gray-900">
      <Card className="bg-background rounded-xl shadow-sm">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Información del Vendedor</h3>
              <p className="text-muted-foreground text-sm">Detalles del propietario del pago</p>
            </div>
          </div>
          <div className="border-primary/20 mt-4 border-l-2 pl-2">
            <p className="text-muted-foreground mb-1 text-sm">Email:</p>
            <p className="text-base font-medium break-all">{payment.user.email}</p>
            <p className="text-muted-foreground mt-3 mb-1 text-sm">Nombre completo:</p>
            <p className="text-sm">{payment.user.firstName + ' ' + payment.user.lastName}</p>
            <p className="text-muted-foreground mt-3 mb-1 text-sm">Número de documento:</p>
            <p className="text-sm">{payment.user.document ?? 'Sin documento'}</p>
          </div>
        </CardContent>
      </Card>

      {payment.reviewBy && (
        <Card className="bg-background rounded-xl shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <Building className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Revisado por</h3>
                <p className="text-muted-foreground text-sm">Administrador que procesó el pago</p>
              </div>
            </div>
            <p className="mt-2 text-base font-medium">{payment.reviewBy.email ?? '--'}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

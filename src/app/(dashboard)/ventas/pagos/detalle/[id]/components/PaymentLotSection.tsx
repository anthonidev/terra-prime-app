import { Card, CardContent } from '@/components/ui/card';
import { PaymentLot } from '@domain/entities/sales/payment.entity';
import { Square } from 'lucide-react';

export default function PaymentClientSection({ lot }: { lot: PaymentLot }) {
  return (
    <div className="space-y-5 rounded-md border bg-white p-6 dark:bg-gray-900">
      <Card className="bg-background rounded-xl shadow-sm">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Square className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Información del lote</h3>
              <p className="text-muted-foreground text-sm">Detalles del lote</p>
            </div>
          </div>

          <div className="border-primary/20 mt-4 border-l-2 pl-2">
            <p className="text-muted-foreground mt-3 mb-1 text-sm">
              Lote: <span className="text-gray-800 dark:text-slate-200">{lot.name ?? '--'}</span>
            </p>
            <p className="text-muted-foreground mt-3 mb-1 text-sm">
              Etapa: <span className="text-gray-800 dark:text-slate-200">{lot.stage ?? '--'}</span>
            </p>
            <p className="text-muted-foreground mt-3 mb-1 text-sm">
              Manzana:&nbsp;
              <span className="text-gray-800 dark:text-slate-200">{lot.block ?? '--'}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

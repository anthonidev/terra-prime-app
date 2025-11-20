import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function PaymentsEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
          <Wallet className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No hay pagos</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
          No se encontraron pagos que coincidan con los filtros aplicados. Intenta ajustar los
          criterios de búsqueda.
        </p>
      </CardContent>
    </Card>
  );
}

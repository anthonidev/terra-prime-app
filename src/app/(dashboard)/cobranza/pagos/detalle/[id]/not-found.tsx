import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-8">
      <div className="bg-muted/50 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
        <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">Detalle no encontrado</h3>
        <p className="text-muted-foreground mb-4">
          El detalle que estás buscando no existe o ha sido eliminada.
        </p>
        <Link href="/cobranza/pagos">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Pagos
          </Button>
        </Link>
      </div>
    </div>
  );
}

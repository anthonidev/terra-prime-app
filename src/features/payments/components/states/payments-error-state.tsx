import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PaymentsErrorState() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar los pagos</AlertTitle>
          <AlertDescription>
            Hubo un problema al cargar la lista de pagos. Por favor, intenta nuevamente más tarde.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

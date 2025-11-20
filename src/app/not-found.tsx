import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <FileQuestion className="text-muted-foreground h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Página no encontrada</CardTitle>
          <CardDescription>
            La página que estás buscando no existe o ha sido movida. Verifica la URL o vuelve al
            inicio.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <div className="bg-muted inline-flex items-center justify-center rounded-md px-3 py-1.5">
            <span className="text-muted-foreground text-7xl font-bold">404</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button asChild className="w-full sm:w-auto" variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

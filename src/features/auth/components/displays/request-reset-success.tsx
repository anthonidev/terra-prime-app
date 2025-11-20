'use client';

import { CheckCircle2 } from 'lucide-react';
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

interface RequestResetSuccessProps {
  email: string;
}

export function RequestResetSuccess({ email }: RequestResetSuccessProps) {
  return (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="mt-4 text-center text-2xl font-bold">Solicitud enviada</CardTitle>
        <CardDescription className="text-center">
          Hemos enviado instrucciones para restablecer tu contraseña a
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="text-lg font-medium">{email}</div>
        <p className="text-muted-foreground">
          Revisa tu bandeja de entrada y sigue las instrucciones para completar el proceso. El
          enlace será válido por 24 horas.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/auth/login">
          <Button variant="outline">Volver a Iniciar Sesión</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

'use client';

import { Loader2 } from 'lucide-react';
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

interface TokenVerificationProps {
  isVerifying: boolean;
  isError: boolean;
}

export function TokenVerification({ isVerifying, isError }: TokenVerificationProps) {
  if (isVerifying) {
    return (
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">Verificando...</CardTitle>
          <CardDescription className="text-center">
            Estamos verificando la validez de tu enlace
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-destructive text-center text-2xl font-bold">
            Enlace inválido o expirado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            Por favor, solicita un nuevo enlace para restablecer tu contraseña.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/reset-password">
            <Button>Solicitar nuevo enlace</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return null;
}

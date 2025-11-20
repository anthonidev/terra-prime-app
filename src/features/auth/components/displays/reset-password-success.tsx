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

export function ResetPasswordSuccess() {
  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="mt-4 text-center text-2xl font-bold">
          ¡Contraseña restablecida!
        </CardTitle>
        <CardDescription className="text-center">
          Tu contraseña ha sido actualizada correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 py-4 text-center">
        <p className="text-muted-foreground">Ahora puedes iniciar sesión con tu nueva contraseña</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/auth/login">
          <Button>Ir a iniciar sesión</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

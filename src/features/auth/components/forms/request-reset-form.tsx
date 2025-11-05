'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { requestPasswordResetSchema } from '../../lib/validation';
import { useRequestPasswordReset } from '../../hooks/use-request-password-reset';
import type { RequestPasswordResetInput } from '../../types';

interface RequestResetFormProps {
  onSuccess: (email: string) => void;
}

export function RequestResetForm({ onSuccess }: RequestResetFormProps) {
  const { mutate, isPending } = useRequestPasswordReset();

  const form = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: RequestPasswordResetInput) => {
    mutate(values, {
      onSuccess: () => {
        onSuccess(values.email);
      },
    });
  };

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          Recuperar contraseña
        </CardTitle>
        <CardDescription className="text-center">
          Ingresa tu correo electrónico para recibir las instrucciones de
          recuperación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <FormControl>
                      <Input
                        placeholder="correo@ejemplo.com"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar instrucciones'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Regresa a&nbsp;
          <Link href="/auth/login" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

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
    <Card className="border-none shadow-none dark:bg-transparent">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Recuperar contraseña
        </CardTitle>
        <CardDescription className="text-center text-base text-gray-500 dark:text-gray-400">
          Ingresa tu correo electrónico para recibir las instrucciones de recuperación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico
                  </FormLabel>
                  <div className="group relative">
                    <div className="group-focus-within:text-primary absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="correo@ejemplo.com"
                        className="focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/30 h-11 border-gray-200 bg-gray-50 pl-10 text-base transition-all focus:bg-white focus:ring-2 dark:border-gray-800 dark:bg-gray-900/50 dark:focus:bg-gray-900"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="animate-pulse text-sm font-medium text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-primary shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 dark:shadow-primary/10 h-11 w-full text-base font-semibold text-white shadow-lg transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar instrucciones'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Regresa a&nbsp;
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

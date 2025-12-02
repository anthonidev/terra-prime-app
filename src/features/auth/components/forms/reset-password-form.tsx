'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { resetPasswordSchema } from '../../lib/validation';
import { useResetPassword } from '../../hooks/use-reset-password';

interface ResetPasswordFormProps {
  token: string;
  email: string;
  onSuccess: () => void;
}

export function ResetPasswordForm({ token, email, onSuccess }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { mutate, isPending } = useResetPassword(token);

  const form = useForm<{ password: string; passwordConfirm: string }>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (values: { password: string; passwordConfirm: string }) => {
    mutate(
      { password: values.password },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <Card className="border-none shadow-none dark:bg-transparent">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Crear nueva contraseña
        </CardTitle>
        <CardDescription className="text-center text-base text-gray-500 dark:text-gray-400">
          {email ? `Para la cuenta: ${email}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nueva contraseña
                  </FormLabel>
                  <div className="group relative">
                    <div className="group-focus-within:text-primary absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors">
                      <LockKeyhole className="h-5 w-5" />
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          className="focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/30 h-11 border-gray-200 bg-gray-50 pr-10 pl-10 text-base transition-all focus:bg-white focus:ring-2 dark:border-gray-800 dark:bg-gray-900/50 dark:focus:bg-gray-900"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                  </div>
                  <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                    Debe contener al menos 6 caracteres, una mayúscula, una minúscula y un número
                  </FormDescription>
                  <FormMessage className="animate-pulse text-sm font-medium text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar contraseña
                  </FormLabel>
                  <div className="group relative">
                    <div className="group-focus-within:text-primary absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors">
                      <LockKeyhole className="h-5 w-5" />
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswordConfirm ? 'text' : 'password'}
                          className="focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/30 h-11 border-gray-200 bg-gray-50 pr-10 pl-10 text-base transition-all focus:bg-white focus:ring-2 dark:border-gray-800 dark:bg-gray-900/50 dark:focus:bg-gray-900"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        >
                          {showPasswordConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                  Cambiando contraseña...
                </>
              ) : (
                'Cambiar contraseña'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

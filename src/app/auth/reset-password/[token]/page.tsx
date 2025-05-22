'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { resetPassword, verifyResetToken } from '@/lib/actions/auth/password-reset.action';

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      }),
    passwordConfirm: z.string()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm']
  });

type FormData = z.infer<typeof formSchema>;

enum TokenStatus {
  CHECKING = 'checking',
  VALID = 'valid',
  INVALID = 'invalid',
  RESET_SUCCESS = 'reset_success',
  RESET_ERROR = 'reset_error'
}

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(TokenStatus.CHECKING);
  const [userEmail, setUserEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      passwordConfirm: ''
    }
  });

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await verifyResetToken(token);
        if (response.success) {
          setTokenStatus(TokenStatus.VALID);
          if (response.email) {
            setUserEmail(response.email);
          }
        } else {
          setTokenStatus(TokenStatus.INVALID);
          setErrorMessage(response.message);
        }
      } catch (error) {
        setTokenStatus(TokenStatus.INVALID);
        setErrorMessage(error instanceof Error ? error.message : 'Error al verificar el token');
      }
    }

    checkToken();
  }, [token]);

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await resetPassword(token, values.password);

      if (response.success) {
        setTokenStatus(TokenStatus.RESET_SUCCESS);
      } else {
        setTokenStatus(TokenStatus.RESET_ERROR);
        setErrorMessage(response.message);
      }
    } catch (error) {
      setTokenStatus(TokenStatus.RESET_ERROR);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al restablecer la contraseña'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (tokenStatus) {
      case TokenStatus.CHECKING:
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

      case TokenStatus.INVALID:
        return (
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-destructive text-center text-2xl font-bold">
                Enlace inválido o expirado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMessage ||
                    'El enlace para restablecer la contraseña es inválido o ha expirado.'}
                </AlertDescription>
              </Alert>
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

      case TokenStatus.VALID:
        return (
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl font-bold">
                Crear nueva contraseña
              </CardTitle>
              <CardDescription className="text-center">
                {userEmail ? `Para la cuenta: ${userEmail}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva contraseña</FormLabel>
                        <div className="relative">
                          <LockKeyhole className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                className="pr-10 pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="text-muted-foreground h-4 w-4" />
                                ) : (
                                  <Eye className="text-muted-foreground h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                        </div>
                        <FormDescription className="text-xs">
                          Debe contener al menos 6 caracteres, una mayúscula, una minúscula y un
                          número
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <div className="relative">
                          <LockKeyhole className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPasswordConfirm ? 'text' : 'password'}
                                className="pr-10 pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-full px-3"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                              >
                                {showPasswordConfirm ? (
                                  <EyeOff className="text-muted-foreground h-4 w-4" />
                                ) : (
                                  <Eye className="text-muted-foreground h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

      case TokenStatus.RESET_SUCCESS:
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
              <p className="text-muted-foreground">
                Ahora puedes iniciar sesión con tu nueva contraseña
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/auth/login">
                <Button>Ir a iniciar sesión</Button>
              </Link>
            </CardFooter>
          </Card>
        );

      case TokenStatus.RESET_ERROR:
        return (
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-destructive text-center text-2xl font-bold">
                Error al restablecer contraseña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMessage || 'Ocurrió un error al intentar restablecer tu contraseña.'}
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/auth/reset-password">
                <Button>Intentar nuevamente</Button>
              </Link>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {renderContent()}
      </motion.div>
    </main>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, IdCard, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { loginSchema, type LoginInput } from '../../lib/validation';
import { useLogin } from '../../hooks/use-login';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      document: '',
      password: '',
    },
  });

  // Check if it's an authentication error or network error
  const isAuthError = useMemo(() => {
    if (error instanceof AxiosError) {
      return error.response?.status === 401;
    }
    return false;
  }, [error]);

  const isNetworkError = useMemo(() => {
    if (!error) return false;
    if (error instanceof AxiosError) {
      return error.message === 'Network Error' || !error.response;
    }
    return false;
  }, [error]);

  // Show error message and auto-hide after 5 seconds
  useEffect(() => {
    if (isAuthError || isNetworkError) {
      setShowErrorMessage(true);
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowErrorMessage(false);
    }
  }, [isAuthError, isNetworkError]);

  const onSubmit = (data: LoginInput) => {
    setShowErrorMessage(false); // Hide error message on new submit
    login(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-none shadow-none dark:bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none bg-transparent shadow-none dark:bg-transparent">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Bienvenido
              </CardTitle>
              <CardDescription className="text-center text-base text-gray-500 dark:text-gray-400">
                Ingresa tus credenciales para acceder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label
                    htmlFor="document"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Documento
                  </Label>
                  <div className="group relative">
                    <div className="group-focus-within:text-primary absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors">
                      <IdCard className="h-5 w-5" />
                    </div>
                    <Input
                      id="document"
                      type="text"
                      placeholder="Ingresa tu documento"
                      {...form.register('document')}
                      className="focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/30 h-11 border-gray-200 bg-gray-50 pl-10 text-base transition-all focus:bg-white focus:ring-2 dark:border-gray-800 dark:bg-gray-900/50 dark:focus:bg-gray-900"
                      aria-invalid={!!form.formState.errors.document}
                    />
                  </div>
                  {form.formState.errors.document && (
                    <p className="animate-pulse text-sm font-medium text-red-500">
                      {form.formState.errors.document.message}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Contraseña
                  </Label>
                  <div className="group relative">
                    <div className="group-focus-within:text-primary absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      {...form.register('password')}
                      className="focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/30 h-11 border-gray-200 bg-gray-50 pl-10 text-base transition-all focus:bg-white focus:ring-2 dark:border-gray-800 dark:bg-gray-900/50 dark:focus:bg-gray-900"
                      aria-invalid={!!form.formState.errors.password}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 h-9 w-9 -translate-y-1/2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="animate-pulse text-sm font-medium text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </motion.div>

                {/* Error message for authentication failure or network error */}
                <AnimatePresence mode="wait">
                  {showErrorMessage && (isAuthError || isNetworkError) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                          {isAuthError
                            ? 'Credenciales incorrectas. Por favor, verifica tu documento y contraseña.'
                            : 'Error de conexión. Verifica tu internet o contacta a soporte.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="bg-primary shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 dark:shadow-primary/10 h-11 w-full text-base font-semibold text-white shadow-lg transition-all"
                    disabled={isPending || !form.formState.isValid}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2 text-center text-sm">
              <Link
                href="/auth/reset-password"
                className="text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </Card>
    </div>
  );
}

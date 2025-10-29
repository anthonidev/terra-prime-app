"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, IdCard, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema, type LoginInput } from "../lib/validation";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      document: "",
      password: "",
    },
  });

  // Check if it's an authentication error or network error
  const isAuthError = (error as any)?.response?.status === 401;
  const isNetworkError =
    error &&
    ((error as any)?.message === "Network Error" || !(error as any)?.response);

  // Show error message and auto-hide after 5 seconds
  useEffect(() => {
    if (isAuthError || isNetworkError) {
      setShowErrorMessage(true);
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
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
    <div className="flex flex-col gap-5">
      <Card className="border-none shadow-none dark:bg-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none bg-transparent shadow-none dark:bg-none">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center text-2xl font-bold">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="document">Documento</Label>
                  <div className="relative">
                    <IdCard className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="document"
                      type="text"
                      placeholder="Ingresa tu documento"
                      {...form.register("document")}
                      className="focus:bg-background bg-white pl-10 transition-all dark:bg-gray-900"
                      aria-invalid={!!form.formState.errors.document}
                    />
                  </div>
                  {form.formState.errors.document && (
                    <p className="text-sm text-red-500">
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
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="bg-background relative">
                    <KeyRound className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      {...form.register("password")}
                      className="focus:bg-background bg-white pl-10 transition-all dark:bg-gray-900"
                      aria-invalid={!!form.formState.errors.password}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 h-10 w-10 -translate-y-1/2 rounded-full p-0"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="text-muted-foreground h-5 w-5" />
                      ) : (
                        <Eye className="text-muted-foreground h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </motion.div>

                {/* Error message for authentication failure or network error */}
                <AnimatePresence mode="wait">
                  {showErrorMessage && (isAuthError || isNetworkError) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
                        <p className="text-center text-sm font-medium text-red-600 dark:text-red-400">
                          {isAuthError
                            ? "Documento o contraseña incorrecta"
                            : "No se pudo conectar con el servidor. Verifica la URL de la API."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || !form.formState.isValid}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="text-center text-sm">
              <div className="w-full">
                ¿Olvidaste tu contraseña?{" "}
                <Link
                  href="/auth/reset-password"
                  className="text-primary hover:underline"
                >
                  Recuperar contraseña
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </Card>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, KeyRound, Mail, AlertCircle, EyeOff, Eye } from 'lucide-react';
import Image from 'next/image';
import ThemeSwitch from '@/components/common/ThemeSwich';

interface FormData {
  email: string;
  password: string;
}
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: 'ana.ortiz@inmobiliariahuertas.com',
    password: 'Huertas2025'
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });
      if (result?.error) {
        setError('Credenciales inválidas');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Ocurrió un error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="animate-fade flex min-h-screen flex-col">
      <div className="bg-alternative flex flex-1 flex-col">
        <div className="flex flex-1">
          <aside className="z-10 hidden flex-1 flex-shrink basis-1/4 flex-col items-center justify-center bg-cover bg-no-repeat xl:flex">
            <Image
              src="/nature_bg.jpeg"
              alt="Background image"
              className="h-full w-full object-cover"
              width={1920}
              height={1080}
              loading="lazy"
            />
          </aside>
          <div className="flex flex-1 flex-shrink-0 flex-col items-center pt-4">
            <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
              <div className="flex flex-col gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-none bg-transparent shadow-none">
                    <CardHeader className="space-y-1 pb-6">
                      <CardTitle className="text-center text-2xl font-bold">
                        Iniciar Sesión
                      </CardTitle>
                      <CardDescription className="text-center">
                        Ingresa tus credenciales para acceder al sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Label htmlFor="email">Correo Electrónico</Label>
                          <div className="relative">
                            <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="correo@ejemplo.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="bg-background/50 focus:bg-background pl-10 transition-all"
                            />
                          </div>
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
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={handleChange}
                              required
                              className="bg-background/50 focus:bg-background pl-10 transition-all"
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
                        </motion.div>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                            className="mx-auto w-full max-w-sm"
                          >
                            <Alert
                              variant="destructive"
                              role="alert"
                              className="flex items-center gap-3 rounded-md border border-red-500/50 bg-red-50 px-3 py-1 text-red-700 shadow-md dark:bg-red-900/40 dark:text-red-300"
                            >
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 dark:bg-red-500/30">
                                <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                              </div>
                              <div className="text-md flex-1">
                                <AlertDescription className="text-xs text-red-600/80 dark:text-red-400/80">
                                  {error}
                                </AlertDescription>
                              </div>
                            </Alert>
                          </motion.div>
                        )}
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !formData.email || !formData.password}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cargando...
                              </>
                            ) : (
                              'Iniciar Sesión'
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </CardContent>
                    <CardFooter className="text-center">
                      <p className="text-muted-foreground w-full text-sm">
                        ¿Olvidaste tu contraseña? Por favor, ponte en contacto con el administrador
                        del sistema para asistencia.
                      </p>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </div>
            <div className="z-10 mx-auto my-8">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

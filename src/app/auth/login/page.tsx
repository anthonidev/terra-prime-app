'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    email: '',
    password: ''
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
    <div className="flex flex-col gap-5">
      <Card className="border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center text-2xl font-bold">Iniciar Sesión</CardTitle>
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
            <CardFooter className="text-center text-sm">
              <div className="w-full">
                ¿Olvidaste tu contraseña?{' '}
                <Link href="/auth/reset-password" className="text-primary hover:underline">
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

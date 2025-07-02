'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Loader2, Shield } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { ChangePasswordFormData, changePasswordSchema } from '../validations/profile';

export function ChangePasswordForm() {
  const { changePassword, isChangingPassword } = useProfile();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const success = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });

    if (success) {
      form.reset();
    }
  };

  const watchedNewPassword = form.watch('newPassword');

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: '', color: '' };

    let score = 0;
    if (password.length >= 6) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;

    const levels = [
      { text: 'Muy débil', color: 'text-red-500' },
      { text: 'Débil', color: 'text-orange-500' },
      { text: 'Regular', color: 'text-yellow-500' },
      { text: 'Buena', color: 'text-blue-500' },
      { text: 'Fuerte', color: 'text-green-500' }
    ];

    return { score, ...levels[Math.min(score, 4)] };
  };

  const passwordStrength = getPasswordStrength(watchedNewPassword);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Tu contraseña debe tener al menos 6 caracteres e incluir una mayúscula, una minúscula y
            un número.
          </AlertDescription>
        </Alert>

        {/* Current Password */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña Actual</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña actual"
                    className="pr-10 pl-10"
                    {...field}
                    disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={isChangingPassword}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu nueva contraseña"
                    className="pr-10 pl-10"
                    {...field}
                    disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isChangingPassword}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              {watchedNewPassword && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-6 rounded-full ${
                          i < passwordStrength.score
                            ? passwordStrength.color.includes('red')
                              ? 'bg-red-500'
                              : passwordStrength.color.includes('orange')
                                ? 'bg-orange-500'
                                : passwordStrength.color.includes('yellow')
                                  ? 'bg-yellow-500'
                                  : passwordStrength.color.includes('blue')
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={passwordStrength.color}>{passwordStrength.text}</span>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nueva Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu nueva contraseña"
                    className="pr-10 pl-10"
                    {...field}
                    disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isChangingPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isChangingPassword || !form.formState.isValid}
          className="w-full"
        >
          {isChangingPassword ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cambiando contraseña...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Cambiar Contraseña
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

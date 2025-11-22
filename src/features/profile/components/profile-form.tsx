'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Save, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { updateProfileSchema } from '../lib/validation';
import { useUpdateProfile } from '../hooks/use-update-profile';
import type { ProfileUser } from '../types';

interface ProfileFormProps {
  user: ProfileUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { mutate, isPending } = useUpdateProfile();

  const form = useForm<{ email: string; firstName: string; lastName: string }>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const onSubmit = (values: { email: string; firstName: string; lastName: string }) => {
    mutate(values, {
      onSuccess: () => {
        form.reset(values);
      },
    });
  };

  const isDirty = form.formState.isDirty;

  return (
    <Card className="bg-card/50 h-full border shadow-sm backdrop-blur-sm">
      <CardHeader className="px-6 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <UserRound className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight">Información Personal</CardTitle>
            <p className="text-muted-foreground text-sm">Actualiza tus datos básicos</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Correo Electrónico</FormLabel>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <FormControl>
                      <Input
                        placeholder="correo@ejemplo.com"
                        className="bg-background/50 border-input/50 focus:bg-background h-11 pl-10 text-base transition-all"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid for First and Last Name */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu nombre"
                        className="bg-background/50 border-input/50 focus:bg-background h-11 text-base transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu apellido"
                        className="bg-background/50 border-input/50 focus:bg-background h-11 text-base transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                size="lg"
                className="min-w-[140px] font-semibold shadow-md transition-all hover:shadow-lg"
                disabled={isPending || !isDirty}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

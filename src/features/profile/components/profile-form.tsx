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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded">
            <UserRound className="text-accent h-4 w-4" />
          </div>
          <CardTitle className="text-base">Información Personal</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Correo Electrónico</FormLabel>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
                    <FormControl>
                      <Input
                        placeholder="correo@ejemplo.com"
                        className="h-9 pl-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Grid for First and Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu apellido" className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" size="sm" className="w-full" disabled={isPending || !isDirty}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-3.5 w-3.5" />
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

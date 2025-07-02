'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
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
import { Loader2, Save, User, Mail, FileText } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { ProfileUser } from '@/types/profile/profile.types';
import { UpdateProfileFormData, updateProfileSchema } from '../validations/profile';

interface ProfileFormProps {
  user: ProfileUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateProfile, isUpdating } = useProfile();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    await updateProfile(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* User Info Display */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Información Actual</h3>
            <Badge variant="secondary" className="gap-1">
              <User className="h-3 w-3" />
              {user.role.name}
            </Badge>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">Documento:</span>
              <span className="font-mono">{user.document}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">Nombre completo:</span>
              <span>{user.fullName}</span>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu nombre" {...field} disabled={isUpdating} />
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
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu apellido" {...field} disabled={isUpdating} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="pl-10"
                    {...field}
                    disabled={isUpdating}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isUpdating || !form.formState.isDirty}
          className="w-full sm:w-auto"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

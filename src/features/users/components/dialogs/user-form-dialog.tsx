'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, User as UserIcon } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { FormDialog } from '@/shared/components/form-dialog';

import { useRoles } from '../../hooks/use-roles';
import { useCreateUser } from '../../hooks/use-create-user';
import { useUpdateUser } from '../../hooks/use-update-user';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '../../lib/validation';
import type { User } from '../../types';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEditing = !!user;
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues:
      isEditing && user
        ? {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.role.id,
            isActive: user.isActive,
          }
        : {
            email: '',
            password: '',
            document: '',
            firstName: '',
            lastName: '',
            roleId: undefined,
          },
  });

  // Reset form cuando cambia el user o se abre/cierra
  useEffect(() => {
    if (open) {
      if (isEditing && user) {
        form.reset({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.role.id,
          isActive: user.isActive,
        });
      } else {
        form.reset({
          email: '',
          password: '',
          document: '',
          firstName: '',
          lastName: '',
          roleId: undefined,
        });
      }
    }
  }, [open, user, isEditing, form]);

  const onSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (isEditing && user) {
      const updateData = data as UpdateUserFormData;

      // Construir el payload solo con los campos que tienen valor
      const payload: any = {};

      if (updateData.email !== undefined) payload.email = updateData.email;
      if (updateData.firstName !== undefined) payload.firstName = updateData.firstName;
      if (updateData.lastName !== undefined) payload.lastName = updateData.lastName;
      if (updateData.roleId !== undefined) payload.roleId = updateData.roleId;

      // Siempre incluir isActive como string "true" o "false"
      const isActiveValue = updateData.isActive !== undefined ? updateData.isActive : user.isActive;
      payload.isActive = String(isActiveValue);

      updateUser(
        { id: user.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );
    } else {
      createUser(data as CreateUserFormData, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar usuario' : 'Crear nuevo usuario'}
      description={
        isEditing
          ? 'Actualiza la información del usuario'
          : 'Completa el formulario para crear un nuevo usuario'
      }
      isEditing={isEditing}
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      maxWidth="md"
    >
      <Form {...form}>
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                <Mail className="h-3.5 w-3.5" />
                Correo electrónico
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  className="focus-visible:ring-primary/30 h-9 transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campos solo para creación */}
        {!isEditing && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                    <Lock className="h-3.5 w-3.5" />
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="focus-visible:ring-primary/30 h-9 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                    <UserIcon className="h-3.5 w-3.5" />
                    Documento
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12345678"
                      className="focus-visible:ring-primary/30 h-9 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground text-sm font-medium">Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Juan"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
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
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground text-sm font-medium">Apellido</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pérez"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rol */}
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground text-sm font-medium">Rol</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={rolesLoading}
              >
                <FormControl>
                  <SelectTrigger className="focus:ring-primary/30 h-9 transition-all">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rolesData?.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado del usuario - solo en edición */}
        {isEditing && (
          <>
            <Separator className="my-1" />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="bg-muted/30 border-border/50 hover:bg-muted/40 flex flex-row items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm transition-colors">
                  <div className="space-y-0.5">
                    <FormLabel className="text-foreground text-sm font-medium">
                      Estado del usuario
                    </FormLabel>
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      {field.value ? (
                        <>
                          <div className="bg-success h-1.5 w-1.5 rounded-full" />
                          <span>Usuario activo</span>
                        </>
                      ) : (
                        <>
                          <div className="bg-destructive h-1.5 w-1.5 rounded-full" />
                          <span>Acceso deshabilitado</span>
                        </>
                      )}
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}
      </Form>
    </FormDialog>
  );
}

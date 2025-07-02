'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Activity, Mail, ShieldCheck, User } from 'lucide-react';
import { UpdateUserFormData, updateUserSchema } from '@/lib/validations/user';
import FormInputField from '@components/common/form/FormInputField';
import FormSelectField from '@components/common/form/FormSelectField';
import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/infrastructure/server-actions/user.actions';
import { UserList } from '@domain/entities/user';

interface Props {
  user: UserList;
  roleOptions: { value: string; label: string }[];
  onClose: () => void;
}

export default function UpdateUserForm({ user, roleOptions, onClose }: Props) {
  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive.toString(),
      roleId: user.role.id.toString()
    }
  });

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUser(user.id, { ...data, roleId: Number(data.roleId) });
      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const formFields = [
    {
      name: 'firstName',
      label: 'Nombre',
      placeholder: 'Nombre',
      icon: <User />
    },
    {
      name: 'lastName',
      label: 'Apellido',
      placeholder: 'Apellido',
      icon: <User />
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'correo@ejemplo.com',
      type: 'email',
      icon: <Mail />
    }
  ] as const;

  const statusOptions = [
    { value: 'true', label: 'Activo' },
    { value: 'false', label: 'Inactivo' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {formFields.map((field) => (
              <FormInputField<UpdateUserFormData>
                key={field.name}
                {...field}
                control={form.control}
                errors={form.formState.errors}
              />
            ))}
            <FormSelectField<UpdateUserFormData>
              name="isActive"
              label="Estado"
              placeholder="Seleccionar estado"
              icon={<Activity />}
              options={statusOptions}
              control={form.control}
              errors={form.formState.errors}
            />
            <FormSelectField<UpdateUserFormData>
              name="roleId"
              label="Rol"
              icon={<ShieldCheck />}
              options={roleOptions}
              control={form.control}
              errors={form.formState.errors}
              placeholder="role"
            />
          </div>
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            className="border-input hover:bg-accent"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="text-primary-foreground bg-green-600 transition-colors hover:bg-green-500"
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FileText, KeyRound, Mail, ShieldCheck, User } from 'lucide-react';
import { CreateUserFormData, createUserSchema } from '@/lib/validations/user';
import FormInputField from '@components/common/form/FormInputField';
import FormSelectField from '@components/common/form/FormSelectField';
import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createUser } from '../../action';

interface CreateUserFormProps {
  roleOptions: { value: string; label: string }[];
  onClose: () => void;
}

export default function CreateUserForm({ roleOptions, onClose }: CreateUserFormProps) {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      document: '',
      firstName: '',
      lastName: '',
      isActive: 'true'
    }
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUser(data);
      form.reset();
      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error('Error al crear el usuario');
    }
  };

  const formFields = [
    { name: 'firstName', label: 'Nombre', placeholder: 'Nombre', icon: <User /> },
    { name: 'lastName', label: 'Apellido', placeholder: 'Apellido', icon: <User /> },
    { name: 'document', label: 'Documento', placeholder: 'Documento', icon: <FileText /> },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'correo@ejemplo.com',
      type: 'email',
      icon: <Mail />
    },
    {
      name: 'password',
      label: 'Contraseña',
      placeholder: '••••••',
      type: 'password',
      icon: <KeyRound />
    }
  ] as const;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 px-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {formFields.map((field) => (
              <FormInputField<CreateUserFormData>
                key={field.name}
                {...field}
                control={form.control}
                errors={form.formState.errors}
              />
            ))}
            <FormSelectField<CreateUserFormData>
              name="roleId"
              label="Rol"
              placeholder="Seleccionar rol"
              icon={<ShieldCheck />}
              options={roleOptions}
              control={form.control}
              errors={form.formState.errors}
            />
          </div>
        </div>
        <DialogFooter className="mt-4 gap-3 pt-4">
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
          >
            {form.formState.isSubmitting ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

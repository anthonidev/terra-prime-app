import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  roleId: z.number({ message: 'Debe seleccionar un rol' }).positive(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Correo electrónico inválido').optional(),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .optional(),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .optional(),
  roleId: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

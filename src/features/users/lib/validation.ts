import { z } from 'zod';

// Regex para validar contraseña: al menos una mayúscula, una minúscula, un número y mínimo 6 caracteres
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/;

export const createUserSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      passwordRegex,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  roleId: z.number({ message: 'Debe seleccionar un rol' }).positive(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Correo electrónico inválido').optional(),
  password: z
    .string()
    .refine(
      (val) => {
        // Si está vacío, es válido (opcional)
        if (!val || val.trim() === '') return true;
        // Si tiene contenido, debe cumplir con la regex y tener al menos 6 caracteres
        return val.length >= 6 && passwordRegex.test(val);
      },
      {
        message:
          'La contraseña debe tener al menos 6 caracteres y contener al menos una mayúscula, una minúscula y un número',
      }
    )
    .optional()
    .or(z.literal('')),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  roleId: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

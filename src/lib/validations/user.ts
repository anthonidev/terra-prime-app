import * as z from 'zod';

export const createUserSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  document: z
    .string()
    .min(8, 'El documento debe tener al menos 8 caracteres')
    .max(20, 'El documento no puede tener más de 20 caracteres')
    .regex(/^[0-9]+$/, 'El documento solo debe contener números'),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]{2,}$/, 'El nombre solo debe contener letras y espacios'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]{2,}$/, 'El apellido solo debe contener letras y espacios'),
  roleId: z.string({ required_error: 'El rol es requerido' }).transform((val) => Number(val)),
  isActive: z.string().default('true')
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingrese un correo válido'),
  isActive: z.string(),
  roleId: z.string().min(1, 'Debe seleccionar un rol')
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

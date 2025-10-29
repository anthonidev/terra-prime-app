import { z } from 'zod';

export const updateProfileSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('El correo debe tener un formato válido'),
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'La contraseña actual es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    newPassword: z
      .string()
      .min(1, 'La nueva contraseña es requerida')
      .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/, {
        message:
          'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      }),
    confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword'],
  });

export const photoFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'La imagen no debe superar los 2MB',
    })
    .refine(
      (file) =>
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.type
        ),
      {
        message: 'Solo se permiten imágenes en formato JPEG, JPG, PNG o WEBP',
      }
    ),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

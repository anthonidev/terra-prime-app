import * as z from 'zod';

export const updateProfileSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El email debe tener un formato válido')
    .transform((val) => val.toLowerCase().trim()),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]{2,}$/, 'El nombre solo debe contener letras y espacios')
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]{2,}$/, 'El apellido solo debe contener letras y espacios')
    .transform((val) => val.trim())
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export const photoUploadSchema = z.object({
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 3 * 1024 * 1024, 'La imagen no puede superar los 3MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Solo se permiten archivos JPG, PNG o WEBP'
    )
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type PhotoUploadFormData = z.infer<typeof photoUploadSchema>;

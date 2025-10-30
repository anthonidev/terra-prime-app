import { z } from 'zod';

export const loginSchema = z.object({
  document: z
    .string()
    .min(1, 'El documento es requerido')
    .min(8, 'El documento debe tener al menos 8 caracteres'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('El correo debe tener un formato válido'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/, {
        message:
          'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      }),
    passwordConfirm: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  });

// Infer types from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

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

// Infer types from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

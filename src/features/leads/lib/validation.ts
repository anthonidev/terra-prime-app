import { z } from 'zod';

export const leadSourceSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  isActive: z.boolean(),
});

export const updateLeadSourceSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }).optional(),
  isActive: z.boolean().optional(),
});

export const updateLeadSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }).optional(),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }).optional(),
  document: z.string().min(8, { message: 'El documento debe tener al menos 8 caracteres' }).optional(),
  documentType: z.enum(['DNI', 'CE', 'PASSPORT', 'RUC']).optional(),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().min(9, { message: 'El teléfono debe tener al menos 9 caracteres' }).optional().or(z.literal('')),
  phone2: z.string().min(9, { message: 'El teléfono debe tener al menos 9 caracteres' }).optional().or(z.literal('')),
  age: z.number().int().positive({ message: 'La edad debe ser un número positivo' }).optional(),
  observations: z.string().optional(),
});

export type LeadSourceFormData = z.infer<typeof leadSourceSchema>;
export type UpdateLeadSourceFormData = z.infer<typeof updateLeadSourceSchema>;
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;

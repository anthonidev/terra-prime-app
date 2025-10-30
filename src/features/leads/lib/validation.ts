import { z } from 'zod';

export const leadSourceSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  isActive: z.boolean(),
});

export const updateLeadSourceSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }).optional(),
  isActive: z.boolean().optional(),
});

export type LeadSourceFormData = z.infer<typeof leadSourceSchema>;
export type UpdateLeadSourceFormData = z.infer<typeof updateLeadSourceSchema>;

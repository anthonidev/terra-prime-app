import { z } from 'zod';

// Project
export const updateProjectSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  isActive: z.boolean().optional(),
});

// Stage
export const stageSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  isActive: z.boolean().optional(),
});

// Block
export const blockSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  isActive: z.boolean().optional(),
});

// Lot
export const lotSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  area: z.number({ message: 'El área es requerida' }).positive('El área debe ser mayor a 0'),
  lotPrice: z.number({ message: 'El precio del lote es requerido' }).min(0),
  urbanizationPrice: z.number({ message: 'El precio de urbanización es requerido' }).min(0),
});

export const updateLotSchema = lotSchema
  .extend({
    status: z.enum(['Activo', 'Inactivo', 'Vendido', 'Separado']).optional(),
  })
  .partial();

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
export type StageFormData = z.infer<typeof stageSchema>;
export type BlockFormData = z.infer<typeof blockSchema>;
export type LotFormData = z.infer<typeof lotSchema>;
export type UpdateLotFormData = z.infer<typeof updateLotSchema>;

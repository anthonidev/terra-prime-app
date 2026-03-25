import { z } from 'zod';

export const parkingSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  area: z.number({ message: 'El área es requerida' }).positive('El área debe ser mayor a 0'),
  price: z.number({ message: 'El precio es requerido' }).min(0, 'El precio no puede ser negativo'),
});

export const updateParkingSchema = parkingSchema
  .extend({
    status: z.enum(['Activo', 'Inactivo', 'Vendido', 'Separado']).optional(),
  })
  .partial();

export type ParkingFormData = z.infer<typeof parkingSchema>;
export type UpdateParkingFormData = z.infer<typeof updateParkingSchema>;

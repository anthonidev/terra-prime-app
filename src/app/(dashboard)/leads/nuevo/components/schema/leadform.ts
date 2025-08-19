import { DocumentType, EstadoCivil } from '@/types/leads.types';
import { z } from 'zod';

export const leadFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El nombre solo debe contener letras y espacios'
    }),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El apellido solo debe contener letras y espacios'
    }),
  document: z
    .string()
    .min(1, 'El documento es requerido')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
  documentType: z.nativeEnum(DocumentType, {
    required_error: 'El tipo de documento es requerido'
  }),
  email: z.string().email('El email debe tener un formato válido').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  phone2: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono alternativo debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  // CAMBIO IMPORTANTE: Cambiar la transformación de age para manejar strings y números
  age: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const numVal = typeof val === 'string' ? Number(val) : val;
      return isNaN(numVal) ? undefined : numVal;
    })
    .refine((val) => !val || (val >= 18 && val <= 120), {
      message: 'La edad debe estar entre 18 y 120 años'
    }),
  sourceId: z.string().optional().or(z.literal('')),
  departmentId: z.string().optional().or(z.literal('')),
  provinceId: z.string().optional().or(z.literal('')),
  // CAMBIO IMPORTANTE: Cambiar ubigeoId para manejar strings y números
  ubigeoId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const numVal = typeof val === 'string' ? Number(val) : val;
      return isNaN(numVal) ? undefined : numVal;
    }),
  observations: z
    .string()
    .max(500, 'Las observaciones no pueden tener más de 500 caracteres')
    .optional()
    .or(z.literal('')),
  // Nuevos campos de acompañante
  companionFullName: z
    .string()
    .max(200, 'El nombre del acompañante no puede tener más de 200 caracteres')
    .optional()
    .or(z.literal('')),
  companionDni: z
    .string()
    .max(20, 'El DNI del acompañante no puede tener más de 20 caracteres')
    .optional()
    .or(z.literal('')),
  companionRelationship: z
    .string()
    .max(100, 'La relación no puede tener más de 100 caracteres')
    .optional()
    .or(z.literal('')),
  // Proyectos de interés
  interestProjects: z
    .array(z.string())
    .optional()
    .default([]),
  // Campos de metadata
  estadoCivil: z.nativeEnum(EstadoCivil).optional(),
  tieneTarjetasCredito: z.boolean().optional().default(false),
  cantidadTarjetasCredito: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return 0;
      const numVal = typeof val === 'string' ? Number(val) : val;
      return isNaN(numVal) ? 0 : numVal;
    })
    .refine((val) => val >= 0 && val <= 50, {
      message: 'La cantidad debe estar entre 0 y 50'
    }),
  tieneTarjetasDebito: z.boolean().optional().default(false),
  cantidadTarjetasDebito: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return 0;
      const numVal = typeof val === 'string' ? Number(val) : val;
      return isNaN(numVal) ? 0 : numVal;
    })
    .refine((val) => val >= 0 && val <= 50, {
      message: 'La cantidad debe estar entre 0 y 50'
    }),
  cantidadHijos: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return 0;
      const numVal = typeof val === 'string' ? Number(val) : val;
      return isNaN(numVal) ? 0 : numVal;
    })
    .refine((val) => val >= 0 && val <= 20, {
      message: 'La cantidad de hijos debe estar entre 0 y 20'
    })
});
export type LeadFormValues = z.infer<typeof leadFormSchema>;

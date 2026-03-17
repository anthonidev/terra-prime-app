import { z } from 'zod';
import { VariableType } from '../types';

export const customVariableSchema = z
  .object({
    key: z
      .string()
      .min(1, 'La clave es requerida')
      .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Solo letras, números y guion bajo'),
    label: z.string().min(1, 'La etiqueta es requerida'),
    type: z.nativeEnum(VariableType),
    defaultValue: z.string().optional(),
    options: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === VariableType.SELECT) {
        return data.options && data.options.length > 0;
      }
      return true;
    },
    { message: 'Las opciones son requeridas para el tipo SELECT', path: ['options'] }
  );

export const createTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').default(''),
  projectId: z.string().uuid('Seleccione un proyecto válido'),
});

export const templateFormSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').default(''),
  projectId: z.string().uuid('Seleccione un proyecto válido'),
  content: z.string().min(1, 'El contenido es requerido'),
  customVariables: z.array(customVariableSchema).default([]),
});

export type CreateTemplateFormValues = z.input<typeof createTemplateSchema>;
export type TemplateFormValues = z.input<typeof templateFormSchema>;
export type CustomVariableFormValues = z.input<typeof customVariableSchema>;

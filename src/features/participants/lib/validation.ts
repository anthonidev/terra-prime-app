import { z } from 'zod';
import { ParticipantType, DocumentType } from '../types';

export const createParticipantSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  documentType: z.nativeEnum(DocumentType, {
    message: 'Debe seleccionar un tipo de documento',
  }),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  participantType: z.nativeEnum(ParticipantType, {
    message: 'Debe seleccionar un tipo de participante',
  }),
});

export const updateParticipantSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres').optional(),
  documentType: z.nativeEnum(DocumentType).optional(),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 caracteres').optional(),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres').optional(),
  participantType: z.nativeEnum(ParticipantType).optional(),
  isActive: z.boolean().optional(),
});

export type CreateParticipantFormData = z.infer<typeof createParticipantSchema>;
export type UpdateParticipantFormData = z.infer<typeof updateParticipantSchema>;

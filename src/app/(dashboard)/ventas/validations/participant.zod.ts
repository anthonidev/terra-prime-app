import * as z from 'zod';

export const ParticipantSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  documentType: z.enum(['DNI', 'CE', 'RUC'], {
    errorMap: () => ({ message: 'Tipo de documento inválido' })
  }),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  participantType: z.enum(
    [
      'LINER',
      'TELEMARKETING_SUPERVISOR',
      'TELEMARKETING_CONFIRMER',
      'TELEMARKETER',
      'FIELD_MANAGER',
      'FIELD_SUPERVISOR',
      'FIELD_SELLER',
      'SALES_MANAGER',
      'SALES_GENERAL_MANAGER',
      'POST_SALE',
      'CLOSER'
    ],
    {
      errorMap: () => ({ message: 'Tipo de participante inválido' })
    }
  )
});
export const UpdateParticipantSchema = ParticipantSchema.partial();

export type ParticipantType = z.infer<typeof ParticipantSchema>;
export type UpdateParticipantType = z.infer<typeof UpdateParticipantSchema>;

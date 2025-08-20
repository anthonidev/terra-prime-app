'use server';

import { revalidateTag } from 'next/cache';
import { httpClient } from '@/lib/api/http-client';

export async function assignParticipantToLead(
  leadId: string,
  assignmentData: {
    linerId?: string;
    telemarketingSupervisorId?: string;
    telemarketingConfirmerId?: string;
    telemarketerId?: string;
    fieldManagerId?: string;
    fieldSupervisorId?: string;
    fieldSellerId?: string;
    guarantorId?: string;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    await httpClient(`/api/leads/assign/participants/${leadId}`, {
      method: 'POST',
      body: assignmentData,
      cache: 'no-store'
    });

    revalidateTag('leads-of-day');
    
    return {
      success: true,
      message: 'Participante asignado exitosamente'
    };
  } catch (error) {
    console.error('Error assigning participant to lead:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al asignar participante al lead'
    };
  }
}
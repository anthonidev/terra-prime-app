import { ParticipantRepository } from '@domain/repositories/participant.repository';
import { Participant } from '@domain/entities/sales/participant.entity';
import { CreateParticipantDTO, UpdateParticipantDTO } from '@application/dtos/participant.dto';
import { httpClient } from '@/lib/api/http-client';
import { SalesListResponse } from '../types/sales/api-response.types';

export class HttpParticipantRepository implements ParticipantRepository {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Participant[]> {
    try {
      const response = await httpClient<Participant[]>('/api/participants', {
        params,
        next: { revalidate: 0 }
      });

      return response.map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        document: item.document,
        documentType: item.documentType,
        phone: item.phone,
        address: item.address,
        participantType: item.participantType,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('No se pudieron cargar los participantes. Intente nuevamente.');
    }
  }

  async getById(id: string): Promise<Participant> {
    try {
      const response = await httpClient<Participant>(`/api/participants/${id}`);

      return {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        document: response.document,
        documentType: response.documentType,
        phone: response.phone,
        address: response.address,
        participantType: response.participantType,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('No se pudo cargar el participante. Verifique que existe.');
    }
  }

  async create(data: CreateParticipantDTO): Promise<Participant> {
    try {
      const response = await httpClient<Participant>('/api/participants', {
        method: 'POST',
        body: data
      });

      return {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        document: response.document,
        documentType: response.documentType,
        phone: response.phone,
        address: response.address,
        participantType: response.participantType,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('No se pudo crear el participante. Verifique los datos e intente nuevamente.');
    }
  }

  async update(id: string, data: UpdateParticipantDTO): Promise<Participant> {
    try {
      const response = await httpClient<Participant>(`/api/participants/${id}`, {
        method: 'PATCH',
        body: data
      });

      return new Participant(
        response.id,
        response.firstName,
        response.lastName,
        response.email,
        response.document,
        response.documentType,
        response.phone,
        response.address,
        response.participantType,
        response.createdAt,
        response.updatedAt
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('No se pudo actualizar el participante. Intente nuevamente.');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await httpClient(`/api/participants/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('No se pudo eliminar el participante. Intente nuevamente.');
    }
  }

  async getActives(type: string): Promise<Participant[]> {
    try {
      const response = await httpClient<Participant[]>('/api/participants/all/actives', {
        params: { type },
        next: { revalidate: 0 }
      });

      return response.map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        document: item.document,
        documentType: item.documentType,
        phone: item.phone,
        address: item.address,
        participantType: item.participantType,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('No se pudieron cargar los participantes activos.');
    }
  }

  async assign(
    saleId: string,
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
  ): Promise<SalesListResponse> {
    try {
      const response = await httpClient<SalesListResponse>(
        `/api/sales/assign/participants/${saleId}`,
        {
          body: assignmentData,
          method: 'POST'
        }
      );

      return {
        items: response.items,
        meta: response.meta
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('No se pudo asignar el participante a la venta.');
    }
  }
}

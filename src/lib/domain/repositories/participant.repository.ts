import { Participant } from '@domain/entities/sales/participant.entity';
import { CreateParticipantDTO, UpdateParticipantDTO } from '@application/dtos/participant.dto';

export interface ParticipantRepository {
  getAll(params?: { page?: number; limit?: number; search?: string }): Promise<Participant[]>;

  getById(id: string): Promise<Participant>;

  create(data: CreateParticipantDTO): Promise<Participant>;

  update(id: string, data: UpdateParticipantDTO): Promise<Participant>;

  delete(id: string): Promise<void>;
}

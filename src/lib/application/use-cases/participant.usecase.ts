import { ParticipantRepository } from '@domain/repositories/participant.repository';
import { Participant } from '@domain/entities/sales/participant.entity';
import { CreateParticipantDTO, UpdateParticipantDTO } from '@application/dtos/participant.dto';
import { SalesListResponse } from '@infrastructure/types/sales/api-response.types';

export class GetParticipantsUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  async execute(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Participant[]> {
    return this.repository.getAll(params);
  }
}

export class GetParticipantByIdUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  async execute(id: string): Promise<Participant> {
    return this.repository.getById(id);
  }
}

export class CreateParticipantUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  async execute(data: CreateParticipantDTO): Promise<Participant> {
    return this.repository.create(data);
  }
}

export class UpdateParticipantUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  async execute(id: string, data: UpdateParticipantDTO): Promise<Participant> {
    return this.repository.update(id, data);
  }
}

export class DeleteParticipantUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export class GetActiveParticipantsUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  async execute(type: string): Promise<Participant[]> {
    return this.repository.getActives(type);
  }
}

export class AssignParticipantToSaleUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  async execute(saleId: string, participantId: string): Promise<SalesListResponse> {
    return this.repository.assign(saleId, participantId);
  }
}

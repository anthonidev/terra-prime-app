import { ParticipantRepository } from '@domain/repositories/participant.repository';
import { Participant } from '@domain/entities/sales/participant.entity';
import { CreateParticipantDTO, UpdateParticipantDTO } from '@application/dtos/participant.dto';

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

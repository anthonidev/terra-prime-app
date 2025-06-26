'use server';

import {
  GetParticipantsUseCase,
  GetParticipantByIdUseCase,
  CreateParticipantUseCase,
  UpdateParticipantUseCase,
  DeleteParticipantUseCase
} from '@application/use-cases/participant.usecase';
import { HttpParticipantRepository } from '@infrastructure/api/http-participant.repository';
import { Participant } from '@domain/entities/sales/participant.entity';
import { CreateParticipantDTO, UpdateParticipantDTO } from '@application/dtos/participant.dto';

export async function getParticipants(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<Participant[]> {
  const repository = new HttpParticipantRepository();
  const useCase = new GetParticipantsUseCase(repository);

  return await useCase.execute(params);
}

export async function getParticipantById(id: string): Promise<Participant> {
  const repository = new HttpParticipantRepository();
  const useCase = new GetParticipantByIdUseCase(repository);

  return await useCase.execute(id);
}

export async function createParticipant(data: CreateParticipantDTO): Promise<Participant> {
  const repository = new HttpParticipantRepository();
  const useCase = new CreateParticipantUseCase(repository);

  return await useCase.execute(data);
}

export async function updateParticipant(
  id: string,
  data: UpdateParticipantDTO
): Promise<Participant> {
  const repository = new HttpParticipantRepository();
  const useCase = new UpdateParticipantUseCase(repository);

  return await useCase.execute(id, data);
}

export async function deleteParticipant(id: string): Promise<void> {
  const repository = new HttpParticipantRepository();
  const useCase = new DeleteParticipantUseCase(repository);

  return await useCase.execute(id);
}

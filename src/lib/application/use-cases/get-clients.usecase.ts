import {
  ClientGuarantorRepository,
  ClientRepository
} from '@domain/repositories/client.repository';
import { Client } from '@domain/entities/sales/client.entity';
import { CreateClientGuarantorDTO } from '@application/dtos/create-clientguarantor.dto';
import { ClientGuarantorResponse } from '@infrastructure/types/sales/api-response.types';

export class GetClientsUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute(document: number): Promise<Client> {
    return this.repository.getClientByDocument(document);
  }
}

export class CreateClientGuarantorUseCase {
  constructor(private readonly repository: ClientGuarantorRepository) {}

  async execute(data: CreateClientGuarantorDTO): Promise<ClientGuarantorResponse> {
    return this.repository.createClientGuarantor(data);
  }
}

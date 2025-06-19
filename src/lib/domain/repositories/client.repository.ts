import { ClientGuarantorResponse } from '@infrastructure/types/sales/api-response.types';
import { CreateClientGuarantorDTO } from '@application/dtos/create-clientguarantor.dto';
import { Client } from '@domain/entities/sales/client.entity';

export interface ClientRepository {
  getClientByDocument(document: number): Promise<Client>;
}

export interface ClientGuarantorRepository {
  createClientGuarantor(data: CreateClientGuarantorDTO): Promise<ClientGuarantorResponse>;
}

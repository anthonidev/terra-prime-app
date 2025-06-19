import { PinResponse } from '@infrastructure/types/pin';
import { CreatePinRepository, FindPinRepository } from '@domain/repositories/pin';

export class CreatePinUseCase {
  constructor(private readonly repository: CreatePinRepository) {}

  async execute(): Promise<PinResponse> {
    return this.repository.create();
  }
}

export class FindPinUseCase {
  constructor(private readonly repository: FindPinRepository) {}

  async execute(): Promise<PinResponse> {
    return this.repository.find();
  }
}

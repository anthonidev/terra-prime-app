'use server';

import { PinResponse } from '@infrastructure/types/pin';
import { HttpCreatePinRepository, HttpFindPinRepository } from '@infrastructure/api/pin';
import { CreatePinUseCase, FindPinUseCase } from '@application/use-cases/pin';

export async function createPin(): Promise<PinResponse> {
  const repository = new HttpCreatePinRepository();
  const useCase = new CreatePinUseCase(repository);

  const response = await useCase.execute();

  return {
    pin: response.pin,
    expiresAt: response.expiresAt
  };
}

export async function findPin(): Promise<PinResponse> {
  const repository = new HttpFindPinRepository();
  const useCase = new FindPinUseCase(repository);

  const response = await useCase.execute();

  return {
    pin: response.pin,
    expiresAt: response.expiresAt
  };
}

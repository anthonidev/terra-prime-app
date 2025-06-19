'use server';

import { PinResponse } from '@infrastructure/types/pin';
import {
  HttpCreatePinRepository,
  HttpFindPinRepository,
  HttpValidatePinRepository
} from '@infrastructure/api/pin';
import { CreatePinUseCase, FindPinUseCase, ValidatePinUseCase } from '@application/use-cases/pin';

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

export async function validatePin(params: string): Promise<boolean> {
  const repository = new HttpValidatePinRepository();
  const useCase = new ValidatePinUseCase(repository);

  return await useCase.execute(params);
}

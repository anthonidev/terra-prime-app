import {
  CreatePinRepository,
  FindPinRepository,
  ValidatePinRepository
} from '@domain/repositories/pin';
import { PinResponse } from '@infrastructure/types/pin';
import { httpClient } from '@/lib/api/http-client';

export class HttpCreatePinRepository implements CreatePinRepository {
  async create(): Promise<PinResponse> {
    try {
      const response = await httpClient<PinResponse>('/api/lots/update-price-token/create', {
        method: 'POST'
      });

      return {
        pin: response.pin,
        expiresAt: response.expiresAt
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpFindPinRepository implements FindPinRepository {
  async find(): Promise<PinResponse> {
    try {
      const response = await httpClient<PinResponse>('/api/lots/update-price-token/active');
      return {
        pin: response.pin,
        expiresAt: response.expiresAt
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpValidatePinRepository implements ValidatePinRepository {
  async validate(pin: string): Promise<boolean> {
    try {
      const response = await httpClient<boolean>(`/api/lots/update-price-token/validate/${pin}`);
      return response === true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

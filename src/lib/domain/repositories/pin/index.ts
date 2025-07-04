import { PinResponse } from '@infrastructure/types/pin';

export interface FindPinRepository {
  find(): Promise<PinResponse>;
}

export interface CreatePinRepository {
  create(): Promise<PinResponse>;
}

export interface ValidatePinRepository {
  validate(pin: string): Promise<boolean>;
}

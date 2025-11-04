export interface AdminPin {
  pin: string | null;
  expiresAt?: Date;
}

export interface CreatePinResponse {
  pin: string;
  expiresAt: Date;
}

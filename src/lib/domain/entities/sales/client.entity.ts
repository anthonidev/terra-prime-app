export class Client {
  constructor(
    public readonly id: number,
    public readonly address: string
  ) {}
}

export class ClientGuarantor {
  constructor(
    public readonly clientId: string,
    public readonly guarantorId: string
  ) {}
}

export class Lot {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly area: string,
    public readonly lotPrice: string,
    public readonly urbanizationPrice: string,
    public readonly totalPrice: number,
    public readonly status: string,
    public readonly createdAt: string
  ) {}
}

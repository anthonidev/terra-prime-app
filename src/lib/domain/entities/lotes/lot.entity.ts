import { CurrencyType } from '../sales/payment.entity';

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

export class LotProject {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly area: string,
    public readonly lotPrice: string,
    public readonly urbanizationPrice: string,
    public readonly totalPrice: number,
    public readonly status: string,
    public readonly blockId: string,
    public readonly blockName: string,
    public readonly stageId: string,
    public readonly stageName: string,
    public readonly projectId: string,
    public readonly projectName: string,
    public readonly projectCurrency: CurrencyType,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}
}

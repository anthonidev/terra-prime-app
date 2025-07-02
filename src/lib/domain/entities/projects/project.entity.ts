export class ProjectList {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly currency: string,
    public readonly isActive: boolean,
    public readonly logo: string | null,
    public readonly stageCount: number,
    public readonly blockCount: number,
    public readonly lotCount: number,
    public readonly activeLotCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export class ProjectDetail {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly currency: string,
    public readonly isActive: boolean,
    public readonly logo: string | null,
    public readonly logoPublicId: string | null,
    public readonly stages: StageDetail[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export class StageDetail {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly blocks: BlockDetail[]
  ) {}
}

export class BlockDetail {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly lotCount: number,
    public readonly activeLots: number,
    public readonly reservedLots: number,
    public readonly soldLots: number,
    public readonly inactiveLots: number,
    public readonly stageId: string
  ) {}
}

export class LotResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly area: number,
    public readonly lotPrice: number,
    public readonly urbanizationPrice: number,
    public readonly totalPrice: number,
    public readonly status: string,
    public readonly blockId: string,
    public readonly blockName: string,
    public readonly stageId: string,
    public readonly stageName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export class ExcelValidation {
  constructor(
    public readonly isValid: boolean,
    public readonly data?: ProjectExcelData,
    public readonly errors?: ValidationError[]
  ) {}
}

export class ValidationError {
  constructor(
    public readonly row: number,
    public readonly column: string,
    public readonly message: string
  ) {}
}

export class ProjectExcelData {
  constructor(
    public readonly name: string,
    public readonly currency: string,
    public readonly lots: ExcelLot[]
  ) {}
}

export class ExcelLot {
  constructor(
    public readonly stage: string,
    public readonly block: string,
    public readonly lot: string,
    public readonly area: number,
    public readonly lotPrice: number,
    public readonly urbanizationPrice: number,
    public readonly status: string
  ) {}
}

export enum LotStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  SOLD = 'Vendido',
  RESERVED = 'Separado'
}

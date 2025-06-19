import { AmortizationRepository } from '@domain/repositories/amortization.repository';
import { GetAmortizationDTO } from '@application/dtos/get-amortization.dto';
import { Amortization } from '@domain/entities/sales/amortization.entity';

export class CalculateAmortizationUseCase {
  constructor(private readonly repository: AmortizationRepository) {}

  async execute(data: GetAmortizationDTO): Promise<Amortization[]> {
    return this.repository.calculate(data);
  }
}

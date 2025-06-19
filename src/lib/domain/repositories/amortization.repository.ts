import { GetAmortizationDTO } from '@/lib/application/dtos/get-amortization.dto';
import { Amortization } from '@domain/entities/sales/amortization.entity';

export interface AmortizationRepository {
  calculate(data: GetAmortizationDTO): Promise<Amortization[]>;
}

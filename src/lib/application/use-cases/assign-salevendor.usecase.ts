import { AssignLeadsVendorRepository } from '@domain/repositories/leadsvendors.repository';
import { AssignLeadsToVendorDTO } from '@application/dtos/bienvenidos.dto';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';

export class AssignLeadsVendorUseCase {
  constructor(private readonly repository: AssignLeadsVendorRepository) {}

  async execute(dto: AssignLeadsToVendorDTO): Promise<LeadsOfDay[]> {
    return this.repository.onAssign(dto);
  }
}

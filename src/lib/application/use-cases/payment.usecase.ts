import {
  PaymentApproveRepository,
  PaymentDetailRepository,
  PaymentListRepository,
  PaymentRejectRepository,
  PaymentRepository,
  PaymentCompleteRepository,
  GenerateAcordPaymentRepository,
  RegenerateAcordPaymentRepository,
  GenerateRadicationPaymentRepository,
  RegenerateRadicationPaymentRepository
} from '@domain/repositories/payments.repository';
import { ProcessPaymentDto } from '@application/dtos/create-payment.dto';
import {
  PaymentApproveRejectResponse,
  PaymentCompletedResponse,
  PaymentListResponse,
  PaymentResponse,
  SaleReportResponse
} from '@infrastructure/types/sales/api-response.types';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { ApprovePaymentDTO } from '@application/dtos/approve-payment.dto';
import { RejectPaymentDTO } from '@application/dtos/reject-payment.dto';
import { PaymentCompleteDTO } from '@/lib/application/dtos/complete-payment.dto';

export class CreatePaymentUseCase {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(id: string, dto: ProcessPaymentDto): Promise<PaymentResponse> {
    return this.repository.createPayment(id, dto);
  }
}

export class ListPaymentsUseCase {
  constructor(private readonly repository: PaymentListRepository) {}

  async execute(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentListResponse> {
    return this.repository.listPayments(params);
  }
}

export class GetPaymentDetailUseCase {
  constructor(private readonly repository: PaymentDetailRepository) {}

  async execute(id: number): Promise<PaymentDetailItem> {
    return this.repository.getPaymentDetail(id);
  }
}

export class ApprovePaymentUseCase {
  constructor(private readonly repository: PaymentApproveRepository) {}

  async execute(id: number, dto: ApprovePaymentDTO): Promise<PaymentApproveRejectResponse> {
    return this.repository.aprovePaymentDetail(id, dto);
  }
}

export class RejectPaymentUseCase {
  constructor(private readonly repository: PaymentRejectRepository) {}

  async execute(id: number, dto: RejectPaymentDTO): Promise<PaymentApproveRejectResponse> {
    return this.repository.rejectPaymentDetail(id, dto);
  }
}

export class PaymentCompleteUseCase {
  constructor(private readonly repository: PaymentCompleteRepository) {}

  async execute(id: number, dto: PaymentCompleteDTO): Promise<PaymentCompletedResponse> {
    return this.repository.completePaymentDetail(id, dto);
  }
}

export class GenerateAcordPaymentUseCase {
  constructor(private readonly repository: GenerateAcordPaymentRepository) {}

  async execute(saleId: string): Promise<SaleReportResponse> {
    return this.repository.generateAcordPayment(saleId);
  }
}

export class RegenerateAcordPaymentUseCase {
  constructor(private readonly repository: RegenerateAcordPaymentRepository) {}

  async execute(saleId: string): Promise<SaleReportResponse> {
    return this.repository.regenerateAcordPayment(saleId);
  }
}

export class GenerateRadicationPaymentUseCase {
  constructor(private readonly repository: GenerateRadicationPaymentRepository) {}

  async execute(saleId: string): Promise<SaleReportResponse> {
    return this.repository.generateRadicationPayment(saleId);
  }
}

export class RegenerateRadicationPaymentUseCase {
  constructor(private readonly repository: RegenerateRadicationPaymentRepository) {}

  async execute(saleId: string): Promise<SaleReportResponse> {
    return this.repository.regenerateRadicationPayment(saleId);
  }
}

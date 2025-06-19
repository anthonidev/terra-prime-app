import { ProcessPaymentDto } from '@application/dtos/create-payment.dto';
import {
  PaymentApproveRejectResponse,
  PaymentCompletedResponse,
  PaymentListResponse,
  PaymentResponse
} from '@infrastructure/types/sales/api-response.types';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { ApprovePaymentDTO } from '@application/dtos/approve-payment.dto';
import { RejectPaymentDTO } from '@application/dtos/reject-payment.dto';
import { PaymentCompleteDTO } from '@application/dtos/complete-payment.dto';

export interface PaymentRepository {
  createPayment(id: string, data: ProcessPaymentDto): Promise<PaymentResponse>;
}

export interface PaymentListRepository {
  listPayments(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentListResponse>;
}

export interface PaymentDetailRepository {
  getPaymentDetail(id: number): Promise<PaymentDetailItem>;
}

export interface PaymentApproveRepository {
  aprovePaymentDetail(id: number, dto: ApprovePaymentDTO): Promise<PaymentApproveRejectResponse>;
}

export interface PaymentRejectRepository {
  rejectPaymentDetail(id: number, dto: RejectPaymentDTO): Promise<PaymentApproveRejectResponse>;
}

export interface PaymentCompleteRepository {
  completePaymentDetail(id: number, dto: PaymentCompleteDTO): Promise<PaymentCompletedResponse>;
}

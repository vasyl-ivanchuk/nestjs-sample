import { PaymentStatus } from '../enums/payment-status.enum';

export interface PaymentProcessResult {
    readonly orderId: string;
    readonly response: PaymentStatus;
}
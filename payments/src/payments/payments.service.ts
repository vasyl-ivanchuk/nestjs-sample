import { Injectable } from '@nestjs/common';
import { OrderDto } from './interfaces/order-dto.interface';
import { PaymentStatus } from './enums/payment-status.enum';
import { MessagesService } from './messages.service';

@Injectable()
export class PaymentsService {
    constructor(private readonly messagesService: MessagesService) { }

    async process(order: OrderDto): Promise<void> {
        const confirmed = Math.random() >= 0.5 ? PaymentStatus.Confirmed : PaymentStatus.Declined;
        await this.messagesService.publish('payment-processed',
            { orderId: order.id, response: confirmed });
    }
}
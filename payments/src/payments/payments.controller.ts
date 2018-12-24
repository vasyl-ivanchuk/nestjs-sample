import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { OrderDto } from './interfaces/order-dto.interface';

@Controller()
export class PaymentsController {
    constructor(private readonly paymentService: PaymentsService) { }

    @MessagePattern({ cmd: 'order-created' })
    public async processPayment(order: OrderDto): Promise<void> {
        await this.paymentService.process(order);
    }
}
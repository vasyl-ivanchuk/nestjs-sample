import { Controller, Post, Get, Param, HttpStatus, HttpException, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './interfaces/order-dto.interface';
import { Order } from './schemas/order.schema';
import { OrderStatus } from './enums/order-status.enum';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentProcessResult } from './interfaces/payment-process-result.interface';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async create(): Promise<OrderDto> {
        const createdOrder = await this.ordersService.create();
        return { id: createdOrder.id, status: createdOrder.status }
    }

    @Get(':id/status')
    async getStatus(@Param('id') id): Promise<OrderDto> {
        let order: Order;
        try {
            order = await this.ordersService.findById(id);
        } catch {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        if (!order) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return { id, status: order.status };
    }

    @Put(':id/cancel')
    async cancel(@Param('id') id): Promise<void> {
        let order: Order;
        try {
            order = await this.ordersService.findById(id);
        } catch {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        if (!order) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        if (order.status === OrderStatus.Delivered) {
            throw new HttpException('Delivered order cannot be canceled.', HttpStatus.BAD_REQUEST);
        }

        await this.ordersService.cancel(id);
    }

    @MessagePattern({ cmd: 'payment-processed' })
    async onPaymentProcessed(paymentResult: PaymentProcessResult): Promise<void> {
        if (paymentResult.response === PaymentStatus.Confirmed) {
            await this.ordersService.confirm(paymentResult.orderId);
        } else {
            await this.ordersService.cancel(paymentResult.orderId);
        }
    }
}

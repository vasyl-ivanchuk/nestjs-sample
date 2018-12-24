import { Controller, Post, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './interfaces/order-dto.interface';

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
        const order = await this.ordersService.findById(id);
        if (!order) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return { id, status: order.status };
    }
}

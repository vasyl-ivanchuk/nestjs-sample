import { Controller, Post } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
    @Post()
    async create() {
        return { id: 'orderId' };
    }
}

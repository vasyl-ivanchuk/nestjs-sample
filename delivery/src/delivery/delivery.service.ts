import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interval, NestSchedule } from 'nest-schedule';
import config from '../config';
import { OrderStatus } from '../enums/order-status.enum';
import { Order } from '../schemas/order.schema';

@Injectable()
export class DeliveryService extends NestSchedule {
    constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { super(); }

    @Interval(config.interval)
    async deliver(): Promise<void> {
        await this.orderModel.updateMany(
            { status: OrderStatus.Confirmed },
            { status: OrderStatus.Delivered }
        );
    }
}
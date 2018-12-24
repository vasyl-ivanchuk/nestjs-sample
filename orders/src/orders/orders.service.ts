import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { }

  async create(): Promise<Order> {
    return await this.orderModel.create({});
  }

  async findById(id: string): Promise<Order> {
    return await this.orderModel.findById(id);
  }

  async cancel(id: string): Promise<void> {
    await this.orderModel.findByIdAndUpdate(id, { status: OrderStatus.Cancelled });
  }
}
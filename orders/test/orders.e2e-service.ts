import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../src/orders/schemas/order.schema';

@Injectable()
export class OrdersE2eService {
  constructor(@InjectModel('Order') public readonly orderModel: Model<Order>) { }

  async deleteAll(): Promise<void> {
    await this.orderModel.remove({});
  }

  async create(orders: any): Promise<void> {
    await this.orderModel.insertMany(orders);
  }
}
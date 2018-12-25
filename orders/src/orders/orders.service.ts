import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { OrderStatus } from './enums/order-status.enum';
import { MessagesService } from './messages.service';

@Injectable()
export class OrdersService {
  constructor(@InjectModel('Order') private readonly orderModel: Model<Order>,
    private readonly messagesService: MessagesService) { }

  async create(): Promise<Order> {
    const createdOrder = await this.orderModel.create({});

    await this.messagesService.publish('order-created', { id: createdOrder.id });

    return createdOrder;
  }

  async findById(id: string): Promise<Order> {
    return await this.orderModel.findById(id);
  }

  async cancel(id: string): Promise<void> {
    await this.updateStatus(id, OrderStatus.Cancelled);
  }

  async confirm(id: string): Promise<void> {
    await this.updateStatus(id, OrderStatus.Confirmed);
  }

  private async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await this.orderModel.findByIdAndUpdate(id, { status });
  }
}
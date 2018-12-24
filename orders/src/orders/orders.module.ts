import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MessagesService } from './messages.service';
import { OrderSchema } from './schemas/order.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [OrdersService, MessagesService]
})
export class OrdersModule { }
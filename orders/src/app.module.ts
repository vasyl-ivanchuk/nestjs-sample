import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import config from './config';

@Module({
  imports: [MongooseModule.forRoot(config.mongoConnectionString, { useNewUrlParser: true }), OrdersModule]
})
export class AppModule { }

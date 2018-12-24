import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryModule } from './delivery/delivery.module';
import config from './config';

@Module({
  imports: [MongooseModule.forRoot(config.mongoConnectionString, { useNewUrlParser: true }), DeliveryModule]
})
export class AppModule { }

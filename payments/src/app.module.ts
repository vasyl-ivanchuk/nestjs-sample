import { Module } from '@nestjs/common';
import { PaymentsService } from './payments/payments.service';
import { MessagesService } from './payments/messages.service';
import { PaymentsController } from './payments/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, MessagesService],
})
export class AppModule { }

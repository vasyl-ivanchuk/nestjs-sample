import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { MessagesService } from './messages.service';
import { PaymentStatus } from './enums/payment-status.enum';

describe('Order Service', () => {
    let module: TestingModule;
    let service: PaymentsService;

    const messagesService = {
        publish() { }
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [PaymentsService, MessagesService],
        }).overrideProvider(MessagesService)
            .useValue(messagesService)
            .compile();

        service = module.get<PaymentsService>(PaymentsService);
    });

    describe('process', () => {
        const orderDto = {
            id: '5c20dba8484eff22c08712e3'
        };

        it('should publish a message that payment was processed', async () => {
            const spy = spyOn(messagesService, 'publish');
            await service.process(orderDto);
            expect(spy.calls.mostRecent().args[0]).toBe('payment-processed');
            const randomReply = spy.calls.mostRecent().args[1];
            expect(randomReply.orderId).toBe(orderDto.id);
            expect((<any>Object).values(PaymentStatus).includes(randomReply.response)).toBeTruthy();
        });

    });
});

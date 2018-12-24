import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('Order Controller', () => {
  let module: TestingModule;
  let controller: PaymentsController;

  const paymentsService = {
    process() { }
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PaymentsController],
    }).overrideProvider(PaymentsService)
      .useValue(paymentsService)
      .compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  describe('processPayment', () => {
    it('should process the order', async () => {
      const orderDto = {
        id: '5c20dba8484eff22c08712e3'
      };

      spyOn(paymentsService, 'process');
      await controller.processPayment(orderDto);
      expect(paymentsService.process).toHaveBeenCalledWith(orderDto);
    });

  });
});

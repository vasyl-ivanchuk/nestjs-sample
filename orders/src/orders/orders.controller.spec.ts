import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStatus } from './enums/order-status.enum';

describe('Order Controller', () => {
  let module: TestingModule;
  let controller: OrdersController;

  const ordersService = {
    create() { },
    findById() { }
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OrdersController],
    }).overrideProvider(OrdersService)
      .useValue(ordersService)
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  describe('create', () => {
    beforeEach(() => {
      spyOn(ordersService, 'create').and.returnValue({
        id: '5c20dba8484eff22c08712e3',
        status: OrderStatus.Created,
      });
    });

    it('should create an order', async () => {
      await controller.create();
      expect(ordersService.create).toHaveBeenCalled();
    });

    it('should return created order', async () => {
      const result = await controller.create();
      expect(result).toEqual({ id: '5c20dba8484eff22c08712e3', status: OrderStatus.Created });
    });
  });

  describe('getStatus', () => {
    it('should return an order if exists', async () => {
      spyOn(ordersService, 'findById').and.returnValue({
        id: '5c20dba8484eff22c08712e3',
        status: OrderStatus.Created,
      });

      const result = await controller.getStatus('5c20dba8484eff22c08712e3');
      expect(result).toEqual({ id: '5c20dba8484eff22c08712e3', status: OrderStatus.Created });
    });

    it('should throw NotFoundException if no order found', async () => {
      spyOn(ordersService, 'findById').and.returnValue(null);
      await expect(controller.getStatus('5c20dba8484eff22c08712e3')).rejects.toEqual(
        new HttpException('Not Found', HttpStatus.NOT_FOUND),
      );
    });

    describe('when exception occured', () => {
      it('should throw BadRequestException', async () => {
        spyOn(ordersService, 'findById').and.throwError('');
        await expect(controller.getStatus('5c20dba8484eff22c08712e3')).rejects.toEqual(
          new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
        );
      });
    });
  });
});

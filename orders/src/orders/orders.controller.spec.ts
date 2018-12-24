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
    findById() { },
    cancel() { }
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

    it('should throw BadRequestException if exception ocurred', async () => {
      spyOn(ordersService, 'findById').and.throwError('');
      await expect(controller.getStatus('5c20dba8484eff22c08712e3')).rejects.toEqual(
        new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('cancel', () => {
    it('should cancel an order if exists', async () => {
      spyOn(ordersService, 'findById').and.returnValue({
        id: '5c20dba8484eff22c08712e3',
        status: OrderStatus.Created,
      });
      spyOn(ordersService, 'cancel');

      await controller.cancel('5c20dba8484eff22c08712e3');
      expect(ordersService.cancel).toHaveBeenCalledWith('5c20dba8484eff22c08712e3');
    });

    it('should throw HttpException if no order found', async () => {
      spyOn(ordersService, 'findById').and.returnValue(null);
      await expect(controller.cancel('5c20dba8484eff22c08712e3')).rejects.toEqual(
        new HttpException('Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw HttpException if order was already delivered', async () => {
      spyOn(ordersService, 'findById').and.returnValue({
        id: '5c20dba8484eff22c08712e3',
        status: OrderStatus.Delivered,
      });
      await expect(controller.cancel('5c20dba8484eff22c08712e3')).rejects.toEqual(
        new HttpException('Delivered order cannot be canceled.', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw BadRequestException if exception ocurred', async () => {
      spyOn(ordersService, 'findById').and.throwError('');
      await expect(controller.cancel('5c20dba8484eff22c08712e3')).rejects.toEqual(
        new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
      );
    });
  });
});

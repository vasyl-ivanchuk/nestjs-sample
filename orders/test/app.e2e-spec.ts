import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { OrdersE2eService } from './orders.e2e-service';
import { OrderStatus } from '../src/orders/enums/order-status.enum';
import * as mongoose from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let ordersService: OrdersE2eService;

  const orders = [{
    _id: '5c2166b537ca90d5cb5c0aaa',
    status: OrderStatus.Created
  },
  {
    _id: '5c21586dc27679522e405c2f',
    status: OrderStatus.Delivered
  }];

  const throwIfFalsy = (actual: any, expected: any, message: string) => {
    if (actual !== expected) {
      throw new Error(`${message} Expected: ${expected}, actual: ${actual}`);
    }
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [OrdersE2eService]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    ordersService = app.get<OrdersE2eService>(OrdersE2eService);
    await ordersService.deleteAll();
    await ordersService.create(orders);
  });

  afterAll(() => {
    mongoose.connection.close();
    mongoose.disconnect();
    app.close();
  });

  describe('orders/:id/status GET', () => {
    it('returns 404 for non existant order', () => {
      return request(app.getHttpServer())
        .get('/orders/1c2166b537ca90d5cb5c0aaa/status')
        .expect(404);
    });

    it('returns 400 for not valid order id', () => {
      return request(app.getHttpServer())
        .get('/orders/notvalidid/status')
        .expect(400);
    });

    it('returns order id and status for existing order', () => {
      return request(app.getHttpServer())
        .get('/orders/5c2166b537ca90d5cb5c0aaa/status')
        .expect(200).then((res) => {
          throwIfFalsy(res.body.id, '5c2166b537ca90d5cb5c0aaa', 'Order id is not correct');
          throwIfFalsy(res.body.status, OrderStatus.Created, 'Order status is not correct');
        });
    });

    it('returns delivered status for confirmed order', async () => {
      await ordersService.create([{
        _id: '5c213f31f8e29a28e1a082c2',
        status: OrderStatus.Confirmed
      }]);

      await new Promise(resolve => setTimeout(resolve, 3000));

      return request(app.getHttpServer())
        .get('/orders/5c213f31f8e29a28e1a082c2/status')
        .expect(200).then((res) => {
          throwIfFalsy(res.body.id, '5c213f31f8e29a28e1a082c2', 'Order id is not correct');
          throwIfFalsy(res.body.status, OrderStatus.Delivered, 'Order status is not correct');
        });
    });

    it('returns canceled status for canceled order', async () => {
      await ordersService.create([{
        _id: '5c21eeab314da836187241c6',
        status: OrderStatus.Cancelled
      }]);

      await new Promise(resolve => setTimeout(resolve, 3000));

      return request(app.getHttpServer())
        .get('/orders/5c21eeab314da836187241c6/status')
        .expect(200).then((res) => {
          throwIfFalsy(res.body.id, '5c21eeab314da836187241c6', 'Order id is not correct');
          throwIfFalsy(res.body.status, OrderStatus.Cancelled, 'Order status is not correct');
        });
    });
  });

  describe('orders/:id/cancel PUT', () => {
    it('returns 404 for non existant order', () => {
      return request(app.getHttpServer())
        .put('/orders/1c2166b537ca90d5cb5c0aaa/cancel')
        .expect(404);
    });

    it('returns 400 for not valid order id', () => {
      return request(app.getHttpServer())
        .put('/orders/notvalidid/cancel')
        .expect(400);
    });

    it('returns 400 for not valid delivered order', () => {
      return request(app.getHttpServer())
        .put('/orders/5c21586dc27679522e405c2f/cancel')
        .expect(400);
    });

    it('returns order id and new status for existing order', () => {
      return request(app.getHttpServer())
        .put('/orders/5c2166b537ca90d5cb5c0aaa/cancel')
        .expect(200);
    });
  });

  describe('orders POST', () => {
    it('returns order id and created status for new order', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .expect(201).then((res) => {
          throwIfFalsy(!!(res.body.id && res.body.id.length), true, 'Order id is not correct');
          throwIfFalsy(res.body.status, OrderStatus.Created, 'Order status is not correct');
        });
    });
  });
});

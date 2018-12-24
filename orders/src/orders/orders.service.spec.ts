import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrderStatus } from './enums/order-status.enum';
import { getModelToken } from '@nestjs/mongoose';

describe('Order Service', () => {
    let module: TestingModule;
    let service: OrdersService;

    const orderModel = {
        create() { },
        findById() { }
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [OrdersService],
        }).overrideProvider(getModelToken('Order'))
            .useValue(orderModel)
            .compile();

        service = module.get<OrdersService>(OrdersService);
    });

    describe('create', () => {
        const order = {
            "id": "5c20dba8484eff22c08712e3",
            "status": OrderStatus.Created
        };

        beforeEach(() => {
            spyOn(orderModel, 'create').and.returnValue(order);
        });

        it('should create an order', async () => {
            await service.create();
            expect(orderModel.create).toHaveBeenCalled();
        });

        it('should return created order', async () => {
            const order = await service.create();
            expect(order).toBe(order);
        });
    });

    describe('findById', () => {
        const order = {
            "id": "5c20dba8484eff22c08712e3",
            "status": OrderStatus.Created
        };

        beforeEach(() => {
            spyOn(orderModel, 'findById').and.returnValue(order);
        });

        it('should return founded order', async () => {
            const order = await service.findById('5c20dba8484eff22c08712e3');
            expect(order).toBe(order);
        });
    });
});

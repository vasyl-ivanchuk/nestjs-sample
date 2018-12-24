import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { MessagesService } from './messages.service';
import { OrderStatus } from './enums/order-status.enum';
import { getModelToken } from '@nestjs/mongoose';

describe('Orders Service', () => {
    let module: TestingModule;
    let service: OrdersService;

    const messagesService = {
        publish() { }
    };

    const orderModel = {
        create() { },
        findById() { },
        findByIdAndUpdate() { }
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [OrdersService, MessagesService],
        }).overrideProvider(MessagesService)
            .useValue(messagesService)
            .overrideProvider(getModelToken('Order'))
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

        it('should publish a message about the order creation', async () => {
            spyOn(messagesService, 'publish');
            await service.create();
            expect(messagesService.publish).toHaveBeenCalledWith('order-created', { id: '5c20dba8484eff22c08712e3' });
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

    describe('cancel', () => {
        beforeEach(() => {
            spyOn(orderModel, 'findByIdAndUpdate');
        });

        it('should update the status of the order to cancelled', async () => {
            await service.cancel('5c20dba8484eff22c08712e3');
            expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('5c20dba8484eff22c08712e3',
                { status: OrderStatus.Cancelled });
        });
    });

    describe('confirm', () => {
        beforeEach(() => {
            spyOn(orderModel, 'findByIdAndUpdate');
        });

        it('should update the status of the order to confirmed', async () => {
            await service.confirm('5c20dba8484eff22c08712e3');
            expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('5c20dba8484eff22c08712e3',
                { status: OrderStatus.Confirmed });
        });
    });
});

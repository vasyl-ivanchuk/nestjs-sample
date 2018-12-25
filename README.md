# nestjs-sample
Simple app built on the nestjs framework. Consists of next microservices:
- orders: responsible for order management
- payments: responsible for payments processing
- delivery: mock service responsible for delivery

Uses:
- mongodb: to store the orders
- redis: for the microservices communication

How to run:
- to use local code base run:
```
docker-compose build
docker-compose up
```

- to run the app using built docker images use next commands:

```
docker-compose -f docker-compose.production.yml up
```

Endpoints:
- http://localhost:3000/orders POST - create an order
- http://localhost:3000/orders/:orderId/status GET - check order status
- http://localhost:3000/orders/:orderId/cancel PUT - cancel an order
import { Transport } from '@nestjs/microservices';

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

export default {
    microservicesConfiguration: {
        transport: Transport.REDIS,
        options: {
            url: `redis://${REDIS_HOST}:6379`,
        }
    }
}
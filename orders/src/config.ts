import { Transport } from '@nestjs/microservices';

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_COLLECTION = process.env.DB_COLLECTION = 'orders';

export default {
    microservicesConfiguration: {
        transport: Transport.REDIS,
        options: {
            url: `redis://${REDIS_HOST}:6379`,
        }
    },
    mongoConnectionString: `mongodb://${DB_HOST}:27017/${DB_COLLECTION}`
}
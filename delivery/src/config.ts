const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_COLLECTION = process.env.DB_COLLECTION = 'orders';

export default {
    interval: parseInt(process.env.EXECUTION_INTERVAL) || 2000,
    mongoConnectionString: `mongodb://${DB_HOST}:27017/${DB_COLLECTION}`
}
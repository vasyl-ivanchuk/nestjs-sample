const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_COLLECTION = process.env.DB_COLLECTION = 'orders';

export default {
    mongoConnectionString: `mongodb://${DB_HOST}:27017/${DB_COLLECTION}`
}
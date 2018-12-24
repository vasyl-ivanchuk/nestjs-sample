import * as mongoose from 'mongoose';

export interface Order extends mongoose.Document {
    id: string,
    status: string
  }

export const OrderSchema = new mongoose.Schema({
  status: String
}, {
    timestamps: true
});
import * as mongoose from 'mongoose';
import { OrderStatus } from '../enums/order-status.enum';

export interface Order extends mongoose.Document {
  id: string,
  status: string
}

export const OrderSchema = new mongoose.Schema({
  status: {
    type: String,
    default: OrderStatus.Created,
  }
}, {
    timestamps: true
  });
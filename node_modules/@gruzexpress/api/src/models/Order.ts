import mongoose, { Schema } from 'mongoose';
import type { OrderStatus } from '@repo/types';

export interface OrderStatusEntry {
  status: OrderStatus;
  changedAt: Date;
  changedBy?: mongoose.Types.ObjectId;
  comment?: string;
}

export interface OrderDocument extends mongoose.Document {
  userId?: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  status: OrderStatus;
  customerName: string;
  serviceName: string;
  address: string;
  phone: string;
  comment: string;
  total: number;
  statusHistory: OrderStatusEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const orderStatusHistorySchema = new Schema<OrderStatusEntry>({
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String, default: '' },
});

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    customerName: { type: String, required: true },
    serviceName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    comment: { type: String, default: '' },
    total: { type: Number, default: 0 },
    statusHistory: [orderStatusHistorySchema],
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>('Order', orderSchema);
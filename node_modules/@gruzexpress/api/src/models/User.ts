import mongoose, { Schema, model } from 'mongoose';
import type { UserWithPassword } from '@repo/types';

export interface UserModelDocument extends Omit<UserWithPassword, '_id'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  phone: string;
  avatar: string;
  emailVerified: boolean;
  verificationToken: string | null;
  discount: number;
  totalOrders: number;
  resetToken: string | null;
  resetTokenExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserModelDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null, select: false },
    discount: { type: Number, default: 0, min: 0, max: 50 },
    totalOrders: { type: Number, default: 0 },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Автоматическое начисление скидки за количество заказов
userSchema.methods.calculateDiscount = function () {
  const orders = this.totalOrders;
  if (orders >= 20) this.discount = 15;
  else if (orders >= 10) this.discount = 10;
  else if (orders >= 5) this.discount = 5;
  else this.discount = 0;
};

export const User = mongoose.model<UserModelDocument>('User', userSchema);
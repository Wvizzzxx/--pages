import mongoose, { Schema, model } from 'mongoose';
import type { UserWithPassword } from '@repo/types';

export interface UserModelDocument extends Omit<UserWithPassword, '_id'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  phone: string;
  avatar: string;
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
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserModelDocument>('User', userSchema);
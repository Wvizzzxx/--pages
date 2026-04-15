import mongoose, { Schema } from 'mongoose';

export interface ServiceDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  price: number;
  priceUnit: string;
  image: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<ServiceDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true },
    priceUnit: { type: String, required: true },
    image: { type: String, default: '' },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<ServiceDocument>('Service', serviceSchema);
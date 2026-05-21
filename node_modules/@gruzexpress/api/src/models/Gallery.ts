import mongoose, { Schema } from 'mongoose';

export interface GalleryDocument extends mongoose.Document {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<GalleryDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'general' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1 });
gallerySchema.index({ isActive: 1 });
gallerySchema.index({ sortOrder: 1 });

export const Gallery = mongoose.model<GalleryDocument>('Gallery', gallerySchema);
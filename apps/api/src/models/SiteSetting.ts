import mongoose, { Schema } from 'mongoose';

export interface SiteSettingDocument extends mongoose.Document {
  key: string;
  value: string;
  label: string;
  section: string;
  updatedAt: Date;
}

const siteSettingSchema = new Schema<SiteSettingDocument>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: '' },
    label: { type: String, required: true },
    section: { type: String, required: true },
  },
  { timestamps: true }
);

siteSettingSchema.index({ section: 1 });

export const SiteSetting = mongoose.model<SiteSettingDocument>('SiteSetting', siteSettingSchema);
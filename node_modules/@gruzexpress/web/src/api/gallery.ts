import { apiClient } from './client';
import type { GalleryItem, ApiResponse } from '@repo/types';

export async function getGalleryItems(category?: string, limit?: number): Promise<ApiResponse<GalleryItem[]>> {
  const params: any = {};
  if (category) params.category = category;
  if (limit) params.limit = limit;
  const { data } = await apiClient.get('/gallery', { params });
  return data;
}

export async function getGalleryItem(id: string): Promise<ApiResponse<GalleryItem>> {
  const { data } = await apiClient.get(`/gallery/${id}`);
  return data;
}

export async function getGalleryCategories(): Promise<ApiResponse<string[]>> {
  const { data } = await apiClient.get('/gallery/categories/list');
  return data;
}
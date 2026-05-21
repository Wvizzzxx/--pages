import { apiClient } from './client';
import type { GalleryItem, CreateGalleryDto, UpdateGalleryDto, ApiResponse } from '@repo/types';

export async function getGalleryItems(params?: { page?: number; limit?: number; category?: string; search?: string }): Promise<ApiResponse<{ data: GalleryItem[]; total: number; page: number; limit: number; totalPages: number }>> {
  const { data } = await apiClient.get('/admin/gallery', { params });
  return data;
}

export async function createGalleryItem(dto: CreateGalleryDto): Promise<ApiResponse<GalleryItem>> {
  const { data } = await apiClient.post('/admin/gallery', dto);
  return data;
}

export async function updateGalleryItem(id: string, dto: UpdateGalleryDto): Promise<ApiResponse<GalleryItem>> {
  const { data } = await apiClient.patch(`/admin/gallery/${id}`, dto);
  return data;
}

export async function deleteGalleryItem(id: string): Promise<ApiResponse<any>> {
  const { data } = await apiClient.delete(`/admin/gallery/${id}`);
  return data;
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await apiClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // Сервер возвращает { success: true, data: { url: "..." } }
  return data.data || data;
}

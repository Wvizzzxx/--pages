import { apiClient } from './client';
import type { Service, CreateServiceDto, UpdateServiceDto, ApiResponse, PaginatedResponse, PaginationParams } from '@repo/types';

export async function getAllServices(params?: PaginationParams): Promise<ApiResponse<{ data: Service[]; total: number }>> {
  const { data } = await apiClient.get('/services/admin/all', { params });
  return data;
}

export async function createService(dto: CreateServiceDto): Promise<ApiResponse<Service>> {
  const { data } = await apiClient.post('/services', dto);
  return data;
}

export async function updateService(id: string, dto: UpdateServiceDto): Promise<ApiResponse<Service>> {
  const { data } = await apiClient.patch(`/services/${id}`, dto);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await apiClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
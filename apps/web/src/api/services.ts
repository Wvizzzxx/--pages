import { apiClient } from './client';
import type { Service, ApiResponse } from '@repo/types';

export async function getServices(): Promise<Service[]> {
  const response = await apiClient.get<ApiResponse<Service[]>>('/services');
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  return [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const response = await apiClient.get<ApiResponse<Service>>(`/services/${slug}`);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  return null;
}
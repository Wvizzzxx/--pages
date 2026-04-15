import { apiClient } from './client';
import type { User, UserRole, ApiResponse, PaginatedResponse, PaginationParams } from '@repo/types';

export async function getAllUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
  const { data } = await apiClient.get('/users', { params });
  return data;
}

export async function updateUserRole(id: string, role: UserRole): Promise<ApiResponse<User>> {
  const { data } = await apiClient.patch(`/users/${id}/role`, { role });
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
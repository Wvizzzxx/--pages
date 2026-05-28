import { apiClient, handleApiResponse, getErrorMessage } from './client';
import type { LoginDto, RegisterDto, AuthResponse, User, ChangePasswordDto, ApiResponse } from '@repo/types';

export async function login(data: LoginDto): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Ошибка входа');
}

export async function register(data: RegisterDto): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Ошибка регистрации');
}

export async function getMe(): Promise<User | null> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  if (response.data.success) {
    return response.data.data || null;
  }
  return null;
}

export async function changePassword(data: ChangePasswordDto): Promise<void> {
  await apiClient.post('/auth/change-password', data);
}
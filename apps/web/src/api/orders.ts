import { apiClient } from './client';
import type { CreateOrderDto, PublicOrderDto, Order, PaginatedResponse, ApiResponse } from '@repo/types';

export async function createOrder(data: CreateOrderDto): Promise<Order> {
  const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Ошибка создания заказа');
}

export async function createPublicOrder(data: PublicOrderDto): Promise<Order> {
  const response = await apiClient.post<ApiResponse<Order>>('/orders/public', data);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Ошибка отправки заявки');
}

export async function getMyOrders(params?: { page?: number; limit?: number; status?: string }): Promise<{ orders: Order[]; total: number }> {
  const response = await apiClient.get<ApiResponse<Order[]>>('/orders/my', { params });
  if (response.data.success && response.data.data) {
    return { orders: response.data.data, total: response.data.data.length };
  }
  return { orders: [], total: 0 };
}
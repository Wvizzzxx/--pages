import { apiClient } from './client';
import type { Order, OrderStatus, ApiResponse, PaginatedResponse, PaginationParams, OrderWithHistory } from '@repo/types';

export async function getAllOrders(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
  const { data } = await apiClient.get('/orders/all', { params });
  return data;
}

export async function getOrderById(id: string): Promise<ApiResponse<OrderWithHistory>> {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus, comment?: string): Promise<ApiResponse<Order>> {
  const { data } = await apiClient.patch(`/orders/${id}/status`, { status, comment });
  return data;
}

export async function deleteOrder(id: string): Promise<void> {
  await apiClient.delete(`/orders/${id}`);
}
import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '@repo/types';
import { useAuthStore } from '../stores/auth';
import { router } from '../router';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore();
        authStore.logout();
        router.push({ name: 'login' });
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const apiClient = createApiClient();

export async function handleApiResponse<T>(promise: Promise<any>): Promise<T> {
  const response = await promise;
  return response.data;
}

export function getErrorMessage(error: any, defaultMessage: string = 'Произошла ошибка'): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
}
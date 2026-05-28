import { apiClient } from './client';

export async function getSiteSettings(): Promise<{ success: boolean; data: any }> {
  const { data } = await apiClient.get('/admin/settings');
  return data;
}

export async function saveSiteSettings(settings: Array<{ key: string; value: string; label: string; section: string }>): Promise<{ success: boolean; data: any }> {
  const { data } = await apiClient.post('/admin/settings', { settings });
  return data;
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await apiClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // data = { success: true, data: { url: '/uploads/xxx.jpg' } }
  return data.data.url;
}
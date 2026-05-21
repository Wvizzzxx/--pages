import { ref } from 'vue';

const siteSettings = ref<Record<string, string>>({});
let lastLoaded = 0;
const CACHE_TTL = 30_000; // 30 секунд — обновляем настройки регулярно

export function useSiteSettings() {
  async function loadSettings(force = false) {
    const now = Date.now();
    if (!force && siteSettings.value && Object.keys(siteSettings.value).length > 0 && now - lastLoaded < CACHE_TTL) {
      return;
    }
    try {
      const response = await fetch('/api/settings');
      const json = await response.json();
      if (json.success && json.data) {
        siteSettings.value = json.data;
        lastLoaded = now;
      }
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  }

  function getSetting(key: string, fallback = ''): string {
    return siteSettings.value[key] || fallback;
  }

  function getPhoto(key: string, fallback = ''): string {
    return siteSettings.value[key] || fallback;
  }

  return { siteSettings, loadSettings, getSetting, getPhoto };
}

<template>
  <div class="admin-settings">
    <div class="page-header">
      <h1>🎨 Настройки сайта</h1>
      <p class="page-desc">Управляйте всем содержимым сайта: фото, иконки, тексты, ссылки. Все изменения сохраняются в базу данных.</p>
    </div>

    <div v-if="loading" class="loading">Загрузка настроек...</div>

    <template v-else>
      <!-- Навигация по секциям -->
      <div class="tabs-nav">
        <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- === ФОТО === -->
      <div v-show="activeTab === 'photos'" class="tab-content">
        <div v-for="section in photoSections" :key="section.key" class="settings-section">
          <h2 class="section-heading">{{ section.label }}</h2>
          <div class="photos-grid">
            <div v-for="photo in section.photos" :key="photo.key" class="photo-card">
              <div class="photo-preview" @click="triggerUpload(photo.key)">
                <img v-if="settings[photo.key]" :src="settings[photo.key]" :alt="photo.label" class="photo-img"
                  @error="(e: any) => (e.target as HTMLImageElement).style.display='none'" />
                <div v-if="!settings[photo.key]" class="photo-placeholder">
                  <span class="photo-placeholder-icon">📷</span>
                  <span class="photo-placeholder-text">{{ photo.label }}</span>
                </div>
                <div class="photo-overlay"><span>📷 Заменить</span></div>
              </div>
              <div class="photo-info"><span class="photo-label">{{ photo.label }}</span></div>
              <div class="photo-url-input">
                <input v-model="settings[photo.key]" type="text" class="url-input" placeholder="Ссылка на фото..." />
              </div>
              <div class="photo-actions">
                <label class="upload-btn">
                  📁 Файл
              <input type="file" accept="image/*" style="display:none" :data-photo-key="photo.key" @change="(e) => handleFileSelect(e, photo)" />
                </label>
                <button v-if="settings[photo.key]" class="remove-btn" @click="settings[photo.key] = ''">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- === ИКОНКИ === -->
      <div v-show="activeTab === 'icons'" class="tab-content">
        <div v-for="section in iconSections" :key="section.key" class="settings-section">
          <h2 class="section-heading">{{ section.label }}</h2>
          <div class="icons-grid">
            <div v-for="icon in section.icons" :key="icon.key" class="icon-card">
              <div class="icon-preview" @click="triggerIconUpload(icon.key)">
                <img v-if="isImageUrl(settings[icon.key])" :src="settings[icon.key]" :alt="icon.label" class="icon-img"
                  @error="(e: any) => (e.target as HTMLImageElement).style.display='none'" />
                <span v-else class="icon-emoji">{{ settings[icon.key] || icon.default }}</span>
                <div class="icon-overlay"><span>📁 Заменить</span></div>
              </div>
              <div class="icon-details">
                <div class="icon-info">
                  <span class="icon-label">{{ icon.label }}</span>
                  <span class="icon-hint">{{ icon.hint }}</span>
                </div>
                <input v-model="settings[icon.key]" type="text" class="url-input" :placeholder="icon.default" />
                <div class="icon-actions">
                  <label class="upload-btn">
                    📁 Файл
                    <input type="file" accept="image/*" style="display:none" :data-icon-key="icon.key" @change="(e) => handleIconFileSelect(e, icon)" />
                  </label>
                  <button v-if="settings[icon.key]" class="remove-btn" @click="settings[icon.key] = ''">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- === ТЕКСТЫ === -->
      <div v-show="activeTab === 'texts'" class="tab-content">
        <div v-for="section in textSections" :key="section.key" class="settings-section">
          <h2 class="section-heading">{{ section.label }}</h2>
          <div class="texts-grid">
            <div v-for="text in section.texts" :key="text.key" class="text-field">
              <label class="text-label">{{ text.label }}</label>
              <textarea v-if="text.multiline" v-model="settings[text.key]" class="text-input" rows="3" :placeholder="text.placeholder"></textarea>
              <input v-else v-model="settings[text.key]" type="text" class="text-input" :placeholder="text.placeholder" />
            </div>
          </div>
        </div>
      </div>

      <!-- === ССЫЛКИ === -->
      <div v-show="activeTab === 'links'" class="tab-content">
        <div class="settings-section">
          <h2 class="section-heading">📞 Контакты и ссылки</h2>
          <div class="texts-grid">
            <div v-for="link in linkFields" :key="link.key" class="text-field">
              <label class="text-label">{{ link.label }}</label>
              <input v-model="settings[link.key]" type="text" class="text-input" :placeholder="link.placeholder" />
            </div>
          </div>
        </div>
      </div>

      <!-- Сохранить -->
      <div class="save-bar">
        <button class="btn btn-primary" :disabled="saving" @click="saveAll">
          {{ saving ? 'Сохранение...' : '💾 Сохранить все изменения' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { getSiteSettings, saveSiteSettings, uploadImage } from '../../api/siteSettings';

interface PhotoSlot { key: string; label: string; }
interface PhotoSection { key: string; label: string; photos: PhotoSlot[]; }
interface IconSlot { key: string; label: string; default: string; hint: string; }
interface IconSection { key: string; label: string; icons: IconSlot[]; }
interface TextField { key: string; label: string; placeholder: string; multiline?: boolean; }
interface TextSection { key: string; label: string; texts: TextField[]; }

const activeTab = ref('photos');
const tabs = [
  { key: 'photos', icon: '🖼️', label: 'Фото' },
  { key: 'icons', icon: '✨', label: 'Иконки' },
  { key: 'texts', icon: '📝', label: 'Тексты' },
  { key: 'links', icon: '🔗', label: 'Контакты и ссылки' },
];

/* === ФОТО === */
const photoSections: PhotoSection[] = [
  { key: 'services', label: '🛠️ Фото услуг', photos: [
    { key: 'services_city', label: 'Городские перевозки' },
    { key: 'services_intercity', label: 'Межгородские перевозки' },
    { key: 'services_moving', label: 'Переезды' },
    { key: 'services_cargo', label: 'Негабаритные грузы' },
  ]},
  { key: 'about', label: '📄 О компании', photos: [
    { key: 'about_hero', label: 'Фото героя' },
    { key: 'about_team', label: 'Фото команды' },
    { key: 'about_office', label: 'Фото офиса' },
  ]},
  { key: 'delivery', label: '🚚 Доставка', photos: [
    { key: 'delivery_hero', label: 'Фото героя' },
    { key: 'delivery_tracking', label: 'Фото отслеживания' },
  ]},
  { key: 'guarantee', label: '🛡️ Гарантия', photos: [
    { key: 'guarantee_hero', label: 'Фото героя' },
    { key: 'guarantee_insurance', label: 'Фото страхования' },
  ]},
  { key: 'contacts', label: '📞 Контакты', photos: [
    { key: 'contacts_office', label: 'Фото офиса' },
    { key: 'contacts_map', label: 'Фото карты' },
  ]},
  { key: 'gallery', label: '🖼️ Галерея', photos: [
    { key: 'gallery_hero', label: 'Обложка галереи' },
  ]},
];

/* === ИКОНКИ === */
const iconSections: IconSection[] = [
  { key: 'process', label: '⚙️ Иконки процесса "Как мы работаем"', icons: [
    { key: 'icon_process_1', label: 'Шаг 1: Заявка', default: '📝', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_process_2', label: 'Шаг 2: Расчёт', default: '📋', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_process_3', label: 'Шаг 3: Доставка', default: '🚚', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_process_4', label: 'Шаг 4: Получение', default: '✅', hint: 'Эмодзи или URL иконки' },
  ]},
  { key: 'features', label: '⭐ Иконки преимуществ', icons: [
    { key: 'icon_feature_1', label: 'Быстрая доставка', default: '🚚', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_feature_2', label: 'Гарантия сохранности', default: '🛡️', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_feature_3', label: 'Доступные цены', default: '💰', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_feature_4', label: 'Поддержка 24/7', default: '📞', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_feature_5', label: 'GPS-отслеживание', default: '📍', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_feature_6', label: 'Лучшие специалисты', default: '🏆', hint: 'Эмодзи или URL иконки' },
  ]},
  { key: 'order', label: '📦 Иконки блока "Оформить заказ"', icons: [
    { key: 'icon_order_1', label: 'Быстрый ответ', default: '⚡', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_order_2', label: 'Гарантия', default: '🛡️', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_order_3', label: 'Лучшие цены', default: '💰', hint: 'Эмодзи или URL иконки' },
  ]},
  { key: 'other', label: '🎯 Прочие иконки', icons: [
    { key: 'icon_phone', label: 'Телефон в CTA', default: '📞', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_star', label: 'Звезда (рейтинг)', default: '⭐', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_zoom', label: 'Лупа (галерея)', default: '🔍', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_success', label: 'Успех', default: '✅', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_loader', label: 'Загрузка', default: '⏳', hint: 'Эмодзи или URL иконки' },
    { key: 'icon_quote', label: 'Цитата (отзывы)', default: '💬', hint: 'Эмодзи или URL иконки' },
  ]},
];

/* === ТЕКСТЫ === */
const textSections: TextSection[] = [
  { key: 'hero', label: '🏠 Главная — Hero', texts: [
    { key: 'hero_badge', label: 'Текст бейджа', placeholder: '⭐ Лидер рынка грузоперевозок' },
    { key: 'hero_title', label: 'Заголовок', placeholder: 'Надёжные грузоперевозки', multiline: true },
    { key: 'hero_subtitle', label: 'Подзаголовок', placeholder: 'Компания ГрузЭкспресс...', multiline: true },
    { key: 'hero_cta_primary', label: 'CTA кнопка (текст)', placeholder: 'Оформить заявку' },
    { key: 'hero_cta_secondary', label: 'CTA кнопка 2 (текст)', placeholder: 'Посмотреть услуги' },
  ]},
  { key: 'sections', label: '📐 Заголовки секций', texts: [
    { key: 'section_process_title', label: '"Как мы работаем" — заголовок', placeholder: 'Как мы работаем' },
    { key: 'section_process_desc', label: '"Как мы работаем" — описание', placeholder: 'Простой и прозрачный процесс...', multiline: true },
    { key: 'section_features_title', label: '"Преимущества" — заголовок', placeholder: 'Почему выбирают нас' },
    { key: 'section_features_desc', label: '"Преимущества" — описание', placeholder: 'Полный спектр услуг...', multiline: true },
    { key: 'section_services_title', label: '"Услуги" — заголовок', placeholder: 'Наши услуги' },
    { key: 'section_services_desc', label: '"Услуги" — описание', placeholder: 'Широкий спектр услуг...', multiline: true },
    { key: 'section_gallery_title', label: '"Галерея" — заголовок', placeholder: 'Наша галерея' },
    { key: 'section_gallery_desc', label: '"Галерея" — описание', placeholder: 'Фотографии техники...', multiline: true },
    { key: 'section_about_title', label: '"О компании" — заголовок', placeholder: 'О компании ГрузЭкспресс' },
    { key: 'section_about_text_1', label: '"О компании" — текст 1', placeholder: 'Основана в 2010 году...', multiline: true },
    { key: 'section_about_text_2', label: '"О компании" — текст 2', placeholder: 'Наша миссия...', multiline: true },
    { key: 'section_testimonials_title', label: '"Отзывы" — заголовок', placeholder: 'Отзывы клиентов' },
    { key: 'section_cta_title', label: 'CTA — заголовок', placeholder: 'Готовы заказать грузоперевозку?' },
    { key: 'section_cta_desc', label: 'CTA — описание', placeholder: 'Оставьте заявку...', multiline: true },
  ]},
  { key: 'process', label: '⚙️ Шаги процесса', texts: [
    { key: 'process_step_1_title', label: 'Шаг 1 — заголовок', placeholder: 'Оставляете заявку' },
    { key: 'process_step_1_text', label: 'Шаг 1 — описание', placeholder: 'Заполните форму...', multiline: true },
    { key: 'process_step_2_title', label: 'Шаг 2 — заголовок', placeholder: 'Расчёт и согласование' },
    { key: 'process_step_2_text', label: 'Шаг 2 — описание', placeholder: 'Подберём транспорт...', multiline: true },
    { key: 'process_step_3_title', label: 'Шаг 3 — заголовок', placeholder: 'Доставка' },
    { key: 'process_step_3_text', label: 'Шаг 3 — описание', placeholder: 'Отслеживайте груз...', multiline: true },
    { key: 'process_step_4_title', label: 'Шаг 4 — заголовок', placeholder: 'Получение груза' },
    { key: 'process_step_4_text', label: 'Шаг 4 — описание', placeholder: 'Доставим точно в срок...', multiline: true },
  ]},
  { key: 'features', label: '⭐ Преимущества', texts: [
    { key: 'feature_1_title', label: 'Преимущество 1 — заголовок', placeholder: 'Быстрая доставка' },
    { key: 'feature_1_text', label: 'Преимущество 1 — описание', placeholder: 'Автопарк 200+...', multiline: true },
    { key: 'feature_2_title', label: 'Преимущество 2 — заголовок', placeholder: 'Гарантия сохранности' },
    { key: 'feature_2_text', label: 'Преимущество 2 — описание', placeholder: 'Все грузы застрахованы...', multiline: true },
    { key: 'feature_3_title', label: 'Преимущество 3 — заголовок', placeholder: 'Доступные цены' },
    { key: 'feature_3_text', label: 'Преимущество 3 — описание', placeholder: 'Прозрачное ценообразование...', multiline: true },
    { key: 'feature_4_title', label: 'Преимущество 4 — заголовок', placeholder: 'Поддержка 24/7' },
    { key: 'feature_4_text', label: 'Преимущество 4 — описание', placeholder: 'Диспетчерский центр...', multiline: true },
    { key: 'feature_5_title', label: 'Преимущество 5 — заголовок', placeholder: 'GPS-отслеживание' },
    { key: 'feature_5_text', label: 'Преимущество 5 — описание', placeholder: 'Все транспортные средства...', multiline: true },
    { key: 'feature_6_title', label: 'Преимущество 6 — заголовок', placeholder: 'Лучшие специалисты' },
    { key: 'feature_6_text', label: 'Преимущество 6 — описание', placeholder: '300+ профессионалов...', multiline: true },
  ]},
  { key: 'testimonials', label: '💬 Отзывы', texts: [
    { key: 'testimonial_1_name', label: 'Отзыв 1 — имя', placeholder: 'Алексей Иванов' },
    { key: 'testimonial_1_role', label: 'Отзыв 1 — роль', placeholder: 'Директор ООО ТехноСервис' },
    { key: 'testimonial_1_text', label: 'Отзыв 1 — текст', placeholder: 'Заказывали перевозку...', multiline: true },
    { key: 'testimonial_2_name', label: 'Отзыв 2 — имя', placeholder: 'Мария Петрова' },
    { key: 'testimonial_2_role', label: 'Отзыв 2 — роль', placeholder: 'Логист АО ПромТорг' },
    { key: 'testimonial_2_text', label: 'Отзыв 2 — текст', placeholder: 'Работаем уже 3 года...', multiline: true },
    { key: 'testimonial_3_name', label: 'Отзыв 3 — имя', placeholder: 'Сергей Козлов' },
    { key: 'testimonial_3_role', label: 'Отзыв 3 — роль', placeholder: 'Инженер ЗАО МеталлПром' },
    { key: 'testimonial_3_text', label: 'Отзыв 3 — текст', placeholder: 'Перевозили негабаритное...', multiline: true },
  ]},
  { key: 'footer', label: '📋 Подвал сайта', texts: [
    { key: 'footer_description', label: 'Описание в футере', placeholder: 'Надёжные грузоперевозки по всей России...', multiline: true },
    { key: 'footer_phone_label', label: 'Телефон (текст)', placeholder: 'Круглосуточно' },
    { key: 'footer_address', label: 'Адрес', placeholder: 'г. Москва, ул. Транспортная, д. 1' },
  ]},
];

/* === ССЫЛКИ === */
const linkFields = [
  { key: 'contact_phone', label: '📞 Телефон', placeholder: '+7 (800) 555-35-35' },
  { key: 'contact_email', label: '📧 Email', placeholder: 'info@gruzexpress.ru' },
  { key: 'contact_address', label: '📍 Адрес', placeholder: 'г. Москва, ул. Транспортная, д. 1' },
  { key: 'contact_workhours', label: '⏰ Режим работы', placeholder: 'Круглосуточно' },
  { key: 'social_vk', label: 'VK (ссылка)', placeholder: 'https://vk.com/...' },
  { key: 'social_telegram', label: 'Telegram (ссылка)', placeholder: 'https://t.me/...' },
  { key: 'social_whatsapp', label: 'WhatsApp (ссылка)', placeholder: 'https://wa.me/...' },
];

const settings = ref<Record<string, string>>({});
const loading = ref(true);
const saving = ref(false);

async function loadSettings() {
  loading.value = true;
  try {
    const response = await getSiteSettings();
    if (response.success && response.data) {
      if (Array.isArray(response.data)) {
        response.data.forEach((s: any) => { if (s.value) settings.value[s.key] = s.value; });
      } else {
        Object.keys(response.data).forEach((key) => { if (response.data[key]) settings.value[key] = response.data[key]; });
      }
    }
  } catch (error) { console.error('Error loading settings:', error); }
  finally { loading.value = false; }
}

function triggerUpload(key: string) {
  const input = document.querySelector(`input[data-photo-key="${key}"]`) as HTMLInputElement;
  if (input) input.click();
}

function triggerIconUpload(key: string) {
  const input = document.querySelector(`input[data-icon-key="${key}"]`) as HTMLInputElement;
  if (input) input.click();
}

function isImageUrl(value: string): boolean {
  if (!value) return false;
  return /\.(png|jpe?g|gif|svg|webp|ico|bmp|avif)(\?.*)?$/i.test(value) || /^https?:\/\//.test(value);
}

async function handleFileSelect(event: Event, photo: PhotoSlot) {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  const file = target.files[0];
  if (file.size > 10 * 1024 * 1024) { alert('Файл слишком большой. Максимум 10MB.'); return; }
  try {
    const url = await uploadImage(file);
    settings.value[photo.key] = url;
  } catch (error) { console.error('Error uploading:', error); alert('Ошибка загрузки файла'); }
  target.value = '';
}

async function handleIconFileSelect(event: Event, icon: IconSlot) {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  const file = target.files[0];
  if (file.size > 5 * 1024 * 1024) { alert('Файл слишком большой. Максимум 5MB.'); return; }
  try {
    const url = await uploadImage(file);
    settings.value[icon.key] = url;
  } catch (error) { console.error('Error uploading icon:', error); alert('Ошибка загрузки иконки'); }
  target.value = '';
}

async function saveAll() {
  saving.value = true;
  try {
    const allItems: Array<{ key: string; value: string; label: string; section: string }> = [];

    photoSections.forEach(s => s.photos.forEach(p => allItems.push({ key: p.key, value: settings.value[p.key] || '', label: p.label, section: 'photo' })));
    iconSections.forEach(s => s.icons.forEach(i => allItems.push({ key: i.key, value: settings.value[i.key] || '', label: i.label, section: 'icon' })));
    textSections.forEach(s => s.texts.forEach(t => allItems.push({ key: t.key, value: settings.value[t.key] || '', label: t.label, section: 'text' })));
    linkFields.forEach(l => allItems.push({ key: l.key, value: settings.value[l.key] || '', label: l.label, section: 'link' }));

    await saveSiteSettings(allItems);
    alert('Все настройки сохранены!');
  } catch (error) { console.error('Error saving:', error); alert('Ошибка сохранения: ' + (error as Error).message); }
  finally { saving.value = false; }
}

onMounted(async () => { await loadSettings(); await nextTick(); });
</script>

<style scoped>
.admin-settings { padding: 0; }
.page-header { margin-bottom: var(--spacing-xl); }
.page-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-xs); }
.page-desc { color: var(--color-text-secondary); font-size: var(--font-size-sm); }
.loading { text-align: center; padding: var(--spacing-3xl); color: var(--color-text-secondary); }

/* Tabs */
.tabs-nav {
  display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl);
  border-bottom: 2px solid var(--color-border); padding-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 16px; border: none; background: none; border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-secondary);
  cursor: pointer; transition: all 0.2s; border-bottom: 2px solid transparent; margin-bottom: -2px;
}

.tab-btn:hover { color: var(--color-text-primary); background: var(--color-bg-secondary); }
.tab-btn.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: 600; }

.tab-content { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Sections */
.settings-section {
  margin-bottom: var(--spacing-2xl); background: white;
  border-radius: var(--radius-lg); padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.section-heading {
  font-size: 1.1rem; font-weight: 600; color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

/* Photos */
.photos-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--spacing-lg);
}

.photo-card { border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; transition: box-shadow 0.2s; }
.photo-card:hover { box-shadow: var(--shadow-md); }
.photo-preview { position: relative; height: 150px; cursor: pointer; overflow: hidden; background: var(--color-gray-100); }
.photo-img { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--spacing-sm); color: var(--color-text-secondary); }
.photo-placeholder-icon { font-size: 2rem; opacity: 0.5; }
.photo-placeholder-text { font-size: var(--font-size-xs); text-align: center; padding: 0 var(--spacing-sm); }
.photo-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 500; font-size: var(--font-size-sm); opacity: 0; transition: opacity 0.2s; }
.photo-preview:hover .photo-overlay { opacity: 1; }
.photo-info { padding: var(--spacing-sm) var(--spacing-md); }
.photo-label { font-size: var(--font-size-xs); font-weight: 500; }
.photo-url-input { padding: 0 var(--spacing-md) var(--spacing-sm); }
.photo-actions { padding: 0 var(--spacing-md) var(--spacing-sm); display: flex; gap: var(--spacing-sm); }

/* Icons */
.icons-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-md);
}

.icon-card {
  display: flex; align-items: flex-start; gap: var(--spacing-md); padding: var(--spacing-md);
  border: 1px solid var(--color-border); border-radius: var(--radius-md); transition: box-shadow 0.2s;
}

.icon-card:hover { box-shadow: var(--shadow-md); }

.icon-preview {
  width: 56px; height: 56px; min-width: 56px; background: var(--color-bg-secondary);
  border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; position: relative; cursor: pointer; overflow: hidden;
}

.icon-img {
  width: 100%; height: 100%; object-fit: contain; padding: 4px;
}

.icon-emoji { line-height: 1; }

.icon-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.65rem; font-weight: 500;
  opacity: 0; transition: opacity 0.2s;
}

.icon-preview:hover .icon-overlay { opacity: 1; }

.icon-details { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }

.icon-info { display: flex; flex-direction: column; }
.icon-label { font-weight: 600; font-size: var(--font-size-sm); color: var(--color-text-primary); }
.icon-hint { font-size: var(--font-size-xs); color: var(--color-text-muted); }

.icon-actions { display: flex; gap: var(--spacing-sm); }

/* Texts */
.texts-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: var(--spacing-md);
}

.text-field { display: flex; flex-direction: column; gap: 4px; }
.text-label { font-weight: 600; font-size: var(--font-size-sm); color: var(--color-text-primary); }

.url-input, .text-input {
  width: 100%; padding: 8px 10px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: var(--font-size-sm);
  transition: border-color 0.2s; font-family: inherit;
}

.url-input:focus, .text-input:focus { outline: none; border-color: var(--color-primary); }
.text-input { resize: vertical; min-height: 60px; }

/* Buttons */
.upload-btn, .remove-btn {
  flex: 1; padding: 6px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: var(--font-size-xs);
  cursor: pointer; text-align: center; transition: background 0.2s;
}

.upload-btn { background: var(--color-bg-secondary); color: var(--color-text-primary); }
.upload-btn:hover { background: var(--color-gray-200); }
.remove-btn { background: white; color: var(--color-error); }
.remove-btn:hover { background: #fee2e2; }

.save-bar {
  position: sticky; bottom: 0; background: white; padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end;
  margin: 0 calc(-1 * var(--spacing-lg)); margin-top: var(--spacing-lg);
}

.btn { padding: var(--spacing-sm) var(--spacing-xl); border-radius: var(--radius-md); font-weight: 600; font-size: var(--font-size-sm); border: none; cursor: pointer; transition: all 0.2s; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-dark); }

@media (max-width: 768px) {
  .photos-grid { grid-template-columns: 1fr; }
  .icons-grid { grid-template-columns: 1fr; }
  .texts-grid { grid-template-columns: 1fr; }
}
</style>
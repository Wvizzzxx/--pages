<template>
  <div class="admin-photo-editor" v-if="isAdmin">
    <div class="editor-trigger" @click.stop="openEditor">
      <span class="editor-icon">✏️</span>
      <span class="editor-label">Изменить фото</span>
    </div>

    <!-- Модалка редактирования -->
    <Teleport to="body">
      <div v-if="showModal" class="ape-overlay" @click.self="closeEditor">
        <div class="ape-modal">
          <div class="ape-header">
            <h3>📷 Изменить фото: {{ label }}</h3>
            <button class="ape-close" @click="closeEditor">✕</button>
          </div>
          <div class="ape-body">
            <!-- Текущее фото -->
            <div v-if="currentValue" class="ape-current">
              <img :src="currentValue" alt="Текущее фото" />
            </div>

            <!-- Загрузка файла -->
            <div class="ape-upload">
              <label class="ape-upload-btn">
                📁 Загрузить файл с компьютера
                <input type="file" accept="image/*" style="display: none" @change="handleFile" />
              </label>
            </div>

            <!-- Вставка ссылки -->
            <div class="ape-url-section">
              <label>Или вставьте ссылку на фото:</label>
              <input
                v-model="urlInput"
                type="text"
                class="ape-url-input"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div v-if="uploading" class="ape-loading">Загрузка...</div>
            <div v-if="error" class="ape-error">{{ error }}</div>
          </div>
          <div class="ape-footer">
            <button class="ape-btn ape-btn-cancel" @click="closeEditor">Отмена</button>
            <button
              class="ape-btn ape-btn-save"
              :disabled="uploading"
              @click="saveUrl"
            >
              {{ uploading ? 'Загрузка...' : 'Сохранить' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{
  settingKey: string;
  label: string;
}>();

const emit = defineEmits<{
  saved: [url: string];
}>();

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const showModal = ref(false);
const currentValue = ref('');
const urlInput = ref('');
const uploading = ref(false);
const error = ref('');

function openEditor() {
  // Load current value
  fetch(`/api/settings/${props.settingKey}`)
    .then((r) => r.json())
    .then((json) => {
      currentValue.value = json.data || '';
      urlInput.value = json.data || '';
    })
    .catch(() => {});
  showModal.value = true;
  document.body.style.overflow = 'hidden';
}

function closeEditor() {
  showModal.value = false;
  document.body.style.overflow = '';
}

async function handleFile(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  uploading.value = true;
  error.value = '';

  try {
    const formData = new FormData();
    formData.append('image', target.files[0]);

    const token = authStore.token;
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();
    if (result.success && result.data) {
      const url = result.data.url;
      await saveSetting(url);
      currentValue.value = url;
      urlInput.value = url;
      emit('saved', url);
    } else {
      error.value = 'Ошибка загрузки файла';
    }
  } catch (e) {
    error.value = 'Ошибка загрузки файла';
  } finally {
    uploading.value = false;
    target.value = '';
  }
}

async function saveUrl() {
  if (!urlInput.value.trim()) {
    error.value = 'Введите ссылку на фото';
    return;
  }

  uploading.value = true;
  error.value = '';

  try {
    await saveSetting(urlInput.value.trim());
    currentValue.value = urlInput.value.trim();
    emit('saved', urlInput.value.trim());
    closeEditor();
  } catch (e) {
    error.value = 'Ошибка сохранения';
  } finally {
    uploading.value = false;
  }
}

async function saveSetting(url: string) {
  const token = authStore.token;
  const response = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      settings: [
        {
          key: props.settingKey,
          value: url,
          label: props.label,
          section: 'photo',
        },
      ],
    }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Ошибка сохранения');
  }
}
</script>

<style scoped>
.admin-photo-editor {
  position: relative;
  display: inline-block;
}

.editor-trigger {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  backdrop-filter: blur(4px);
}

.editor-trigger:hover {
  background: rgba(0, 0, 0, 0.8);
}

.editor-icon { font-size: 0.85rem; }

/* Modal */
.ape-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.ape-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
}

.ape-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.ape-header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.ape-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6b7280;
}

.ape-body { padding: 20px; }

.ape-current {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.ape-current img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.ape-upload { margin-bottom: 16px; }

.ape-upload-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: border-color 0.2s, background 0.2s;
}

.ape-upload-btn:hover {
  border-color: #1a5f7a;
  background: #e8f4f8;
}

.ape-url-section { margin-bottom: 16px; }

.ape-url-section label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
}

.ape-url-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.ape-url-input:focus {
  outline: none;
  border-color: #1a5f7a;
}

.ape-loading {
  text-align: center;
  padding: 8px;
  color: #6b7280;
  font-size: 0.85rem;
}

.ape-error {
  padding: 8px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.ape-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

.ape-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.ape-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ape-btn-cancel { background: #f3f4f6; color: #374151; }
.ape-btn-cancel:hover { background: #e5e7eb; }
.ape-btn-save { background: #1a5f7a; color: white; }
.ape-btn-save:hover:not(:disabled) { background: #154d63; }
</style>
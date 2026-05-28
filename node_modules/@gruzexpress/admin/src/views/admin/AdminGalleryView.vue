<template>
  <div class="admin-gallery">
    <div class="page-header">
      <h1>📷 Управление галереей</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        + Добавить фото
      </button>
    </div>

    <!-- Фильтры -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск..."
        class="filter-input"
        @input="debouncedLoad"
      />
      <select v-model="filterCategory" class="filter-select" @change="loadItems">
        <option value="">Все категории</option>
        <option value="general">Общее</option>
        <option value="fleet">Наш автопарк</option>
        <option value="delivery">Доставка</option>
        <option value="office">Офис</option>
        <option value="warehouse">Склад</option>
        <option value="city">Городские перевозки</option>
        <option value="intercity">Межгородские перевозки</option>
      </select>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="loading">Загрузка...</div>

    <!-- Таблица -->
    <div v-else class="gallery-table-wrapper">
      <table class="gallery-table">
        <thead>
          <tr>
            <th>Фото</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Статус</th>
            <th>Порядок</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="items.length === 0">
            <td colspan="6" class="empty-cell">Фотографии не найдены</td>
          </tr>
          <tr v-for="item in items" :key="item._id">
            <td>
              <img :src="item.imageUrl" :alt="item.title" class="table-thumb" />
            </td>
            <td>
              <div class="item-title">{{ item.title }}</div>
              <div v-if="item.description" class="item-desc">{{ item.description }}</div>
            </td>
            <td>
              <span class="category-badge">{{ categoryLabels[item.category] || item.category }}</span>
            </td>
            <td>
              <span class="status-badge" :class="item.isActive ? 'active' : 'inactive'">
                {{ item.isActive ? 'Активно' : 'Скрыто' }}
              </span>
            </td>
            <td>{{ item.sortOrder }}</td>
            <td>
              <div class="actions">
                <button class="btn-icon" title="Редактировать" @click="openEditModal(item)">✏️</button>
                <button class="btn-icon" title="Удалить" @click="confirmDelete(item)">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагинация -->
    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">← Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">Вперёд →</button>
    </div>

    <!-- Модальное окно создания/редактирования -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ editingItem ? 'Редактировать фото' : 'Добавить фото' }}</h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <div class="modal-body">
            <!-- Загрузка изображения -->
            <div class="form-group">
              <label>Изображение *</label>
              <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleFileSelect"
                />
                <div v-if="previewUrl" class="upload-preview">
                  <img :src="previewUrl" alt="Preview" />
                  <button class="remove-preview" @click.stop="removePreview">✕</button>
                </div>
                <div v-else class="upload-placeholder">
                  <span class="upload-icon">📷</span>
                  <span>Нажмите или перетащите файл</span>
                  <span class="upload-hint">PNG, JPG, WebP до 5MB</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Название *</label>
              <input v-model="form.title" type="text" class="form-input" placeholder="Название фото" />
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="form.description" class="form-textarea" placeholder="Описание фото" rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Категория</label>
                <select v-model="form.category" class="form-select">
                  <option value="general">Общее</option>
                  <option value="fleet">Наш автопарк</option>
                  <option value="delivery">Доставка</option>
                  <option value="office">Офис</option>
                  <option value="warehouse">Склад</option>
                  <option value="city">Городские перевозки</option>
                  <option value="intercity">Межгородские перевозки</option>
                </select>
              </div>

              <div class="form-group">
                <label>Порядок сортировки</label>
                <input v-model.number="form.sortOrder" type="number" class="form-input" min="0" />
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="form.isActive" type="checkbox" />
                Активно (отображается на сайте)
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Отмена</button>
            <button class="btn btn-primary" :disabled="saving || !form.title" @click="saveItem">
              {{ saving ? 'Сохранение...' : (editingItem ? 'Обновить' : 'Создать') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Подтверждение удаления -->
    <Teleport to="body">
      <div v-if="deletingItem" class="modal-overlay" @click.self="deletingItem = null">
        <div class="modal modal-small">
          <div class="modal-header">
            <h2>Удалить фото?</h2>
            <button class="modal-close" @click="deletingItem = null">✕</button>
          </div>
          <div class="modal-body">
            <p>Вы уверены, что хотите удалить «{{ deletingItem.title }}»?</p>
            <p class="warning-text">Это действие нельзя отменить.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="deletingItem = null">Отмена</button>
            <button class="btn btn-danger" :disabled="deleting" @click="deleteItem">
              {{ deleting ? 'Удаление...' : 'Удалить' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GalleryItem, CreateGalleryDto } from '@repo/types';
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem, uploadImage } from '../../api/gallery';

const categoryLabels: Record<string, string> = {
  general: 'Общее',
  fleet: 'Наш автопарк',
  delivery: 'Доставка',
  office: 'Офис',
  warehouse: 'Склад',
  city: 'Городские перевозки',
  intercity: 'Межгородские перевозки',
};

const items = ref<GalleryItem[]>([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const filterCategory = ref('');

const showModal = ref(false);
const editingItem = ref<GalleryItem | null>(null);
const deletingItem = ref<GalleryItem | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref('');

const form = ref<CreateGalleryDto & { isActive: boolean }>({
  title: '',
  description: '',
  imageUrl: '',
  category: 'general',
  sortOrder: 0,
  isActive: true,
});

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedLoad() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    loadItems();
  }, 300);
}

async function loadItems() {
  loading.value = true;
  try {
    const response = await getGalleryItems({
      page: currentPage.value,
      limit: 20,
      category: filterCategory.value || undefined,
      search: searchQuery.value || undefined,
    });
    if (response.success && response.data) {
      items.value = response.data.data;
      totalPages.value = response.data.totalPages;
    }
  } catch (error) {
    console.error('Error loading gallery:', error);
  } finally {
    loading.value = false;
  }
}

function goToPage(page: number) {
  currentPage.value = page;
  loadItems();
}

function openCreateModal() {
  editingItem.value = null;
  form.value = {
    title: '',
    description: '',
    imageUrl: '',
    category: 'general',
    sortOrder: 0,
    isActive: true,
  };
  selectedFile.value = null;
  previewUrl.value = '';
  showModal.value = true;
}

function openEditModal(item: GalleryItem) {
  editingItem.value = item;
  form.value = {
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  };
  selectedFile.value = null;
  previewUrl.value = item.imageUrl;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingItem.value = null;
  selectedFile.value = null;
  previewUrl.value = '';
}

function triggerUpload() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
}

function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    processFile(files[0]);
  }
}

function processFile(file: File) {
  if (!file.type.startsWith('image/')) return;
  if (file.size > 5 * 1024 * 1024) {
    alert('Файл слишком большой. Максимум 5MB.');
    return;
  }
  selectedFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function removePreview() {
  selectedFile.value = null;
  previewUrl.value = '';
  form.value.imageUrl = '';
}

async function saveItem() {
  if (!form.value.title) return;
  saving.value = true;
  try {
    // If there's a new file, upload it first
    if (selectedFile.value) {
      const uploadResult = await uploadImage(selectedFile.value);
      form.value.imageUrl = uploadResult.url;
    }

    if (!form.value.imageUrl) {
      alert('Пожалуйста, загрузите изображение');
      saving.value = false;
      return;
    }

    if (editingItem.value) {
      await updateGalleryItem(editingItem.value._id, form.value);
    } else {
      await createGalleryItem(form.value);
    }
    closeModal();
    loadItems();
  } catch (error) {
    console.error('Error saving:', error);
    alert('Ошибка сохранения');
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item: GalleryItem) {
  deletingItem.value = item;
}

async function deleteItem() {
  if (!deletingItem.value) return;
  deleting.value = true;
  try {
    await deleteGalleryItem(deletingItem.value._id);
    deletingItem.value = null;
    loadItems();
  } catch (error) {
    console.error('Error deleting:', error);
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  loadItems();
});
</script>

<style scoped>
.admin-gallery {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.filters {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.filter-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  background: white;
}

.loading {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
}

.gallery-table-wrapper {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.gallery-table {
  width: 100%;
  border-collapse: collapse;
}

.gallery-table th {
  text-align: left;
  padding: var(--spacing-md);
  background: var(--color-gray-50);
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
}

.gallery-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.table-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.item-title {
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.item-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.category-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.empty-cell {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-2xl) !important;
}

.actions {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-icon {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px 8px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.btn-icon:hover {
  background: var(--color-gray-100);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.pagination button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: white;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: background var(--transition-fast);
}

.pagination button:hover:not(:disabled) {
  background: var(--color-gray-100);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Buttons */
.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--font-size-sm);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-gray-200);
}

.btn-danger {
  background: var(--color-error);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: white;
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* Form */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-weight: 500;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

/* Upload */
.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  text-align: center;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.upload-area:hover {
  border-color: var(--color-primary);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.upload-icon {
  font-size: 2rem;
}

.upload-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.upload-preview {
  position: relative;
  display: inline-block;
}

.upload-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: var(--radius-md);
}

.remove-preview {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.warning-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
</style>
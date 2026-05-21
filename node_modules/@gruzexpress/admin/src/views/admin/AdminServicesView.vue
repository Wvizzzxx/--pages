<template>
  <div class="admin-services-view">
    <div class="view-header">
      <h1>Управление услугами</h1>
      <button class="btn-add" @click="openModal()">Добавить услугу</button>
    </div>

    <div v-if="loading" class="loading">
      <p>Загрузка услуг...</p>
    </div>

    <div v-else-if="services.length" class="services-table">
      <table>
        <thead>
          <tr>
            <th>Изображение</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Цена</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service._id">
            <td>
              <div class="service-thumb">
                <img v-if="service.image" :src="service.image" alt="preview" />
                <span v-else class="no-image">Нет фото</span>
              </div>
            </td>
            <td>{{ service.title }}</td>
            <td class="desc-cell">{{ service.description }}</td>
            <td>{{ formatPrice(service.price) }}</td>
            <td>
              <span
                :class="[
                  'status-badge',
                  service.isActive ? 'active' : 'inactive',
                ]"
              >
                {{ service.isActive ? "Активна" : "Неактивна" }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="btn-edit" @click="editService(service)">
                Изменить
              </button>
              <button class="btn-delete" @click="confirmDelete(service._id)">
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      <p>Услуг пока нет. Добавьте первую!</p>
    </div>

    <!-- Модальное окно создания/редактирования услуги -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingId ? "Редактировать услугу" : "Новая услуга" }}</h2>
          <button class="modal-close" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveService" class="modal-form">
          <div class="form-group">
            <label class="form-label">Название</label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Slug</label>
            <input
              v-model="form.slug"
              type="text"
              class="form-input"
              placeholder="urban-delivery"
            />
            <small
              >Используется для URL (например: /services/urban-delivery)</small
            >
          </div>

          <div class="form-group">
            <label class="form-label">Краткое описание</label>
            <textarea
              v-model="form.description"
              class="form-textarea"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Полное описание</label>
            <textarea
              v-model="form.fullDescription"
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Цена</label>
            <input
              v-model.number="form.price"
              type="number"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Единица цены</label>
            <select v-model="form.priceUnit" class="form-input">
              <option value="fix">Фиксированная цена</option>
              <option value="per_km">За км</option>
              <option value="per_kg">За кг</option>
              <option value="per_hour">За час</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Изображение</label>
            <input
              v-model="form.image"
              type="text"
              class="form-input"
              placeholder="Вставьте ссылку на изображение..."
            />
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="form-file"
              style="margin-top: 8px"
            />
            <div v-if="previewUrl" class="image-preview">
              <img :src="previewUrl" alt="preview" />
              <button type="button" class="remove-image" @click="clearImage">
                ×
              </button>
            </div>
            <div v-else-if="form.image && !previewUrl" class="image-preview">
              <img :src="form.image" alt="existing" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Особенности (через Enter)</label>
            <textarea
              v-model="featuresText"
              class="form-textarea"
              rows="4"
              placeholder="Быстрая доставка&#10;Страхование груза"
            ></textarea>
          </div>

          <div class="form-group form-checkbox">
            <label>
              <input v-model="form.isActive" type="checkbox" />
              Активна
            </label>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-save" :disabled="submitting">
              {{ submitting ? "Сохранение..." : "Сохранить" }}
            </button>
            <button type="button" class="btn-cancel" @click="closeModal">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>

    <NotificationToast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Service } from "@repo/types";
import { useAuthStore } from "../../stores/auth";
import { useNotifications } from "../../composables/useNotifications";
import { useConfirmDialog } from "../../composables/useConfirmDialog";
import {
  createService,
  updateService,
  deleteService,
  uploadImage as uploadImageApi,
} from "../../api/services";
import NotificationToast from "../../components/NotificationToast.vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";

const authStore = useAuthStore();
const { success, error: notifyError } = useNotifications();
const { openConfirm } = useConfirmDialog();

const services = ref<Service[]>([]);
const loading = ref(true);
const showModal = ref(false);
const editingId = ref<string | null>(null);
const submitting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const imageFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const featuresText = ref("");

const form = ref({
  title: "",
  slug: "",
  description: "",
  fullDescription: "",
  price: 0,
  priceUnit: "fix",
  image: "",
  isActive: true,
});

onMounted(loadServices);

async function loadServices() {
  loading.value = true;
  try {
    const res = await fetch("/api/services/admin/all", {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    const data = await res.json();
    if (data.success) services.value = data.data || [];
  } catch (e) {
    console.error("Ошибка загрузки услуг:", e);
    notifyError("Ошибка загрузки услуг");
  } finally {
    loading.value = false;
  }
}

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function openModal() {
  editingId.value = null;
  form.value = {
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    price: 0,
    priceUnit: "fix",
    image: "",
    isActive: true,
  };
  featuresText.value = "";
  imageFile.value = null;
  previewUrl.value = null;
  showModal.value = true;
}

function editService(service: Service) {
  editingId.value = service._id;
  form.value = {
    title: service.title,
    slug: service.slug,
    description: service.description,
    fullDescription: service.fullDescription,
    price: service.price,
    priceUnit: service.priceUnit,
    image: service.image,
    isActive: service.isActive,
  };
  featuresText.value = (service.features || []).join("\n");
  imageFile.value = null;
  previewUrl.value = service.image || null;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingId.value = null;
  imageFile.value = null;
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    imageFile.value = input.files[0];
    previewUrl.value = URL.createObjectURL(input.files[0]);
  }
}

function clearImage() {
  imageFile.value = null;
  form.value.image = "";
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

async function uploadImage(): Promise<string> {
  if (!imageFile.value) return form.value.image;
  try {
    const response = await uploadImageApi(imageFile.value);
    return response.url || "";
  } catch (e: any) {
    notifyError(e?.response?.data?.message || "Ошибка загрузки изображения");
    return "";
  }
}

async function saveService() {
  submitting.value = true;
  try {
    let imageUrl = form.value.image;
    if (imageFile.value) {
      imageUrl = await uploadImage();
    }

    const features = featuresText.value
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const body = {
      title: form.value.title,
      slug: form.value.slug,
      description: form.value.description,
      fullDescription: form.value.fullDescription,
      price: form.value.price,
      priceUnit: form.value.priceUnit,
      image: imageUrl,
      features,
      isActive: form.value.isActive,
    };

    if (editingId.value) {
      await updateService(editingId.value, body as any);
      success("Услуга успешно обновлена");
    } else {
      await createService(body as any);
      success("Услуга успешно создана");
    }

    closeModal();
    await loadServices();
  } catch (e: any) {
    notifyError(e?.response?.data?.message || "Ошибка сохранения услуги");
  } finally {
    submitting.value = false;
  }
}

async function confirmDelete(id: string) {
  const confirmed = await openConfirm(
    "Удалить услугу?",
    "Это действие нельзя отменить",
  );
  if (!confirmed) return;
  try {
    await deleteService(id);
    await loadServices();
    success("Услуга удалена");
  } catch (e: any) {
    notifyError(e?.response?.data?.message || "Ошибка удаления услуги");
  }
}
</script>

<style scoped>
.admin-services-view {
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.view-header h1 {
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.btn-add {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-success);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
}

.loading,
.empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.services-table {
  overflow-x: auto;
}

.services-table table {
  width: 100%;
  border-collapse: collapse;
}

.services-table th,
.services-table td {
  padding: var(--spacing-sm) var(--spacing-xs);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.services-table th {
  background: var(--color-bg-secondary);
  font-weight: 600;
  color: var(--color-text-primary);
}

.service-thumb {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}

.desc-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
}

.active {
  background: #d1fae5;
  color: #065f46;
}

.inactive {
  background: #e5e7eb;
  color: #374151;
}

.actions-cell {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-edit {
  padding: 4px 8px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-delete {
  padding: 4px 8px;
  background: var(--color-error);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.8rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.modal-header h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.form-input,
.form-textarea,
.form-file {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
}

.form-textarea {
  resize: vertical;
}

.form-file {
  padding: var(--spacing-sm);
}

.form-checkbox label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.image-preview {
  margin-top: var(--spacing-sm);
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: var(--radius-sm);
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: var(--color-error);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.btn-save {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-success);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
</style>

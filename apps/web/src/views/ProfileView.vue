<template>
  <main class="profile-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <h1 class="page-title">Личный кабинет</h1>

      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="user-card">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-details">
              <h2>{{ authStore.user?.name }}</h2>
              <p class="user-email">{{ authStore.user?.email }}</p>
              <BaseBadge :variant="authStore.isAdmin ? 'success' : 'gray'">
                {{ authStore.isAdmin ? "Администратор" : "Пользователь" }}
              </BaseBadge>
            </div>
          </div>

          <button class="btn-logout" @click="handleLogout">
            Выйти из аккаунта
          </button>
        </div>

        <div class="profile-main">
          <!-- Редактирование профиля -->
          <div class="profile-section">
            <h2>Редактирование профиля</h2>

            <form @submit.prevent="handleUpdateProfile" class="profile-form">
              <BaseInput
                v-model="profileForm.values.name"
                label="Имя"
                placeholder="Ваше имя"
                :required="true"
                :error="profileForm.errors.name"
                @blur="profileForm.markTouched('name')"
              />

              <BaseInput
                v-model="profileForm.values.phone"
                label="Телефон"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                :error="profileForm.errors.phone"
                @blur="profileForm.markTouched('phone')"
              />

              <BaseButton type="submit" :disabled="profileUpdating" class="submit-btn">
                {{ profileUpdating ? 'Сохранение...' : 'Сохранить изменения' }}
              </BaseButton>
            </form>
          </div>

          <!-- Смена пароля -->
          <div class="profile-section">
            <h2>Смена пароля</h2>

            <form @submit.prevent="handleChangePassword" class="profile-form">
              <BaseInput
                v-model="passwordForm.values.currentPassword"
                label="Текущий пароль"
                type="password"
                placeholder="Введите текущий пароль"
                :required="true"
                :error="passwordForm.errors.currentPassword"
                @blur="passwordForm.markTouched('currentPassword')"
              />

              <BaseInput
                v-model="passwordForm.values.newPassword"
                label="Новый пароль"
                type="password"
                placeholder="Минимум 6 символов"
                :required="true"
                :error="passwordForm.errors.newPassword"
                @blur="passwordForm.markTouched('newPassword')"
              />

              <BaseInput
                v-model="passwordForm.values.confirmPassword"
                label="Подтверждение пароля"
                type="password"
                placeholder="Повторите новый пароль"
                :required="true"
                :error="passwordForm.errors.confirmPassword"
                @blur="passwordForm.markTouched('confirmPassword')"
              />

              <BaseButton type="submit" :disabled="passwordUpdating" class="submit-btn">
                {{ passwordUpdating ? 'Обновление...' : 'Изменить пароль' }}
              </BaseButton>
            </form>
          </div>

          <!-- Заказы -->
          <div class="orders-section">
            <h2>Мои заказы</h2>

            <div v-if="ordersLoading" class="orders-loading">
              <BaseLoader text="Загрузка заказов..." />
            </div>

            <div v-else-if="orders.length" class="orders-list">
              <div v-for="order in orders" :key="order._id" class="order-card">
                <div class="order-header">
                  <span class="order-id">Заказ #{{ order._id.slice(-6) }}</span>
                  <BaseBadge :variant="getStatusVariant(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </BaseBadge>
                </div>

                <div class="order-details">
                  <div class="order-row">
                    <span class="order-label">Услуга:</span>
                    <span class="order-value">{{ getServiceTitle(order.serviceId) }}</span>
                  </div>
                  <div class="order-row" v-if="order.address">
                    <span class="order-label">Адрес:</span>
                    <span class="order-value">{{ order.address }}</span>
                  </div>
                  <div class="order-row" v-if="order.comment">
                    <span class="order-label">Комментарий:</span>
                    <span class="order-value">{{ order.comment }}</span>
                  </div>
                  <div class="order-row">
                    <span class="order-label">Дата:</span>
                    <span class="order-value">{{ formatDate(order.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="orders-empty">
              <p>У вас пока нет заказов.</p>
              <router-link to="/services" class="btn-services">Заказать услугу</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NotificationToast />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import BaseLoader from '@repo/ui/components/BaseLoader.vue';
import BaseBadge from '@repo/ui/components/BaseBadge.vue';
import BaseInput from '@repo/ui/components/BaseInput.vue';
import BaseButton from '@repo/ui/components/BaseButton.vue';
import NotificationToast from '../components/NotificationToast.vue';
import { useAuthStore } from '../stores/auth';
import { useFormValidation } from '../composables/useFormValidation';
import { useNotifications } from '../composables/useNotifications';
import { getMyOrders } from '../api/orders';
import type { BreadcrumbItem, Order, Service } from '@repo/types';

const router = useRouter();
const authStore = useAuthStore();
const { success, error } = useNotifications();

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Профиль' },
];

const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || '?';
});

const orders = ref<Order[]>([]);
const ordersLoading = ref(true);
const services = ref<Service[]>([]);

// Форма редактирования профиля
const profileForm = useFormValidation(
  {
    name: authStore.user?.name || '',
    phone: authStore.user?.phone || '',
  },
  {
    name: [
      { type: 'required', message: 'Введите имя' },
      { type: 'minLength', value: 2, message: 'Минимум 2 символа' },
    ],
    phone: [
      { type: 'phone', message: 'Некорректный номер телефона' },
    ],
  }
);

const profileUpdating = ref(false);

// Форма смены пароля
const passwordForm = useFormValidation(
  {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  {
    currentPassword: [
      { type: 'required', message: 'Введите текущий пароль' },
    ],
    newPassword: [
      { type: 'required', message: 'Введите новый пароль' },
      { type: 'minLength', value: 6, message: 'Минимум 6 символов' },
    ],
    confirmPassword: [
      { type: 'required', message: 'Подтвердите пароль' },
      { type: 'match', field: 'newPassword', message: 'Пароли не совпадают' },
    ],
  }
);

const passwordUpdating = ref(false);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  await loadOrders();
  await loadServices();
});

async function loadOrders() {
  ordersLoading.value = true;
  try {
    const result = await getMyOrders();
    orders.value = result.orders || [];
  } catch (e) {
    console.error('Ошибка загрузки заказов:', e);
  } finally {
    ordersLoading.value = false;
  }
}

async function loadServices() {
  try {
    const response = await fetch('/api/services');
    const result = await response.json();
    if (result.success) {
      services.value = result.data || [];
    }
  } catch (e) {
    console.error('Ошибка загрузки услуг:', e);
  }
}

function getServiceTitle(serviceId?: string): string {
  if (!serviceId) return 'Не указана';
  const service = services.value.find((s) => s._id === serviceId);
  return service?.title || 'Услуга удалена';
}

function getStatusVariant(status: string): 'primary' | 'gray' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'pending': return 'warning';
    case 'in_progress': return 'primary';
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    default: return 'gray';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Ожидает';
    case 'in_progress': return 'В работе';
    case 'completed': return 'Выполнен';
    case 'cancelled': return 'Отменён';
    default: return status;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function handleUpdateProfile() {
  if (!profileForm.validate()) {
    return;
  }

  profileUpdating.value = true;

  try {
    const response = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: profileForm.values.name,
        phone: profileForm.values.phone,
      }),
    });

    const result = await response.json();

    if (result.success) {
      success('Профиль успешно обновлён');
      await authStore.fetchMe();
    } else {
      error(result.message || 'Ошибка при обновлении профиля');
    }
  } catch (e: any) {
    error(e?.response?.data?.message || 'Произошла ошибка');
  } finally {
    profileUpdating.value = false;
  }
}

async function handleChangePassword() {
  if (!passwordForm.validate()) {
    return;
  }

  passwordUpdating.value = true;

  try {
    const response = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        currentPassword: passwordForm.values.currentPassword,
        newPassword: passwordForm.values.newPassword,
      }),
    });

    const result = await response.json();

    if (result.success) {
      success('Пароль успешно изменён');
      passwordForm.reset();
    } else {
      error(result.message || 'Ошибка при смене пароля');
    }
  } catch (e: any) {
    error(e?.response?.data?.message || 'Произошла ошибка');
  } finally {
    passwordUpdating.value = false;
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>

<style scoped>
.profile-view {
  padding: var(--spacing-xl) 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.profile-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-xl);
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.profile-section h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 400px;
}

.submit-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1rem;
  align-self: flex-start;
}

.user-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-details h2 {
  font-size: 1.25rem;
  margin-bottom: 2px;
  color: var(--color-text-primary);
}

.user-email {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.btn-logout {
  padding: var(--spacing-md);
  background: var(--color-error);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  transition: opacity var(--transition-base);
}

.btn-logout:hover {
  opacity: 0.9;
}

.orders-section h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.orders-loading {
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.orders-empty {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.orders-empty p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.btn-services {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-secondary);
  color: var(--color-white);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: background var(--transition-base);
}

.btn-services:hover {
  background: var(--color-secondary-dark);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.order-id {
  font-weight: 600;
  color: var(--color-text-primary);
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.order-row {
  display: flex;
  gap: var(--spacing-sm);
}

.order-label {
  min-width: 120px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.order-value {
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-form {
    max-width: 100%;
  }
}
</style>
<template>
  <main class="profile-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <div v-if="!authStore.isAuthenticated" class="profile-guest">
        <div class="guest-card">
          <div class="guest-icon">👤</div>
          <h2>Войдите в аккаунт</h2>
          <p>Чтобы видеть свои заказы и управлять профилем</p>
          <router-link to="/login" class="btn-primary">Войти</router-link>
        </div>
      </div>

      <template v-else>
        <!-- Hero профиля -->
        <div class="profile-hero">
          <div class="profile-avatar">
            <span class="avatar-letter">{{ avatarLetter }}</span>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ authStore.user?.name }}</h1>
            <p class="profile-email">{{ authStore.user?.email }}</p>
            <span class="profile-role" :class="authStore.isAdmin ? 'role-admin' : 'role-user'">
              {{ authStore.isAdmin ? '👑 Администратор' : '👤 Пользователь' }}
            </span>
            <span v-if="!authStore.user?.emailVerified" class="email-badge email-unverified" @click="resendVerification">
              ✉️ Email не подтверждён (нажмите для отправки)
            </span>
            <span v-else class="email-badge email-verified">✅ Email подтверждён</span>
          </div>
          <div class="profile-actions-hero">
            <button v-if="authStore.isAdmin" class="btn-admin" @click="goAdmin">
              ⚙️ Админ-панель
            </button>
            <button class="btn-logout" @click="handleLogout">Выйти</button>
          </div>
        </div>

        <!-- Скидочная система -->
        <div v-if="!authStore.isAdmin" class="discount-banner">
          <div class="discount-info">
            <div class="discount-icon">🎁</div>
            <div>
              <h3 class="discount-title">Ваша скидка: {{ authStore.user?.discount || 0 }}%</h3>
              <p class="discount-desc">{{ discountMessage }}</p>
            </div>
          </div>
          <div class="discount-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: discountProgress + '%' }"></div>
            </div>
            <div class="progress-labels">
              <span>0 заказов</span>
              <span>5 → 5%</span>
              <span>10 → 10%</span>
              <span>20 → 15%</span>
            </div>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="quick-actions">
          <router-link to="/order" class="quick-action-card">
            <span class="qa-icon">📦</span>
            <span class="qa-title">Новый заказ</span>
            <span class="qa-desc">Оформить заявку на перевозку</span>
          </router-link>
          <router-link to="/services" class="quick-action-card">
            <span class="qa-icon">🛠️</span>
            <span class="qa-title">Услуги</span>
            <span class="qa-desc">Посмотреть каталог услуг</span>
          </router-link>
          <router-link to="/contacts" class="quick-action-card">
            <span class="qa-icon">📞</span>
            <span class="qa-title">Связаться</span>
            <span class="qa-desc">Задать вопрос по телефону</span>
          </router-link>
        </div>

        <!-- Мои заказы -->
        <section class="orders-section">
          <h2 class="section-title">Мои заказы</h2>
          <div v-if="ordersLoading" class="loading-state">
            <div class="spinner"></div>
            <span>Загрузка заказов...</span>
          </div>
          <div v-else-if="orders.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>Заказов пока нет</h3>
            <p>Оформите первый заказ и он появится здесь</p>
            <router-link to="/order" class="btn-primary">Оформить заказ</router-link>
          </div>
          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order._id" class="order-card">
              <div class="order-header">
                <span class="order-id">#{{ order._id?.slice(-6).toUpperCase() }}</span>
                <span class="order-status" :class="`status-${order.status}`">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
              <div class="order-body">
                <div class="order-route">
                  <span>📍 {{ parseAddressFrom(order.address) }}</span>
                  <span class="route-arrow">→</span>
                  <span>📍 {{ parseAddressTo(order.address) }}</span>
                </div>
                <div class="order-meta">
                  <span v-if="order.createdAt">📅 {{ formatDate(order.createdAt) }}</span>
                  <span v-if="order.totalPrice">💰 {{ order.totalPrice.toLocaleString() }} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Поддержка -->
        <section class="support-section">
          <div class="support-card">
            <div class="support-icon">💬</div>
            <div class="support-text">
              <h3>Нужна помощь?</h3>
              <p>Свяжитесь с нами любым удобным способом</p>
            </div>
            <a href="tel:+78005553535" class="btn-primary">📞 Позвонить</a>
          </div>
        </section>
      </template>
    </div>
    <NotificationToast />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import NotificationToast from '../components/NotificationToast.vue';
import { useAuthStore } from '../stores/auth';
import { useNotifications } from '../composables/useNotifications';
import type { BreadcrumbItem } from '@repo/types';

const router = useRouter();
const authStore = useAuthStore();
const { success } = useNotifications();

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Профиль' },
];

const orders = ref<any[]>([]);
const ordersLoading = ref(true);

const avatarLetter = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || '?';
});

const discountMessage = computed(() => {
  const orders = (authStore.user as any)?.totalOrders || 0;
  const discount = (authStore.user as any)?.discount || 0;
  if (discount >= 15) return `Максимальная скидка! Спасибо за ${orders} заказов.`;
  if (discount >= 10) return `Отлично! Ещё ${20 - orders} заказов до максимальной скидки 15%.`;
  if (discount >= 5) return `Хорошо! Ещё ${10 - orders} заказов до скидки 10%.`;
  if (orders > 0) return `Ещё ${5 - orders} заказов до первой скидки 5%.`;
  return 'Оформляйте заказы и получайте скидки!';
});

const discountProgress = computed(() => {
  const orders = (authStore.user as any)?.totalOrders || 0;
  return Math.min((orders / 20) * 100, 100);
});

async function resendVerification() {
  try {
    await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authStore.user?.email }),
    });
    success('Письмо с подтверждением отправлено на почту');
  } catch {
    // silently fail
  }
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: '⏳ Ожидает',
    confirmed: '✅ Подтверждён',
    in_progress: '🚚 В пути',
    completed: '✅ Доставлен',
    delivered: '📦 Доставлен',
    cancelled: '❌ Отменён',
  };
  return labels[status] || status;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function parseAddressFrom(address: string | undefined): string {
  if (!address) return 'Не указано';
  const match = address.match(/^Откуда:\s*(.+?)\s*→/);
  if (match) return match[1].trim();
  return address;
}

function parseAddressTo(address: string | undefined): string {
  if (!address) return 'Не указано';
  const match = address.match(/→\s*Куда:\s*(.+)$/);
  if (match) return match[1].trim();
  return address;
}

function goAdmin() {
  window.open('/admin/dashboard', '_blank');
}

function handleLogout() {
  authStore.logout();
  success('Вы вышли из аккаунта');
  router.push('/');
}

async function loadOrders() {
  ordersLoading.value = true;
  try {
    const token = authStore.token;
    const response = await fetch('/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await response.json();
    if (json.success && json.data) {
      orders.value = Array.isArray(json.data) ? json.data : (json.data.orders || []);
    }
  } catch (e) {
    console.error('Error loading orders:', e);
  } finally {
    ordersLoading.value = false;
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadOrders();
  }
});
</script>

<style scoped>
.profile-view {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px);
}

/* Guest */
.profile-guest {
  display: flex;
  justify-content: center;
  padding: var(--spacing-3xl) 0;
}

.guest-card {
  text-align: center;
  padding: var(--spacing-3xl);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  max-width: 400px;
}

.guest-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.guest-card h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
}

.guest-card p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

/* Profile Hero */
.profile-hero {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, #0a1628, var(--color-primary));
  border-radius: var(--radius-xl);
  color: white;
  margin-bottom: var(--spacing-2xl);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-letter {
  font-size: 2rem;
  font-weight: 700;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.profile-email {
  opacity: 0.8;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
}

.profile-role {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-admin {
  background: rgba(230, 126, 34, 0.3);
  border: 1px solid rgba(230, 126, 34, 0.5);
}

.role-user {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-actions-hero {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.btn-admin, .btn-logout {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-admin {
  background: var(--color-secondary);
  color: white;
}

.btn-admin:hover { background: var(--color-secondary-dark); }

.btn-logout {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-xl);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  border: 1px solid var(--color-gray-100);
}

.quick-action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.qa-icon { font-size: 2rem; margin-bottom: var(--spacing-sm); }
.qa-title { font-weight: 700; font-size: 1rem; margin-bottom: 4px; }
.qa-desc { font-size: 0.8rem; color: var(--color-text-secondary); }

/* Email badges */
.email-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: var(--spacing-sm);
  margin-left: var(--spacing-sm);
}

.email-unverified {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #fbbf24;
  cursor: pointer;
}

.email-unverified:hover {
  background: rgba(245, 158, 11, 0.3);
}

.email-verified {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #6ee7b7;
}

/* Discount banner */
.discount-banner {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-100);
}

.discount-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.discount-icon { font-size: 2.5rem; }

.discount-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.discount-desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.progress-bar {
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

/* Orders */
.orders-section { margin-bottom: var(--spacing-2xl); }

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.loading-state, .empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
}

.empty-icon { font-size: 3rem; margin-bottom: var(--spacing-md); }
.empty-state h3 { margin-bottom: var(--spacing-sm); }

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin { to { transform: rotate(360deg); } }

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-100);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.order-id {
  font-weight: 700;
  font-family: monospace;
  color: var(--color-text-primary);
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-pending { background: #fef3c7; color: #92400e; }
.status-confirmed { background: #d1fae5; color: #065f46; }
.status-in_progress { background: #dbeafe; color: #1e40af; }
.status-completed { background: #d1fae5; color: #065f46; }
.status-delivered { background: #d1fae5; color: #065f46; }
.status-cancelled { background: #fee2e2; color: #991b1b; }

.order-route {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.route-arrow { color: var(--color-primary); font-weight: 700; }

.order-meta {
  display: flex;
  gap: var(--spacing-lg);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

/* Support */
.support-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.support-icon { font-size: 2.5rem; }
.support-text { flex: 1; }
.support-text h3 { margin-bottom: 4px; }
.support-text p { color: var(--color-text-secondary); font-size: 0.9rem; }

.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover { background: var(--color-primary-dark); }

@media (max-width: 768px) {
  .profile-hero { flex-direction: column; text-align: center; }
  .profile-actions-hero { width: 100%; }
  .btn-admin, .btn-logout { flex: 1; }
  .quick-actions { grid-template-columns: 1fr; }
  .support-card { flex-direction: column; text-align: center; }
}
</style>
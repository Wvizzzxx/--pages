<template>
  <div class="admin-dashboard">
    <h1 class="dashboard-title">Панель управления</h1>

    <div v-if="loading" class="dashboard-loading">
      <p>Загрузка данных...</p>
    </div>

    <template v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📦</span>
          <div class="stat-info">
            <span class="stat-value">{{ stats.orders }}</span>
            <span class="stat-label">Заявок</span>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">🛠️</span>
          <div class="stat-info">
            <span class="stat-value">{{ stats.services }}</span>
            <span class="stat-label">Услуг</span>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <div class="stat-info">
            <span class="stat-value">{{ stats.users }}</span>
            <span class="stat-label">Пользователей</span>
          </div>
        </div>
      </div>

      <section class="recent-orders">
        <h2>Последние заявки</h2>
        <div v-if="recentOrders.length" class="orders-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Услуга</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order._id">
                <td>#{{ order._id.slice(-6) }}</td>
                <td>{{ order.customerName || 'Не указано' }}</td>
                <td>{{ order.serviceName || 'Не указана' }}</td>
                <td>
                  <span :class="['status-badge', `status-${order.status}`]">
                    {{ statusLabels[order.status] }}
                  </span>
                </td>
                <td>{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-message">
          Заявок пока нет. Первая заявка появится после оформления.
        </div>
        <div class="recent-actions">
          <router-link to="/admin/orders" class="btn-link">Все заявки →</router-link>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Order } from '@repo/types';
import { getAllOrders } from '../../api/orders';
import { getAllServices } from '../../api/services';
import { getAllUsers } from '../../api/users';

const loading = ref(true);
const stats = ref({ orders: 0, services: 0, users: 0 });
const recentOrders = ref<Order[]>([]);

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  completed: 'Выполнен',
  cancelled: 'Отменён',
};

onMounted(async () => {
  await loadDashboard();
});

async function loadDashboard() {
  loading.value = true;
  try {
    const [ordersRes, servicesRes, usersRes] = await Promise.all([
      getAllOrders({ page: 1, limit: 5 }),
      getAllServices(),
      getAllUsers({ page: 1, limit: 1 }),
    ]);

    if (ordersRes.success && ordersRes.data) {
      const ordersData = ordersRes.data as any;
      const ordersList = ordersData.docs || ordersData.data || [];
      stats.value.orders = ordersData.total || ordersList.length;
      recentOrders.value = ordersList.slice(0, 5);
    }
    if (servicesRes.success && servicesRes.data) {
      const servicesData = servicesRes.data as any;
      const servicesList = servicesData.docs || servicesData.data || [];
      stats.value.services = servicesData.total || servicesList.length;
    }
    if (usersRes.success && usersRes.data) {
      const usersData = usersRes.data as any;
      stats.value.users = usersData.total || 0;
    }
  } catch (e) {
    console.error('Ошибка загрузки дашборда:', e);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
</script>

<style scoped>
.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.dashboard-loading {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.recent-orders {
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.recent-orders h2 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  background: var(--color-bg-secondary);
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.data-table td {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-in_progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.empty-message {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.recent-actions {
  margin-top: var(--spacing-md);
  text-align: right;
}

.btn-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-base);
}

.btn-link:hover {
  text-decoration: underline;
}
</style>
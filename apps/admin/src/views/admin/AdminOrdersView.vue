<template>
  <div class="admin-orders-view">
    <div class="view-header">
      <h1>Управление заявками</h1>
      <div class="header-actions">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по ID, клиенту..."
          class="search-input"
          @input="onSearch"
        />
        <select v-model="statusFilter" class="filter-select" @change="onFilterChange">
          <option value="">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="in_progress">В работе</option>
          <option value="completed">Выполнен</option>
          <option value="cancelled">Отменён</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Загрузка заявок...</p>
    </div>

    <div v-else-if="orders.length" class="orders-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Услуга</th>
            <th>Телефон</th>
            <th>Адрес</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id" class="order-row" @click="openOrderDetail(order)">
            <td>#{{ order._id.slice(-6) }}</td>
            <td>
              <span class="customer-name">{{ order.customerName || 'Не указано' }}</span>
            </td>
            <td>{{ order.serviceName || 'Не указана' }}</td>
            <td>{{ order.phone || '-' }}</td>
            <td class="address-cell">{{ order.address || '-' }}</td>
            <td @click.stop>
              <select
                :value="order.status"
                @change="updateStatus(order._id, ($event.target as HTMLSelectElement).value)"
                class="status-select"
              >
                <option value="pending">⏳ Ожидает</option>
                <option value="in_progress">🔄 В работе</option>
                <option value="completed">✅ Выполнен</option>
                <option value="cancelled">❌ Отменён</option>
              </select>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td class="actions-cell" @click.stop>
              <button @click="openOrderDetail(order)" class="btn-view">👁️</button>
              <button @click="confirmDelete(order._id)" class="btn-delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination
        v-model:current-page="pagination.page.value"
        v-model:items-per-page="pagination.limit.value"
        :total-pages="pagination.totalPages.value"
        :total-items="pagination.total.value"
      />
    </div>

    <div v-else class="empty">
      <p>Заявок не найдено</p>
    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedOrder" class="modal-overlay" @click.self="closeDetail">
        <div class="detail-modal">
          <div class="modal-header">
            <h2>Заявка #{{ selectedOrder._id.slice(-6) }}</h2>
            <button class="modal-close" @click="closeDetail">×</button>
          </div>
          <div class="modal-body">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Клиент:</span>
                <span class="detail-value">{{ selectedOrder.customerName || 'Не указано' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Телефон:</span>
                <span class="detail-value">
                  <a :href="'tel:' + selectedOrder.phone">{{ selectedOrder.phone || 'Не указан' }}</a>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Услуга:</span>
                <span class="detail-value">{{ selectedOrder.serviceName || 'Не указана' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Адрес:</span>
                <span class="detail-value">{{ selectedOrder.address || 'Не указан' }}</span>
              </div>
              <div class="detail-item" v-if="selectedOrder.comment">
                <span class="detail-label">Комментарий:</span>
                <span class="detail-value">{{ selectedOrder.comment }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Статус:</span>
                <span :class="['status-badge', `status-${selectedOrder.status}`]">
                  {{ statusLabels[selectedOrder.status] }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Дата создания:</span>
                <span class="detail-value">{{ formatDate(selectedOrder.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeDetail" class="btn-close">Закрыть</button>
          </div>
        </div>
      </div>
    </Transition>

    <NotificationToast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../../api/orders';
import { useNotifications } from '../../composables/useNotifications';
import { useConfirmDialog } from '../../composables/useConfirmDialog';
import { usePagination } from '../../composables/usePagination';
import Pagination from '../../components/Pagination.vue';
import NotificationToast from '../../components/NotificationToast.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';
import type { Order, OrderStatus } from '@repo/types';

const { success, error } = useNotifications();
const { openConfirm } = useConfirmDialog();
const pagination = usePagination(1, 10);

const orders = ref<Order[]>([]);
const loading = ref(true);
const statusFilter = ref('');
const searchQuery = ref('');
const selectedOrder = ref<Order | null>(null);

const statusLabels: Record<string, string> = {
  pending: '⏳ Ожидает',
  in_progress: '🔄 В работе',
  completed: '✅ Выполнен',
  cancelled: '❌ Отменён',
};

onMounted(async () => {
  await loadOrders();
});

async function loadOrders() {
  loading.value = true;
  try {
    const params = {
      ...pagination.getPaginationParams(),
      status: statusFilter.value || undefined,
    };

    const response = await getAllOrders(params);
    if (response.success && response.data) {
      const paginatedData = response.data as any;
      orders.value = (paginatedData.docs as Order[]) || [];
      pagination.total.value = response.data.total;
    }
  } catch (e) {
    console.error('Ошибка загрузки заявок:', e);
    error('Ошибка загрузки заявок');
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  pagination.setSearch(searchQuery.value);
  loadOrders();
}

function onFilterChange() {
  pagination.setPage(1);
  loadOrders();
}

async function updateStatus(orderId: string, status: string) {
  try {
    const response = await updateOrderStatus(orderId, status as OrderStatus);
    const order = orders.value.find((o) => o._id === orderId);
    if (order) order.status = status as Order['status'];
    success('Статус заявки обновлён');
  } catch (e: any) {
    error(e?.response?.data?.message || 'Ошибка обновления статуса');
  }
}

async function confirmDelete(orderId: string) {
  try {
    const confirmed = await openConfirm('Удалить заявку?', 'Это действие нельзя отменить');
    if (!confirmed) return;

    await deleteOrder(orderId);
    orders.value = orders.value.filter((o) => o._id !== orderId);
    if (selectedOrder.value?._id === orderId) {
      selectedOrder.value = null;
    }
    success('Заявка удалена');
  } catch (e: any) {
    error(e?.response?.data?.message || 'Ошибка удаления заявки');
  }
}

function openOrderDetail(order: Order) {
  selectedOrder.value = order;
}

function closeDetail() {
  selectedOrder.value = null;
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
</script>

<style scoped>
.admin-orders-view {
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

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.search-input,
.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.search-input {
  min-width: 200px;
}

.filter-select {
  cursor: pointer;
}

.loading, .empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.orders-table {
  overflow-x: auto;
}

.orders-table table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: var(--spacing-sm) var(--spacing-xs);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.orders-table th {
  background: var(--color-bg-secondary);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.orders-table td {
  color: var(--color-text-secondary);
}

.order-row {
  cursor: pointer;
  transition: background var(--transition-fast);
}

.order-row:hover {
  background: var(--color-bg-light);
}

.customer-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.address-cell {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-select {
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  cursor: pointer;
}

.actions-cell {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-view, .btn-delete {
  padding: 4px 8px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1rem;
  transition: opacity var(--transition-fast);
}

.btn-view {
  background: var(--color-bg-secondary);
}

.btn-view:hover {
  opacity: 0.8;
}

.btn-delete {
  background: transparent;
}

.btn-delete:hover {
  opacity: 0.7;
}

/* Detail Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.detail-modal {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
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
  padding: var(--spacing-xs);
}

.modal-body {
  padding: var(--spacing-lg);
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.detail-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: var(--color-text-primary);
}

.detail-value a {
  color: var(--color-primary);
  text-decoration: none;
}

.detail-value a:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
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

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: background var(--transition-fast);
}

.btn-close:hover {
  background: var(--color-gray-200);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
<template>
  <div class="admin-users-view">
    <div class="view-header">
      <h1>Управление пользователями</h1>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по имени или email..."
        @input="onSearch"
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">
      <p>Загрузка пользователей...</p>
    </div>

    <div v-else-if="users.length" class="users-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>#{{ user._id.slice(-6) }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select
                :value="user.role"
                @change="updateRole(user._id, ($event.target as HTMLSelectElement).value)"
                class="role-select"
                :disabled="user._id === authStore.user?._id"
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button
                v-if="user._id !== authStore.user?._id"
                class="btn-delete"
                @click="handleDeleteUser(user)"
              >
                Удалить
              </button>
              <span v-else class="current-user-badge">Вы</span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <Pagination
        v-model:current-page="page"
        v-model:items-per-page="limit"
        :total-pages="totalPages"
        :total-items="total"
        @update:current-page="loadUsers"
        @update:items-per-page="loadUsers"
      />
    </div>

    <div v-else class="empty">
      <p>Пользователей не найдено</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '@repo/types';
import { useAuthStore } from '../../stores/auth';
import { getAllUsers, updateUserRole, deleteUser as deleteUserApi } from '../../api/users';
import { useNotifications } from '../../composables/useNotifications';
import { useConfirmDialog } from '../../composables/useConfirmDialog';
import Pagination from '../../components/Pagination.vue';

const authStore = useAuthStore();
const { success, error } = useNotifications();
const { openConfirm } = useConfirmDialog();

const users = ref<User[]>([]);
const loading = ref(true);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const totalPages = ref(0);
const searchQuery = ref('');

onMounted(loadUsers);

async function loadUsers() {
  loading.value = true;
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      search: searchQuery.value || undefined,
    };
    const response = await getAllUsers(params);
    if (response.success && response.data) {
      const paginatedData = response.data as any;
      users.value = paginatedData.data || paginatedData.users || [];
      total.value = paginatedData.total || users.value.length;
      totalPages.value = paginatedData.totalPages || Math.ceil(total.value / limit.value);
    }
  } catch (e: any) {
    error('Ошибка', e.response?.data?.message || 'Не удалось загрузить пользователей');
  } finally {
    loading.value = false;
  }
}

let searchTimeout: ReturnType<typeof setTimeout>;
function onSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    loadUsers();
  }, 500);
}

async function updateRole(userId: string, role: string) {
  try {
    await updateUserRole(userId, role as 'admin' | 'user');
    const user = users.value.find((u) => u._id === userId);
    if (user) user.role = role as 'admin' | 'user';
    success('Роль обновлена', 'Роль пользователя успешно изменена');
  } catch (e: any) {
    error('Ошибка', e.response?.data?.message || 'Не удалось обновить роль');
  }
}

async function handleDeleteUser(user: User) {
  const confirmed = await openConfirm(
    'Удаление пользователя',
    `Вы уверены, что хотите удалить пользователя ${user.name}? Это действие нельзя отменить.`
  );
  
  if (!confirmed) return;
  
  try {
    await deleteUserApi(user._id);
    users.value = users.value.filter((u) => u._id !== user._id);
    total.value--;
    success('Пользователь удалён', `Пользователь ${user.name} успешно удалён`);
  } catch (e: any) {
    error('Ошибка', e.response?.data?.message || 'Не удалось удалить пользователя');
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
.admin-users-view {
  background: var(--color-bg-white, #ffffff);
  border-radius: var(--radius-md, 8px);
  padding: var(--spacing-lg, 24px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg, 24px);
}

.view-header h1 {
  font-size: 1.5rem;
  color: var(--color-text-primary, #111827);
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.loading, .empty {
  text-align: center;
  padding: var(--spacing-xl, 32px);
  color: var(--color-text-secondary, #6b7280);
}

.users-table {
  overflow-x: auto;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: var(--spacing-sm, 8px) var(--spacing-xs, 4px);
  text-align: left;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  font-size: 0.9rem;
}

.users-table th {
  background: var(--color-bg-secondary, #f9fafb);
  font-weight: 600;
  color: var(--color-text-primary, #111827);
}

.users-table td {
  color: var(--color-text-secondary, #6b7280);
}

.role-select {
  padding: 4px 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-sm, 4px);
  font-size: 0.85rem;
}

.role-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-delete {
  padding: 4px 8px;
  background: var(--color-error, #ef4444);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-delete:hover {
  opacity: 0.85;
}

.current-user-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-primary, #3b82f6);
  color: #fff;
  border-radius: var(--radius-sm, 4px);
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
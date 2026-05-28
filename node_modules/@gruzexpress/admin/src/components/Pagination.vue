<template>
  <div class="pagination" v-if="totalPages > 1">
    <div class="pagination-info">
      <span>Показано {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, totalItems) }} из {{ totalItems }}</span>
    </div>
    <div class="pagination-controls">
      <button
        class="pagination-btn"
        :disabled="currentPage <= 1"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        ← Назад
      </button>
      
      <template v-for="p in visiblePages" :key="p">
        <button
          v-if="typeof p === 'number'"
          class="pagination-btn"
          :class="{ active: p === currentPage }"
          @click="$emit('update:currentPage', p)"
        >
          {{ p }}
        </button>
        <span v-else class="pagination-ellipsis">...</span>
      </template>
      
      <button
        class="pagination-btn"
        :disabled="currentPage >= totalPages"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        Вперёд →
      </button>
    </div>
    <div class="pagination-per-page">
      <select :value="itemsPerPage" @change="$emit('update:itemsPerPage', Number(($event.target as HTMLSelectElement).value))">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <span>на странице</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}>();

defineEmits<{
  'update:currentPage': [page: number];
  'update:itemsPerPage': [perPage: number];
}>();

const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const pages: (number | string)[] = [];
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  
  return pages;
});
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: var(--color-primary, #3b82f6);
  border-color: var(--color-primary, #3b82f6);
  color: white;
}

.pagination-ellipsis {
  color: #9ca3af;
  padding: 0 4px;
}

.pagination-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.pagination-per-page select {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}
</style>
<template>
  <div class="base-table">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="{ width: col.width }">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="row.id || rowIndex">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="base-table-empty">
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string;
  label: string;
  width?: string;
}

interface Props {
  columns: Column[];
  data: Record<string, any>[];
  emptyText?: string;
}

withDefaults(defineProps<Props>(), {
  emptyText: 'Нет данных',
});
</script>

<style scoped>
.base-table {
  overflow-x: auto;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-white);
}

th {
  background: var(--color-gray-50);
  padding: var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  border-bottom: 2px solid var(--color-gray-200);
}

td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-gray-100);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: var(--color-gray-50);
}

.base-table-empty {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-gray-500);
}
</style>
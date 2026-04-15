<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumbs-list">
      <li v-for="(item, index) in items" :key="index" class="breadcrumbs-item">
        <router-link v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumbs-link">
          {{ item.label }}
        </router-link>
        <span v-else class="breadcrumbs-link breadcrumbs-link--active" aria-current="page">
          {{ item.label }}
        </span>
        <span v-if="index < items.length - 1" class="breadcrumbs-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@repo/types';

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<style scoped>
.breadcrumbs {
  margin-bottom: var(--spacing-lg);
}

.breadcrumbs-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-xs);
}

.breadcrumbs-link {
  color: var(--color-gray-600);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.breadcrumbs-link:hover {
  color: var(--color-primary);
}

.breadcrumbs-link--active {
  color: var(--color-primary);
  font-weight: 500;
}

.breadcrumbs-separator {
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
}
</style>
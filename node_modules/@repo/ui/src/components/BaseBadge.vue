<template>
  <span class="base-badge" :class="`base-badge--${variant}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray';
}

withDefaults(defineProps<Props>(), {
  variant: 'gray',
});
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.base-badge--primary {
  background: rgba(26, 95, 122, 0.1);
  color: var(--color-primary);
}

.base-badge--success {
  background: rgba(39, 174, 96, 0.1);
  color: var(--color-success);
}

.base-badge--warning {
  background: rgba(243, 156, 18, 0.1);
  color: var(--color-warning);
}

.base-badge--error {
  background: rgba(231, 76, 60, 0.1);
  color: var(--color-error);
}

.base-badge--info {
  background: rgba(52, 152, 219, 0.1);
  color: var(--color-info);
}

.base-badge--gray {
  background: rgba(108, 117, 125, 0.1);
  color: var(--color-gray-600);
}
</style>
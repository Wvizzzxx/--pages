<template>
  <button
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--block': block },
      { 'base-button--disabled': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-family-primary);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.base-button--sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

.base-button--md {
  padding: var(--spacing-sm) var(--spacing-xl);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

.base-button--lg {
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
}

.base-button--primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.base-button--primary:hover {
  background: var(--color-primary-dark);
}

.base-button--secondary {
  background: var(--color-secondary);
  color: var(--color-white);
}

.base-button--secondary:hover {
  background: var(--color-secondary-dark);
}

.base-button--outline {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.base-button--outline:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

.base-button--danger {
  background: var(--color-error);
  color: var(--color-white);
}

.base-button--danger:hover {
  background: #c0392b;
}

.base-button--ghost {
  background: transparent;
  color: var(--color-gray-700);
}

.base-button--ghost:hover {
  background: var(--color-gray-100);
}

.base-button--block {
  width: 100%;
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
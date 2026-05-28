<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-content" :class="`modal-content--${size}`">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              &#x2715;
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="showFooter" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFooter?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  showFooter: false,
});

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content--sm { width: 400px; }
.modal-content--md { width: 600px; }
.modal-content--lg { width: 800px; }
.modal-content--xl { width: 1000px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-gray-900);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-slow);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
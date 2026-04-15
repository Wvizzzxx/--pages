<template>
  <div class="base-input-wrapper">
    <label v-if="label" class="base-input-label" :for="id">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :id="id"
      class="base-input"
      :class="{
        'base-input--error': error,
        'base-input--sm': size === 'sm',
        'base-input--lg': size === 'lg',
      }"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="base-input-error">{{ error }}</span>
    <span v-if="hint && !error" class="base-input-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  error: '',
  hint: '',
  disabled: false,
  required: false,
  size: 'md',
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.base-input-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
}

.required {
  color: var(--color-error);
}

.base-input {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  background: var(--color-white);
}

.base-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
}

.base-input--sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.base-input--lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}

.base-input--error {
  border-color: var(--color-error);
}

.base-input--error:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.base-input:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

.base-input-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

.base-input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}
</style>
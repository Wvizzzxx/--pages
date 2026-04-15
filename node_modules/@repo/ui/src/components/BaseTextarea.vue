<template>
  <div class="base-textarea-wrapper">
    <label v-if="label" class="base-textarea-label" :for="id">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <textarea
      :id="id"
      class="base-textarea"
      :class="{ 'base-textarea--error': error }"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <span v-if="error" class="base-textarea-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  error: '',
  disabled: false,
  required: false,
  rows: 4,
  id: () => `textarea-${Math.random().toString(36).substr(2, 9)}`,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.base-textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.base-textarea-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
}

.required {
  color: var(--color-error);
}

.base-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  resize: vertical;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  background: var(--color-white);
}

.base-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
}

.base-textarea--error {
  border-color: var(--color-error);
}

.base-textarea:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

.base-textarea-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}
</style>
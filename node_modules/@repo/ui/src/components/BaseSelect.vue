<template>
  <div class="base-select-wrapper">
    <label v-if="label" class="base-select-label" :for="id">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <select
      :id="id"
      class="base-select"
      :class="{ 'base-select--error': error }"
      :value="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="base-select-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: 'Выберите...',
  error: '',
  disabled: false,
  required: false,
  id: () => `select-${Math.random().toString(36).substr(2, 9)}`,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.base-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.base-select-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
}

.required {
  color: var(--color-error);
}

.base-select {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background: var(--color-white);
  cursor: pointer;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.base-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
}

.base-select--error {
  border-color: var(--color-error);
}

.base-select:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

.base-select-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}
</style>
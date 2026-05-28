<template>
  <div class="base-loader" :class="{ 'base-loader--centered': centered }" :style="{ '--loader-size': `${size}px` }">
    <div class="loader-spinner"></div>
    <span v-if="text" class="loader-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: number;
  text?: string;
  centered?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 40,
  text: '',
  centered: false,
});
</script>

<style scoped>
.base-loader {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.base-loader--centered {
  justify-content: center;
  padding: var(--spacing-3xl) 0;
}

.loader-spinner {
  width: var(--loader-size);
  height: var(--loader-size);
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-right-color: var(--color-primary-light);
  border-radius: 50%;
  animation: loaderSpin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes loaderSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  animation: loaderPulse 1.5s ease-in-out infinite;
}

@keyframes loaderPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
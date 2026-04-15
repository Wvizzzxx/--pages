<template>
  <div class="base-card" :class="{ 'base-card--hover': hover, 'base-card--shadow': shadow }">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  hover?: boolean;
  shadow?: boolean;
}

withDefaults(defineProps<Props>(), {
  hover: false,
  shadow: true,
});
</script>

<style scoped>
.base-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.base-card--shadow {
  box-shadow: var(--shadow-md);
}

.base-card--hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
</style>
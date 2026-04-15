<template>
  <router-view />
  <NotificationToast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import NotificationToast from './components/NotificationToast.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchMe();
  }
});
</script>

<style>
/* Глобальные стили уже подключены в main.ts */
</style>
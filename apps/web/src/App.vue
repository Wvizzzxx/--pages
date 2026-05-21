<template>
  <Layout />
  <NotificationToast />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import Layout from './components/Layout.vue';
import NotificationToast from './components/NotificationToast.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchMe();
});
</script>
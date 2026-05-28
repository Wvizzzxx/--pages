<template>
  <header class="admin-header">
    <div class="admin-header-inner">
      <router-link to="/" class="admin-logo">
        <span class="admin-logo-text">ГрузЭкспресс</span>
        <span class="admin-badge">Панель управления</span>
      </router-link>

      <div class="admin-header-actions">
        <a href="http://localhost:3000" target="_blank" class="btn-site">
          Перейти на сайт
        </a>
        <button class="btn-logout" @click="handleLogout">
          Выйти
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.admin-header {
  background: var(--color-primary-dark);
  padding: var(--spacing-md) 0;
  box-shadow: var(--shadow-md);
}

.admin-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
}

.admin-logo-text {
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--color-white);
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffffff, #cde8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
}

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.btn-site {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255,255,255,0.15);
  color: #fff;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background var(--transition-base);
}

.btn-site:hover {
  background: rgba(255,255,255,0.25);
}

.btn-logout {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-error);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity var(--transition-base);
}

.btn-logout:hover {
  opacity: 0.85;
}
</style>
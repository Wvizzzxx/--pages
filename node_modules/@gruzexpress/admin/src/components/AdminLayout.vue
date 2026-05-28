<template>
  <div class="admin-layout">
    <AdminHeader />
    <div class="admin-body">
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/dashboard" class="nav-link">
            <span class="nav-icon">📊</span>
            Дашборд
          </router-link>
          <router-link to="/services" class="nav-link">
            <span class="nav-icon">🛠️</span>
            Услуги
          </router-link>
          <router-link to="/orders" class="nav-link">
            <span class="nav-icon">📦</span>
            Заказы
          </router-link>
          <router-link to="/users" class="nav-link">
            <span class="nav-icon">👥</span>
            Пользователи
          </router-link>
          <router-link to="/gallery" class="nav-link">
            <span class="nav-icon">📷</span>
            Галерея
          </router-link>
          <router-link to="/site-photos" class="nav-link">
            <span class="nav-icon">🖼️</span>
            Фото сайта
          </router-link>
        </nav>
      </aside>
      <main class="admin-main">
        <div class="container">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from './AdminHeader.vue';
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-body {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 240px;
  background: var(--color-bg-white);
  border-right: 1px solid var(--color-border);
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  gap: var(--spacing-xs);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: background var(--transition-base), color var(--transition-base);
}

.nav-link:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.router-link-active {
  background: var(--color-primary);
  color: var(--color-white);
}

.nav-icon {
  font-size: 1.2rem;
}

.admin-main {
  flex: 1;
  padding: var(--spacing-lg);
  background: var(--color-bg-light);
}

@media (max-width: 768px) {
  .admin-body {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-link {
    flex: 1;
    justify-content: center;
  }
}
</style>
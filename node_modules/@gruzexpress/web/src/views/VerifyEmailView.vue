<template>
  <main class="verify-view">
    <div class="container">
      <div class="verify-card">
        <div v-if="loading" class="verify-loading">
          <div class="spinner"></div>
          <p>Подтверждение email...</p>
        </div>
        <div v-else-if="success" class="verify-success">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>Email подтверждён!</h1>
          <p>Ваша электронная почта успешно подтверждена. Теперь вам доступны все функции сайта.</p>
          <router-link to="/profile" class="btn-primary">Перейти в профиль</router-link>
        </div>
        <div v-else class="verify-error">
          <div class="error-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h1>Ошибка подтверждения</h1>
          <p>{{ errorMessage }}</p>
          <router-link to="/login" class="btn-primary">Войти</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(true);
const success = ref(false);
const errorMessage = ref('Ссылка недействительна или устарела.');

onMounted(async () => {
  const token = route.query.token as string;
  if (!token) {
    loading.value = false;
    return;
  }

  try {
    const res = await fetch(`/api/auth/verify-email?token=${token}`);
    const json = await res.json();
    if (json.success) {
      success.value = true;
    } else {
      errorMessage.value = json.message || 'Ссылка недействительна.';
    }
  } catch {
    errorMessage.value = 'Ошибка соединения с сервером.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.verify-view {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-card {
  max-width: 480px;
  margin: 0 auto;
  padding: var(--spacing-3xl);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.verify-loading,
.verify-success,
.verify-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.success-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #065f46;
}

.error-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #991b1b;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary {
  display: inline-block;
  padding: 12px 28px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-primary:hover { background: var(--color-primary-dark); }
</style>
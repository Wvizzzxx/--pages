<template>
  <div class="admin-login">
    <div class="login-card">
      <div class="login-header">
        <div class="admin-icon">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h1 class="login-title">Вход в панель управления</h1>
        <p class="login-subtitle">Только для администраторов</p>
      </div>

      <!-- Информация для тестового входа -->
      <div class="demo-notice">
        <svg class="demo-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p class="demo-text">
          <strong>Тестовый админ:</strong> admin@gruzexpress.ru / admin123
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="admin@gruzexpress.ru"
            :disabled="submitting"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Введите пароль"
              :disabled="submitting"
              required
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
              :tabindex="-1"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ error }}
        </p>

        <button type="submit" class="btn-login" :disabled="submitting">
          <svg v-if="submitting" class="spinner" viewBox="0 0 24 24" width="18" height="18">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
          {{ submitting ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <a href="http://localhost:3000" class="back-link">
        ← Вернуться на сайт
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import type { ApiResponse, AuthResponse } from '@repo/types';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({ email: '', password: '' });
const error = ref('');
const submitting = ref(false);
const showPassword = ref(false);

async function handleLogin() {
  if (!form.value.email || !form.value.password) {
    error.value = 'Заполните все поля';
    return;
  }

  submitting.value = true;
  error.value = '';

  try {
    const response = await authStore.login(
      form.value.email,
      form.value.password
    ) as ApiResponse<AuthResponse> | undefined;

    if (response?.success && response.data) {
      if (response.data.user.role === 'admin') {
        await authStore.fetchMe();
        router.push('/dashboard');
      } else {
        error.value = 'Доступ разрешён только администраторам';
        authStore.logout();
      }
    } else {
      error.value = (response as any)?.message || 'Неверный email или пароль';
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Ошибка при входе';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  position: relative;
  overflow: hidden;
}

.admin-login::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: var(--spacing-2xl);
  background: var(--color-bg-white);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.admin-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary), #1e3a8a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.login-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.login-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

/* Demo notice */
.demo-notice {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.demo-icon {
  color: #d97706;
  flex-shrink: 0;
}

.demo-text {
  margin: 0;
  font-size: 0.85rem;
  color: #78350f;
}

.demo-text strong {
  color: #92400e;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all var(--transition-base);
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--color-primary);
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--color-error);
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  margin: 0;
}

.btn-login {
  padding: 14px;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.btn-login:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.back-link {
  display: block;
  text-align: center;
  margin-top: var(--spacing-xl);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-primary);
}

@media (max-width: 480px) {
  .login-card {
    padding: var(--spacing-xl);
  }

  .login-title {
    font-size: 1.4rem;
  }

  .admin-icon {
    width: 70px;
    height: 70px;
  }
}
</style>
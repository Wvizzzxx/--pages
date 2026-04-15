<template>
  <main class="register-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <div class="auth-card">
        <h1 class="auth-title">Регистрация</h1>

        <form @submit.prevent="handleRegister" class="auth-form">
          <BaseInput
            v-model="form.values.name"
            label="Имя"
            placeholder="Иван Иванов"
            :required="true"
            :error="form.errors.name"
            @blur="form.markTouched('name')"
          />

          <BaseInput
            v-model="form.values.email"
            label="Email"
            type="email"
            placeholder="example@mail.ru"
            :required="true"
            :error="form.errors.email"
            @blur="form.markTouched('email')"
          />

          <BaseInput
            v-model="form.values.password"
            label="Пароль"
            type="password"
            placeholder="Минимум 6 символов"
            :required="true"
            :error="form.errors.password"
            @blur="form.markTouched('password')"
          />

          <BaseInput
            v-model="form.values.confirmPassword"
            label="Подтверждение пароля"
            type="password"
            placeholder="Повторите пароль"
            :required="true"
            :error="form.errors.confirmPassword"
            @blur="form.markTouched('confirmPassword')"
          />

          <BaseButton type="submit" :disabled="submitting" class="submit-btn">
            {{ submitting ? 'Регистрация...' : 'Зарегистрироваться' }}
          </BaseButton>
        </form>

        <p class="auth-link">
          Уже есть аккаунт?
          <router-link to="/login">Войти</router-link>
        </p>
      </div>
    </div>

    <NotificationToast />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import BaseInput from '@repo/ui/components/BaseInput.vue';
import BaseButton from '@repo/ui/components/BaseButton.vue';
import NotificationToast from '../components/NotificationToast.vue';
import { useAuthStore } from '../stores/auth';
import { useFormValidation } from '../composables/useFormValidation';
import { useNotifications } from '../composables/useNotifications';
import type { BreadcrumbItem, ApiResponse, AuthResponse } from '@repo/types';

const router = useRouter();
const authStore = useAuthStore();
const { success, error } = useNotifications();

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Регистрация' },
];

const form = useFormValidation(
  {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  {
    name: [
      { type: 'required', message: 'Введите имя' },
      { type: 'minLength', value: 2, message: 'Минимум 2 символа' },
    ],
    email: [
      { type: 'required', message: 'Введите email' },
      { type: 'email', message: 'Некорректный email' },
    ],
    password: [
      { type: 'required', message: 'Введите пароль' },
      { type: 'minLength', value: 6, message: 'Минимум 6 символов' },
    ],
    confirmPassword: [
      { type: 'required', message: 'Подтвердите пароль' },
      { type: 'match', field: 'password', message: 'Пароли не совпадают' },
    ],
  }
);

const submitting = ref(false);

async function handleRegister() {
  if (!form.validate()) {
    return;
  }

  submitting.value = true;

  try {
    const response = await authStore.register(
      form.values.name,
      form.values.email,
      form.values.password
    ) as ApiResponse<AuthResponse> | undefined;
    
    if (response?.success && response.data) {
      success('Регистрация прошла успешно');
      router.push('/profile');
    } else {
      error((response && (response as any).message) || 'Ошибка при регистрации');
    }
  } catch (e: any) {
    error(e?.response?.data?.message || 'Произошла ошибка. Попробуйте ещё раз.');
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.register-view {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
}

.auth-card {
  max-width: 420px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.submit-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1rem;
}

.auth-link {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.auth-link a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-card {
    padding: var(--spacing-lg);
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
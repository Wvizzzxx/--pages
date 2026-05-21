<template>
  <main class="login-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-icon">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 class="auth-title">Вход в аккаунт</h1>
          <p class="auth-subtitle">
            Введите свои данные для входа в личный кабинет
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form" novalidate>
          <BaseInput
            v-model="form.values.email"
            label="Email"
            type="email"
            placeholder="example@mail.ru"
            :required="true"
            :error="form.errors.email"
            :disabled="submitting"
            @blur="form.markTouched('email')"
          />

          <div class="password-field-wrapper">
            <BaseInput
              v-model="form.values.password"
              label="Пароль"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Введите пароль"
              :required="true"
              :error="form.errors.password"
              :disabled="submitting"
              @blur="form.markTouched('password')"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :tabindex="-1"
            >
              <svg
                v-if="!showPassword"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>

          <BaseButton type="submit" :disabled="submitting" class="submit-btn">
            <svg
              v-if="submitting"
              class="spinner"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
                fill="none"
                stroke-dasharray="31.4 31.4"
                stroke-linecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            {{ submitting ? "Вход..." : "Войти" }}
          </BaseButton>
        </form>

        <p class="auth-link">
          Ещё нет аккаунта?
          <router-link to="/register">Зарегистрироваться</router-link>
        </p>
      </div>
    </div>

    <NotificationToast />
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseBreadcrumbs from "@repo/ui/components/BaseBreadcrumbs.vue";
import BaseButton from "@repo/ui/components/BaseButton.vue";
import BaseInput from "@repo/ui/components/BaseInput.vue";
import NotificationToast from "../components/NotificationToast.vue";
import { useAuthStore } from "../stores/auth";
import { useFormValidation } from "../composables/useFormValidation";
import { useNotifications } from "../composables/useNotifications";
import type { BreadcrumbItem, ApiResponse, AuthResponse } from "@repo/types";

const router = useRouter();
const authStore = useAuthStore();
const { success, error } = useNotifications();

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Главная", to: "/" },
  { label: "Войти" },
];

const showPassword = ref(false);

const form = useFormValidation(
  {
    email: "",
    password: "",
  },
  {
    email: [
      { type: "required", message: "Введите email" },
      { type: "email", message: "Некорректный email" },
    ],
    password: [
      { type: "required", message: "Введите пароль" },
      { type: "minLength", value: 6, message: "Минимум 6 символов" },
    ],
  },
);

const submitting = ref(false);

async function handleLogin() {
  if (!form.validate()) {
    error("Пожалуйста, заполните все поля корректно");
    return;
  }

  submitting.value = true;

  try {
    const response = (await authStore.login(
      form.values.email,
      form.values.password,
    )) as ApiResponse<AuthResponse> | undefined;
    if (response?.success && response.data) {
      await authStore.fetchMe();
      // Блокируем вход админа через обычный сайт
      if (authStore.isAdmin) {
        authStore.logout();
        error("Администраторы не могут входить через этот сайт. Используйте панель управления.");
        return;
      }
      success("Вы успешно вошли в аккаунт");
      router.push("/profile");
    } else {
      error(
        (response && (response as any).message) || "Неверный email или пароль",
      );
    }
  } catch (e: any) {
    const errorMessage =
      e?.response?.data?.message || "Произошла ошибка. Попробуйте ещё раз.";
    error(errorMessage);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.login-view {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
}

.auth-card {
  max-width: 480px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  background: var(--color-bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  text-align: center;
  margin: 0;
}

/* Demo notice */
.demo-notice {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.demo-icon {
  color: #d97706;
  flex-shrink: 0;
  margin-top: 2px;
}

.demo-content {
  flex: 1;
}

.demo-title {
  font-weight: 600;
  color: #92400e;
  margin: 0 0 4px 0;
  font-size: 0.9rem;
}

.demo-credentials {
  margin: 0;
  font-size: 0.85rem;
  color: #78350f;
  font-family: "Courier New", monospace;
}

.demo-label {
  font-weight: 600;
  color: #92400e;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.password-field-wrapper {
  position: relative;
}

.password-toggle {
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
  z-index: 1;
}

.password-toggle:hover {
  color: var(--color-primary);
}

.submit-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.auth-link {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.auth-link a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.auth-link a:hover {
  text-decoration: underline;
  color: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .auth-card {
    padding: var(--spacing-xl);
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .auth-icon {
    width: 70px;
    height: 70px;
  }

  .demo-notice {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>

<template>
  <main class="order-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <div class="order-header">
        <h1>Оформить заявку</h1>
        <p class="order-subtitle">Заполните форму и мы свяжемся с вами для уточнения деталей</p>
      </div>

      <!-- Успешная отправка -->
      <div v-if="submitted" class="success-card">
        <div class="success-icon">✅</div>
        <h2>Заявка отправлена!</h2>
        <p>{{ successMessage || 'Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.' }}</p>
        <div class="success-actions">
          <router-link to="/profile" class="btn-primary">Перейти в профиль</router-link>
          <router-link to="/services" class="btn-outline">Посмотреть услуги</router-link>
        </div>
      </div>

      <!-- Форма заказа -->
      <form v-else class="order-form" @submit.prevent="handleSubmit">
        <div class="form-grid">
          <!-- Левая колонка — данные -->
          <div class="form-section">
            <h2>Контактные данные</h2>

            <div class="form-group">
              <label for="name">Ваше имя *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Иван Иванов"
                required
                :disabled="submitting"
              />
              <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="phone">Телефон *</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                required
                :disabled="submitting"
              />
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label for="addressFrom">Откуда загрузка *</label>
              <textarea
                id="addressFrom"
                v-model="form.addressFrom"
                placeholder="Город, улица, дом (откуда забирать груз)"
                rows="2"
                required
                :disabled="submitting"
              ></textarea>
              <span v-if="errors.addressFrom" class="form-error">{{ errors.addressFrom }}</span>
            </div>

            <div class="form-group">
              <label for="addressTo">Куда доставить *</label>
              <textarea
                id="addressTo"
                v-model="form.addressTo"
                placeholder="Город, улица, дом, квартира (куда доставить груз)"
                rows="2"
                required
                :disabled="submitting"
              ></textarea>
              <span v-if="errors.addressTo" class="form-error">{{ errors.addressTo }}</span>
            </div>
          </div>

          <!-- Правая колонка — услуга и комментарий -->
          <div class="form-section">
            <h2>Детали заказа</h2>

            <div class="form-group">
              <label for="service">Услуга</label>
              <select
                id="service"
                v-model="form.serviceId"
                :disabled="submitting || servicesLoading"
              >
                <option value="">— Выберите услугу —</option>
                <option
                  v-for="service in services"
                  :key="service._id"
                  :value="service._id"
                >
                  {{ service.title }} — {{ formatPrice(service.price) }}
                </option>
              </select>
            </div>

            <div v-if="selectedService" class="service-info">
              <div class="service-info-title">{{ selectedService.title }}</div>
              <div v-if="discountedPrice" class="service-info-price-wrapper">
                <div class="service-info-price-discounted">{{ formatPrice(discountedPrice.final) }}</div>
                <div class="service-info-price-original">{{ formatPrice(discountedPrice.original) }}</div>
                <span class="discount-badge">−{{ userDiscount }}%</span>
              </div>
              <div v-else class="service-info-price">{{ formatPrice(selectedService.price) }}</div>
              <p v-if="selectedService.description" class="service-info-desc">
                {{ selectedService.description }}
              </p>
            </div>

            <div class="form-group">
              <label for="comment">Комментарий</label>
              <textarea
                id="comment"
                v-model="form.comment"
                placeholder="Дополнительные пожелания, вес груза, размеры и т.д."
                rows="4"
                :disabled="submitting"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Политика безопасности -->
        <div class="policy-check" style="margin-bottom: var(--spacing-lg);">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptPolicy" class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">
              Я согласен с
              <router-link to="/privacy" target="_blank" class="policy-link">политикой конфиденциальности</router-link>
              и обработкой персональных данных
            </span>
          </label>
          <span v-if="policyError" class="form-error">{{ policyError }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="submitting">
            <span v-if="submitting" class="spinner"></span>
            {{ submitting ? 'Отправка...' : 'Отправить заявку' }}
          </button>
        </div>
      </form>

      <!-- Информационные блоки -->
      <div class="order-info">
        <div class="info-card">
          <span class="info-icon">⚡</span>
          <h3>Быстрый ответ</h3>
          <p>Менеджер свяжется в течение 30 минут</p>
        </div>
        <div class="info-card">
          <span class="info-icon">🛡️</span>
          <h3>Гарантия</h3>
          <p>Страхование всех грузов</p>
        </div>
        <div class="info-card">
          <span class="info-icon">💰</span>
          <h3>Лучшие цены</h3>
          <p>Без скрытых платежей</p>
        </div>
      </div>
    </div>
    <NotificationToast />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import NotificationToast from '../components/NotificationToast.vue';
import { useAuthStore } from '../stores/auth';
import { useNotifications } from '../composables/useNotifications';
import { getServices } from '../api/services';
import { createOrder, createPublicOrder } from '../api/orders';
import type { OrderResult } from '../api/orders';
import type { Service, BreadcrumbItem } from '@repo/types';

const authStore = useAuthStore();
const { success, error: showError } = useNotifications();

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Оформить заявку' },
];

const services = ref<Service[]>([]);
const servicesLoading = ref(true);
const submitting = ref(false);
const submitted = ref(false);
const successMessage = ref('');
const acceptPolicy = ref(false);
const policyError = ref('');

const form = reactive({
  name: '',
  phone: '',
  addressFrom: '',
  addressTo: '',
  serviceId: '',
  comment: '',
});

const errors = reactive({
  name: '',
  phone: '',
  addressFrom: '',
  addressTo: '',
});

const selectedService = computed(() => {
  if (!form.serviceId) return null;
  return services.value.find(s => s._id === form.serviceId) || null;
});

const userDiscount = computed(() => {
  return (authStore.user as any)?.discount || 0;
});

const discountedPrice = computed(() => {
  if (!selectedService.value?.price || userDiscount.value <= 0) return null;
  const price = selectedService.value.price;
  const discount = Math.round(price * userDiscount.value / 100);
  return { original: price, discount, final: price - discount };
});

function formatPrice(price: number | undefined): string {
  if (!price) return 'Договорная';
  return `${price.toLocaleString('ru-RU')} ₽`;
}

function validate(): boolean {
  let valid = true;
  errors.name = '';
  errors.phone = '';
  errors.addressFrom = '';
  errors.addressTo = '';
  policyError.value = '';

  if (!acceptPolicy.value) {
    policyError.value = 'Необходимо принять политику безопасности';
    valid = false;
  }

  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = 'Укажите ваше имя (минимум 2 символа)';
    valid = false;
  }

  if (!form.phone.trim() || form.phone.trim().length < 10) {
    errors.phone = 'Укажите корректный номер телефона';
    valid = false;
  }

  if (!form.addressFrom.trim() || form.addressFrom.trim().length < 5) {
    errors.addressFrom = 'Укажите адрес отправления (минимум 5 символов)';
    valid = false;
  }

  if (!form.addressTo.trim() || form.addressTo.trim().length < 5) {
    errors.addressTo = 'Укажите адрес доставки (минимум 5 символов)';
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) return;

  submitting.value = true;
  try {
    const combinedAddress = `Откуда: ${form.addressFrom.trim()} → Куда: ${form.addressTo.trim()}`;
    const orderData = {
      serviceId: form.serviceId || '',
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: combinedAddress,
      comment: form.comment.trim(),
    };

    let result: OrderResult | null = null;
    if (authStore.isAuthenticated) {
      result = await createOrder({
        serviceId: form.serviceId || '',
        address: combinedAddress,
        phone: form.phone.trim(),
        comment: form.comment.trim(),
      });
    } else {
      result = await createPublicOrder(orderData);
    }

    submitted.value = true;
    successMessage.value = result?.message || '';
    success(result?.message || 'Заявка успешно отправлена!');
  } catch (e: any) {
    console.error('Ошибка отправки заказа:', e);
    showError(e.message || 'Ошибка отправки заявки. Попробуйте ещё раз.');
  } finally {
    submitting.value = false;
  }
}

async function loadServices() {
  servicesLoading.value = true;
  try {
    services.value = await getServices();
  } catch (e) {
    console.error('Ошибка загрузки услуг:', e);
  } finally {
    servicesLoading.value = false;
  }
}

onMounted(() => {
  // Предзаполняем данные из профиля
  if (authStore.isAuthenticated && authStore.user) {
    form.name = authStore.user.name || '';
    form.phone = (authStore.user as any).phone || '';
  }
  loadServices();
});
</script>

<style scoped>
.order-view {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.order-header {
  margin-bottom: var(--spacing-2xl);
}

.order-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.order-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

/* Success Card */
.success-card {
  text-align: center;
  padding: var(--spacing-3xl);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-2xl);
}

.success-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.success-card h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.success-card p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.success-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Form */
.order-form {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
}

.form-section h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-gray-100);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
  color: var(--color-text-primary);
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background: var(--color-gray-50);
  opacity: 0.7;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-error {
  display: block;
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
}

/* Service Info */
.service-info {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  border-left: 4px solid var(--color-primary);
}

.service-info-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.service-info-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.service-info-price-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.service-info-price-discounted {
  font-size: 1.2rem;
  font-weight: 800;
  color: #10b981;
}

.service-info-price-original {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.discount-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.service-info-desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Form Actions */
.form-actions {
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-gray-100);
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 14px 40px;
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-secondary-rgb), 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Policy checkbox */
.policy-check { margin-top: var(--spacing-xs); }

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  line-height: 1.5;
}

.checkbox-input { display: none; }

.checkbox-custom {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid var(--color-gray-300);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  margin-top: 1px;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.checkbox-text { color: var(--color-text-secondary); }

.policy-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.policy-link:hover { text-decoration: underline; }

/* Info Cards */
.order-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.info-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-100);
}

.info-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
  display: block;
}

.info-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--color-text-primary);
}

.info-card p {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

/* Buttons */
.btn-primary {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-outline {
  display: inline-block;
  padding: 12px 24px;
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: var(--color-primary);
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .order-header h1 {
    font-size: 1.5rem;
  }

  .order-form {
    padding: var(--spacing-lg);
  }

  .order-info {
    grid-template-columns: 1fr;
  }

  .success-actions {
    flex-direction: column;
  }
}
</style>
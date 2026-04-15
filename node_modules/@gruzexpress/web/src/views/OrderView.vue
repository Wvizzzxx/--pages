<template>
  <main class="order-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <div class="order-container">
        <h1 class="page-title">Оформить заявку</h1>
        <p class="page-description">
          Заполните форму ниже, и наш менеджер свяжется с вами в ближайшее время
          для уточнения деталей заказа.
        </p>

        <!-- Step indicator -->
        <div class="steps">
          <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Выберите услугу</span>
          </div>
          <div class="step-line" :class="{ active: currentStep > 1 }"></div>
          <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Контактные данные</span>
          </div>
          <div class="step-line" :class="{ active: currentStep > 2 }"></div>
          <div class="step" :class="{ active: currentStep === 3 }">
            <span class="step-number">3</span>
            <span class="step-label">Подтверждение</span>
          </div>
        </div>

        <!-- Step 1: Service Selection -->
        <div v-show="currentStep === 1" class="form-step">
          <div class="form-card">
            <h2>Выбор услуги</h2>
            <div v-if="servicesLoading" class="loading-services">
              <BaseLoader text="Загрузка услуг..." />
            </div>
            <div v-else-if="services.length === 0" class="no-services">
              <p>Услуги временно недоступны. Пожалуйста, свяжитесь с нами по телефону.</p>
            </div>
            <div v-else class="services-grid">
              <div
                v-for="service in services"
                :key="service._id"
                class="service-option"
                :class="{ selected: form.values.serviceId === service._id }"
                @click="selectService(service)"
              >
                <div class="service-radio">
                  <span class="radio-circle" :class="{ checked: form.values.serviceId === service._id }">
                    <span class="radio-dot" v-if="form.values.serviceId === service._id"></span>
                  </span>
                </div>
                <div class="service-info">
                  <h3>{{ service.title }}</h3>
                  <p>{{ service.description }}</p>
                  <span class="service-price">от {{ service.price.toLocaleString('ru-RU') }} ₽ / {{ service.priceUnit }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-next" @click="goToStep(2)" :disabled="!form.values.serviceId">
                Далее →
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Contact Info -->
        <div v-show="currentStep === 2" class="form-step">
          <div class="form-card">
            <h2>Контактные данные</h2>
            <form @submit.prevent class="contact-form">
              <BaseInput
                v-model="form.values.name"
                label="Ваше имя"
                placeholder="Иван Иванов"
                :required="true"
                :error="form.errors.name"
                @blur="form.markTouched('name')"
              />
              <BaseInput
                v-model="form.values.phone"
                label="Телефон"
                placeholder="+7 (999) 123-45-67"
                :required="true"
                :error="form.errors.phone"
                @blur="form.markTouched('phone')"
              />
              <BaseInput
                v-model="form.values.address"
                label="Адрес"
                placeholder="Город, улица, дом"
                :required="true"
                :error="form.errors.address"
                @blur="form.markTouched('address')"
              />
              <BaseInput
                v-model="form.values.comment"
                label="Комментарий (необязательно)"
                placeholder="Опишите ваш груз, время доставки и другие детали..."
                :required="false"
              />
            </form>
            <div class="form-actions">
              <button class="btn-prev" @click="goToStep(1)">← Назад</button>
              <button class="btn-next" @click="goToStep(3)" :disabled="!canProceedToStep3">
                Далее →
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Confirmation -->
        <div v-show="currentStep === 3" class="form-step">
          <div class="form-card">
            <h2>Подтверждение заявки</h2>
            <div class="order-summary">
              <div class="summary-row">
                <span class="label">Услуга:</span>
                <span class="value">{{ selectedService?.title }}</span>
              </div>
              <div class="summary-row">
                <span class="label">Стоимость:</span>
                <span class="value price">от {{ selectedService?.price.toLocaleString('ru-RU') }} ₽</span>
              </div>
              <div class="summary-row">
                <span class="label">Имя:</span>
                <span class="value">{{ form.values.name }}</span>
              </div>
              <div class="summary-row">
                <span class="label">Телефон:</span>
                <span class="value">{{ form.values.phone }}</span>
              </div>
              <div class="summary-row">
                <span class="label">Адрес:</span>
                <span class="value">{{ form.values.address }}</span>
              </div>
              <div class="summary-row" v-if="form.values.comment">
                <span class="label">Комментарий:</span>
                <span class="value">{{ form.values.comment }}</span>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-prev" @click="goToStep(2)">← Назад</button>
              <button class="btn-submit" @click="submitOrder" :disabled="submitting">
                {{ submitting ? 'Отправка...' : '✓ Оформить заявку' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Transition name="modal">
      <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeModal">
        <div class="success-modal">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2>Заявка успешно отправлена!</h2>
          <p>
            Спасибо за обращение в «ГрузЭкспресс»!<br/>
            Наш менеджер свяжется с вами в ближайшее время<br/>
            для уточнения деталей заказа.
          </p>
          <div class="modal-actions">
            <router-link to="/" class="btn-home">На главную</router-link>
            <button class="btn-close-modal" @click="closeModal">Закрыть</button>
          </div>
        </div>
      </div>
    </Transition>

    <NotificationToast />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import BaseLoader from '@repo/ui/components/BaseLoader.vue';
import BaseInput from '@repo/ui/components/BaseInput.vue';
import NotificationToast from '../components/NotificationToast.vue';
import { useFormValidation } from '../composables/useFormValidation';
import { useNotifications } from '../composables/useNotifications';
import { createPublicOrder } from '../api/orders';
import type { BreadcrumbItem, Service } from '@repo/types';

const router = useRouter();
const { success, error } = useNotifications();

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Оформить заявку' },
];

// State
const currentStep = ref(1);
const services = ref<Service[]>([]);
const servicesLoading = ref(true);
const submitting = ref(false);
const showSuccessModal = ref(false);

const form = useFormValidation(
  {
    serviceId: '',
    serviceName: '',
    name: '',
    phone: '',
    address: '',
    comment: '',
  },
  {
    serviceId: [
      { type: 'required', message: 'Выберите услугу' },
    ],
    name: [
      { type: 'required', message: 'Введите имя' },
      { type: 'minLength', value: 2, message: 'Минимум 2 символа' },
    ],
    phone: [
      { type: 'required', message: 'Введите номер телефона' },
      { type: 'phone', message: 'Некорректный номер телефона' },
    ],
    address: [
      { type: 'required', message: 'Введите адрес' },
      { type: 'minLength', value: 10, message: 'Введите полный адрес' },
    ],
  }
);

const selectedService = computed(() => {
  return services.value.find(s => s._id === form.values.serviceId) || null;
});

const canProceedToStep3 = computed(() => {
  return form.values.name.length >= 2 && 
         form.values.phone.length >= 10 && 
         form.values.address.length >= 10;
});

// Load services
onMounted(async () => {
  try {
    const response = await fetch('/api/services');
    const result = await response.json();
    if (result.success) {
      services.value = result.data || [];
    }
  } catch (e) {
    console.error('Ошибка загрузки услуг:', e);
  } finally {
    servicesLoading.value = false;
  }
});

// Step navigation
function goToStep(step: number) {
  if (step === 2 && !form.values.serviceId) return;
  if (step === 3) {
    // Validate using useFormValidation
    form.validateField('name');
    form.validateField('phone');
    form.validateField('address');
    
    if (!canProceedToStep3.value) return;
  }
  currentStep.value = step;
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function selectService(service: Service) {
  form.values.serviceId = service._id;
  form.values.serviceName = service.title;
}

// Submit order
async function submitOrder() {
  if (!form.values.serviceId || !canProceedToStep3.value) return;

  submitting.value = true;
  try {
    await createPublicOrder({
      serviceId: form.values.serviceId,
      serviceName: form.values.serviceName,
      name: form.values.name,
      phone: form.values.phone,
      address: form.values.address,
      comment: form.values.comment,
    });
    
    success('Заявка успешно отправлена!');
    showSuccessModal.value = true;
  } catch (e: any) {
    error(e?.response?.data?.message || 'Произошла ошибка при отправке заявки');
  } finally {
    submitting.value = false;
  }
}

function closeModal() {
  showSuccessModal.value = false;
  // Reset form
  form.reset();
  currentStep.value = 1;
}
</script>

<style scoped>
.order-view {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px);
}

.order-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-sm);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Steps */
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-bg-white), var(--color-bg-light));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  position: relative;
}

.step-number {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-gray-200);
  color: var(--color-gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  transition: all var(--transition-base);
  border: 3px solid var(--color-gray-300);
  position: relative;
  z-index: 2;
}

.step.active .step-number {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-white);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transform: scale(1.1);
}

.step.completed .step-number {
  background: linear-gradient(135deg, #10b981, #059669);
  color: var(--color-white);
  border-color: #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.step.completed .step-number::after {
  content: '✓';
  position: absolute;
  font-size: 1.2rem;
  font-weight: bold;
}

.step.completed .step-number {
  font-size: 0;
}

.step-label {
  font-size: 0.8rem;
  color: var(--color-gray-500);
  transition: all var(--transition-base);
  font-weight: 500;
  max-width: 100px;
  text-align: center;
}

.step.active .step-label {
  color: var(--color-primary);
  font-weight: 700;
}

.step-line {
  width: 80px;
  height: 3px;
  background: var(--color-gray-200);
  margin: 0 var(--spacing-sm);
  transition: all var(--transition-base);
  border-radius: 2px;
  position: relative;
}

.step-line.active {
  background: linear-gradient(90deg, #10b981, #059669);
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

/* Form Card */
.form-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-card {
  background: linear-gradient(135deg, var(--color-bg-white), var(--color-bg-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
}

.form-card h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
  font-weight: 700;
}

.loading-services, .no-services {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-secondary);
}

/* Services Grid */
.services-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.service-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  background: var(--color-bg-white);
}

.service-option:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.service-option.selected {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(30, 64, 175, 0.05));
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
}

.service-radio {
  flex-shrink: 0;
  margin-top: 4px;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.radio-circle.checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-white);
}

.service-info h3 {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.service-info p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.service-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
}

/* Contact Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  justify-content: space-between;
}

.btn-next, .btn-submit {
  padding: 14px var(--spacing-2xl);
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.btn-next {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-white);
  margin-left: auto;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.btn-next:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-dark), #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981, #059669);
  color: var(--color-white);
  padding: 14px var(--spacing-3xl);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-prev {
  padding: 14px var(--spacing-xl);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-prev:hover {
  background: var(--color-gray-200);
  border-color: var(--color-gray-300);
  transform: translateX(-2px);
}

/* Order Summary */
.order-summary {
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-light));
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row .label {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.summary-row .value {
  color: var(--color-text-primary);
  font-weight: 600;
}

.summary-row .value.price {
  color: var(--color-primary);
  font-size: 1.3rem;
  font-weight: 700;
}

/* Success Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.success-modal {
  background: var(--color-bg-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-xl);
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  width: 40px;
  height: 40px;
  color: var(--color-white);
}

.success-modal h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.success-modal p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.btn-home {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-base);
}

.btn-home:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.btn-close-modal {
  padding: var(--spacing-md) var(--spacing-xl);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-base);
}

.btn-close-modal:hover {
  background: var(--color-bg-secondary);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .steps {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .step-line {
    width: 30px;
    margin: 0 var(--spacing-xs);
  }

  .step-label {
    font-size: 0.7rem;
  }

  .form-card {
    padding: var(--spacing-lg);
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-next, .btn-submit {
    margin-left: 0;
  }
}
</style>
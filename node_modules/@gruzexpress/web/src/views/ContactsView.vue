<template>
  <main class="contacts-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <h1 class="page-title">Контакты</h1>

      <div class="contacts-content">
        <div class="contacts-info">
          <h2>Свяжитесь с нами</h2>

          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div>
              <h3>Телефон</h3>
              <p class="contact-value">
                <a href="tel:+78005553535">+7 (800) 555-35-35</a>
              </p>
              <p class="contact-note">Бесплатная горячая линия по России</p>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div>
              <h3>Email</h3>
              <p class="contact-value">
                <a href="mailto:info@gruzexpress.ru">info@gruzexpress.ru</a>
              </p>
              <p class="contact-note">Для общих вопросов и сотрудничества</p>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div>
              <h3>Адрес</h3>
              <p class="contact-value">г. Москва, ул. Транспортная, д. 15, офис 301</p>
              <p class="contact-note">Ближайшее метро: Автозаводская</p>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-icon">🕐</div>
            <div>
              <h3>График работы</h3>
              <table class="schedule-table">
                <tbody>
                  <tr>
                    <td>Понедельник — Пятница</td>
                    <td>8:00 — 20:00</td>
                  </tr>
                  <tr>
                    <td>Суббота</td>
                    <td>9:00 — 18:00</td>
                  </tr>
                  <tr>
                    <td>Воскресенье</td>
                    <td>10:00 — 16:00</td>
                  </tr>
                </tbody>
              </table>
              <p class="contact-note">Горячая линия работает круглосуточно</p>
            </div>
          </div>
        </div>

        <div class="contacts-form">
          <h2>Обратная связь</h2>
          <p>
            Заполните форму ниже, и наш менеджер свяжется с вами в течение 30 минут
            в рабочее время. Мы готовы ответить на любые вопросы о наших услугах.
          </p>

          <form @submit.prevent="submitForm" class="contact-form">
            <BaseInput
              v-model="form.name"
              label="Ваше имя"
              placeholder="Иван Иванов"
              :required="true"
            />

            <BaseInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="example@mail.ru"
              :required="true"
            />

            <BaseInput
              v-model="form.phone"
              label="Телефон"
              type="tel"
              placeholder="+7 (___) ___-__-__"
            />

            <BaseInput
              v-model="form.message"
              label="Сообщение"
              type="textarea"
              placeholder="Опишите ваш вопрос..."
              :required="true"
            />

            <BaseButton type="submit" :disabled="submitting" class="submit-btn">
              {{ submitting ? 'Отправка...' : 'Отправить сообщение' }}
            </BaseButton>

            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>
      </div>

      <section class="contacts-info-text">
        <h2>Как с нами связаться</h2>
        <p>
          Компания «ГрузЭкспресс» всегда открыта для общения с клиентами. Мы ценим каждого
          клиента и стремимся предоставить максимально удобный способ связи. Вы можете
          позвонить нам, написать на электронную почту или посетить наш офис лично.
        </p>
        <p>
          Для оперативного решения вопросов, связанных с текущими заказами, рекомендуем
          использовать горячую линию или личный кабинет на нашем сайте. Для вопросов
          о сотрудничестве и партнёрстве — пишите на электронную почту.
        </p>
        <p>
          Мы также присутствуем в социальных сетях, где публикуем актуальные новости,
          акции и полезную информацию о грузоперевозках. Подписывайтесь на наши каналы,
          чтобы быть в курсе всех событий!
        </p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import BaseInput from '@repo/ui/components/BaseInput.vue';
import BaseButton from '@repo/ui/components/BaseButton.vue';
import type { BreadcrumbItem } from '@repo/types';

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Контакты' },
];

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
});

const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

async function submitForm() {
  if (!form.value.name || !form.value.email || !form.value.message) {
    errorMessage.value = 'Пожалуйста, заполните все обязательные поля';
    return;
  }

  submitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });

    if (response.ok) {
      successMessage.value = 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
      form.value = { name: '', email: '', phone: '', message: '' };
    } else {
      errorMessage.value = 'Ошибка при отправке сообщения. Попробуйте ещё раз.';
    }
  } catch (e) {
    errorMessage.value = 'Произошла ошибка. Попробуйте связаться с нами по телефону.';
    console.error(e);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.contacts-view {
  padding: var(--spacing-xl) 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.contacts-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.contacts-info h2,
.contacts-form h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.contact-item {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.contact-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.contact-item h3 {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-xs);
  color: var(--color-primary);
}

.contact-value {
  margin: 0;
}

.contact-value a {
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
}

.contact-value a:hover {
  color: var(--color-primary);
}

.contact-note {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.schedule-table {
  width: 100%;
  margin: var(--spacing-sm) 0;
  border-collapse: collapse;
}

.schedule-table td {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.schedule-table td:last-child {
  font-weight: 600;
  text-align: right;
}

.contacts-form p {
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.submit-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1rem;
}

.success-message {
  color: var(--color-success);
  text-align: center;
  margin-top: var(--spacing-md);
}

.error-message {
  color: var(--color-error);
  text-align: center;
  margin-top: var(--spacing-md);
}

.contacts-info-text {
  margin-bottom: var(--spacing-xl);
}

.contacts-info-text h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.contacts-info-text p {
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .contacts-content {
    grid-template-columns: 1fr;
  }
}
</style>
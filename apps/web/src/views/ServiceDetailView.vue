<template>
  <main class="service-detail-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <div v-if="loading" class="loading">
        <BaseLoader text="Загрузка информации об услуге..." />
      </div>

      <div v-else-if="service" class="service-content">
        <div class="service-hero" :style="{ backgroundImage: `url(${service.image})` }" v-if="service.image">
          <div class="hero-overlay">
            <h1 class="hero-title">{{ service.title }}</h1>
          </div>
        </div>

        <h1 v-else class="page-title">{{ service.title }}</h1>

        <div class="service-details">
          <div class="service-main">
            <div class="price-block">
              <span class="label">Стоимость:</span>
              <span class="price">{{ formatPrice(service.price) }}</span>
            </div>

            <section class="description-section">
              <h2>Описание услуги</h2>
              <p>{{ service.description }}</p>
            </section>

            <section class="features-section" v-if="service.features && service.features.length">
              <h2>Особенности</h2>
              <ul class="features-list">
                <li v-for="(feature, index) in service.features" :key="index">
                  <span class="check-icon">✓</span>
                  {{ feature }}
                </li>
              </ul>
            </section>

            <section class="order-section">
              <h2>Оформить заказ</h2>
              <p>Оформите заявку на странице оформления заказа или войдите в аккаунт.</p>

              <div class="order-actions">
                <router-link to="/order" class="btn-order btn-order-primary">
                  Оформить
                </router-link>
                <template v-if="!authStore.isAuthenticated">
                  <router-link to="/login" class="btn-order btn-order-outline">
                    Войти для заказа
                  </router-link>
                </template>
              </div>
            </section>
          </div>

          <aside class="service-sidebar">
            <div class="sidebar-card">
              <h3>Почему выбирают нас?</h3>
              <ul class="benefits-list">
                <li>
                  <span class="benefit-icon">🚛</span>
                  <div>
                    <strong>Собственный автопарк</strong>
                    <span>Более 50 транспортных средств различной грузоподъёмности</span>
                  </div>
                </li>
                <li>
                  <span class="benefit-icon">⏰</span>
                  <div>
                    <strong>Точные сроки</strong>
                    <span>Доставка строго в оговорённые сроки</span>
                  </div>
                </li>
                <li>
                  <span class="benefit-icon">🛡️</span>
                  <div>
                    <strong>Страхование груза</strong>
                    <span>Все грузы застрахованы на полную стоимость</span>
                  </div>
                </li>
                <li>
                  <span class="benefit-icon">📞</span>
                  <div>
                    <strong>Поддержка 24/7</strong>
                    <span>Связаться с нами можно в любое время</span>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div v-else class="not-found">
        <h2>Услуга не найдена</h2>
        <p>Запрошенная услуга не существует или была удалена.</p>
        <router-link to="/services" class="btn-back">Вернуться к каталогу</router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import BaseLoader from '@repo/ui/components/BaseLoader.vue';
import { useAuthStore } from '../stores/auth';
import type { Service, BreadcrumbItem } from '@repo/types';

const route = useRoute();
const authStore = useAuthStore();

const service = ref<Service | null>(null);
const loading = ref(true);

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { label: 'Главная', to: '/' },
    { label: 'Услуги', to: '/services' },
  ];
  if (service.value) {
    items.push({ label: service.value.title });
  }
  return items;
});

async function loadService() {
  loading.value = true;
  try {
    const slug = route.params.slug as string;
    const response = await fetch(`/api/services/${slug}`);
    const result = await response.json();
    if (result.success) {
      service.value = result.data;
    }
  } catch (e) {
    console.error('Ошибка загрузки услуги:', e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadService);
watch(() => route.params.slug, loadService);

function formatPrice(price: number | undefined): string {
  if (!price) return 'Договорная';
  return `${price.toLocaleString('ru-RU')} ₽`;
}

</script>

<style scoped>
.service-detail-view {
  padding: var(--spacing-xl) 0;
}

.loading {
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.service-hero {
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.hero-title {
  color: var(--color-white);
  font-size: 2rem;
  font-weight: 700;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.service-details {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-xl);
}

.service-main {
  min-width: 0;
}

.price-block {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.price-block .label {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.price-block .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.description-section,
.features-section,
.order-section {
  margin-bottom: var(--spacing-xl);
}

.description-section h2,
.features-section h2,
.order-section h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.description-section p {
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.features-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.features-list li {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg-light);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
}

.check-icon {
  color: var(--color-success);
  font-weight: bold;
}

.order-section p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.order-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-order {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-order-primary {
  background: var(--color-secondary);
  color: var(--color-white);
  border: 2px solid var(--color-secondary);
}

.btn-order-primary:hover {
  background: var(--color-secondary-dark);
  border-color: var(--color-secondary-dark);
  transform: translateY(-2px);
}

.btn-order-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-order-outline:hover {
  background: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-2px);
}

.service-sidebar {
  position: sticky;
  top: var(--spacing-lg);
  align-self: start;
}

.sidebar-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.sidebar-card h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.benefits-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.benefit-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.benefits-list strong {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.benefits-list span {
  display: block;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.not-found {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.not-found h2 {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.not-found p {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.btn-back {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: background var(--transition-base);
}

.btn-back:hover {
  background: var(--color-primary-dark);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

@media (max-width: 992px) {
  .service-details {
    grid-template-columns: 1fr;
  }

  .service-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .service-hero {
    height: 200px;
  }
}
</style>
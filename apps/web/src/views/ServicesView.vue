<template>
  <main class="services-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <h1 class="page-title">Наши услуги грузоперевозок</h1>

      <p class="page-intro">
        Компания «ГрузЭкспресс» предлагает полный спектр услуг по перевозке грузов любой сложности.
        Мы работаем как с частными лицами, так и с корпоративными клиентами, обеспечивая надёжную
        и своевременную доставку по всей России.
      </p>

      <div v-if="loading" class="loading">
        <BaseLoader text="Загрузка услуг..." />
      </div>

      <div v-else-if="services.length" class="services-grid">
        <BaseCard
          v-for="service in services"
          :key="service._id || service.slug"
          :title="service.title"
          :description="service.description"
          :image="service.image"
          class="service-card"
        >
          <template #footer>
            <div class="card-footer">
              <span class="price">{{ formatPrice(service.price) }}</span>
              <router-link :to="`/services/${service.slug}`" class="btn-detail">
                Подробнее
              </router-link>
            </div>
          </template>
        </BaseCard>
      </div>

      <div v-else class="no-data">
        <p>Услуги временно недоступны. Попробуйте обновить страницу.</p>
      </div>

      <section class="info-section">
        <h2>Типы грузоперевозок</h2>

        <div class="info-block">
          <h3>Городские перевозки</h3>
          <p>
            Перевозки в пределах города — один из самых востребованных видов наших услуг.
            Мы доставляем грузы в любой район города в течение нескольких часов после оформления
            заказа. Идеально подходит для переездов, доставки стройматериалов и перевозки мебели.
          </p>
          <p>
            Наши водители знают все особенности городской логистики: ограничения по въезду в центр,
            зоны разгрузки и оптимальные маршруты. Это позволяет доставлять грузы максимально быстро
            и без лишних задержек.
          </p>
        </div>

        <div class="info-block">
          <h3>Межгородские перевозки</h3>
          <p>
            Для доставки грузов между городами мы предоставляем транспорт различной грузоподъёмности —
            от небольших фургонов до еврофур. Срок доставки зависит от расстояния и объёма груза.
            Мы работаем по всей России, включая удалённые регионы.
          </p>
          <p>
            Каждая межгородская перевозка сопровождается отслеживанием на всех этапах маршрута.
            Вы всегда можете узнать, где находится ваш груз, и получить примерное время прибытия.
          </p>
        </div>

        <div class="info-block">
          <h3>Переезды</h3>
          <p>
            Квартирные и офиссные переезды — одна из наших ключевых компетенций. Мы берём на себя
            все этапы: от упаковки и выноса вещей до расстановки мебели на новом месте.
            Наши грузчики аккуратно обращаются с любым имуществом, включая хрупкие предметы.
          </p>
        </div>

        <div class="info-block">
          <h3>Негабаритные и тяжеловесные грузы</h3>
          <p>
            Перевозка негабаритных грузов требует особого подхода и специального транспорта.
            Мы предоставляем платформы и тралы для перевозки строительной техники, промышленного
            оборудования и крупногабаритных конструкций. Каждый проект сопровождается разработкой
            индивидуального маршрута и схемы крепления.
          </p>
        </div>
      </section>

      <section class="cta-section">
        <h2>Готовы заказать перевозку?</h2>
        <p>Оформите заказ на нашем сайте, и мы доставим ваш груз быстро и надёжно!</p>
        <router-link to="/login" class="cta-btn">Оформить заказ</router-link>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import BaseCard from '@repo/ui/components/BaseCard.vue';
import BaseLoader from '@repo/ui/components/BaseLoader.vue';
import type { Service } from '@repo/types';
import type { BreadcrumbItem } from '@repo/types';

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Услуги' },
];

const services = ref<Service[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch('/api/services');
    const result = await response.json();
    if (result.success) {
      services.value = result.data.filter((s: Service) => s.isActive);
    }
  } catch (e) {
    console.error('Ошибка загрузки услуг:', e);
  } finally {
    loading.value = false;
  }
});

function formatPrice(price: number | undefined): string {
  if (!price) return 'от 1 500 ₽';
  return `${price.toLocaleString('ru-RU')} ₽`;
}
</script>

<style scoped>
.services-view {
  padding: var(--spacing-xl) 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.page-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.loading {
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.service-card {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.service-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(26, 95, 122, 0.15);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-card:nth-child(1) { animation-delay: 0.1s; }
.service-card:nth-child(2) { animation-delay: 0.15s; }
.service-card:nth-child(3) { animation-delay: 0.2s; }
.service-card:nth-child(4) { animation-delay: 0.25s; }
.service-card:nth-child(5) { animation-delay: 0.3s; }
.service-card:nth-child(6) { animation-delay: 0.35s; }

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.btn-detail {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-secondary);
  color: var(--color-white);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: background var(--transition-base), transform var(--transition-fast);
}

.btn-detail:hover {
  background: var(--color-secondary-dark);
  transform: scale(1.05);
}

.no-data {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.info-section {
  margin-bottom: var(--spacing-xl);
}

.info-section h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.info-block {
  margin-bottom: var(--spacing-lg);
}

.info-block h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.info-block p {
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.cta-section {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.cta-section h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.cta-section p {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.cta-btn {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-secondary);
  color: var(--color-white);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background var(--transition-base), transform var(--transition-fast), box-shadow var(--transition-base);
}

.cta-btn:hover {
  background: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(230, 126, 34, 0.3);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
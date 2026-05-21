<template>
  <main class="services-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <h1 class="page-title">Наши услуги грузоперевозок</h1>

      <p class="page-intro">
        Компания «ГрузЭкспресс» предлагает полный спектр услуг по перевозке
        грузов любой сложности. Мы работаем как с частными лицами, так и с
        корпоративными клиентами, обеспечивая надёжную и своевременную доставку
        по всей России.
      </p>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <span>Загрузка услуг...</span>
      </div>

      <div v-else-if="services.length" class="services-grid">
        <div
          v-for="(service, index) in services"
          :key="service._id || service.slug"
          class="service-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="service-image-wrapper">
            <img
              v-if="service.image"
              :src="service.image"
              :alt="service.title"
              class="service-image"
            />
            <div v-else class="service-image-placeholder">
              <span class="placeholder-icon">{{
                getServiceIcon(service.slug)
              }}</span>
              <span class="placeholder-text">{{ service.title }}</span>
            </div>
          </div>
          <div class="service-body">
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-desc">{{ service.description }}</p>
            <div class="service-footer">
              <span class="service-price"
                >от {{ formatPrice(service.price) }}</span
              >
              <router-link :to="`/services/${service.slug}`" class="btn-detail">
                Подробнее →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        <p>Услуги временно недоступны. Попробуйте обновить страницу.</p>
      </div>

      <section class="info-section">
        <h2>Типы грузоперевозок</h2>

        <div class="info-block">
          <img
            v-if="getPhoto('services_city')"
            :src="getPhoto('services_city')"
            alt="Городские перевозки"
            class="info-block-photo"
          />
          <img src="\icons\city-delivery.svg" class="dropdown-item-icon"/>
          <h3>Городские перевозки</h3>
          <p>
            Перевозки в пределах города — один из самых востребованных видов
            наших услуг. Мы доставляем грузы в любой район города в течение
            нескольких часов после оформления заказа. Идеально подходит для
            переездов, доставки стройматериалов и перевозки мебели.
          </p>
          <p>
            Наши водители знают все особенности городской логистики: ограничения
            по въезду в центр, зоны разгрузки и оптимальные маршруты. Это
            позволяет доставлять грузы максимально быстро и без лишних задержек.
          </p>
        </div>

        <div class="info-block">
          <img
            v-if="getPhoto('services_intercity')"
            :src="getPhoto('services_intercity')"
            alt="Межгородские перевозки"
            class="info-block-photo"
          />
          <img src="\icons\icons8-страна-48.png" class="dropdown-item-icon"/>
          <h3>Межгородские перевозки</h3>
          <p>
            Для доставки грузов между городами мы предоставляем транспорт
            различной грузоподъёмности — от небольших фургонов до еврофур. Срок
            доставки зависит от расстояния и объёма груза. Мы работаем по всей
            России, включая удалённые регионы.
          </p>
          <p>
            Каждая межгородская перевозка сопровождается отслеживанием на всех
            этапах маршрута. Вы всегда можете узнать, где находится ваш груз, и
            получить примерное время прибытия.
          </p>
        </div>

        <div class="info-block">
          <img
            v-if="getPhoto('services_moving')"
            :src="getPhoto('services_moving')"
            alt="Переезды"
            class="info-block-photo"
          />
          <img src="\icons\package.svg" class="dropdown-item-icon"/>
          <h3>Переезды</h3>
          <p>
            Квартирные и офисные переезды — одна из наших ключевых компетенций.
            Мы берём на себя все этапы: от упаковки и выноса вещей до
            расстановки мебели на новом месте. Наши грузчики аккуратно
            обращаются с любым имуществом, включая хрупкие предметы.
          </p>
        </div>

        <div class="info-block">
          <img
            v-if="getPhoto('services_cargo')"
            :src="getPhoto('services_cargo')"
            alt="Негабаритные грузы"
            class="info-block-photo"
          />
          <img src="\icons\oversized-cargo.svg" class="dropdown-item-icon"/>
          <h3>Негабаритные и тяжеловесные грузы</h3>
          <p>
            Перевозка негабаритных грузов требует особого подхода и специального
            транспорта. Мы предоставляем платформы и тралы для перевозки
            строительной техники, промышленного оборудования и крупногабаритных
            конструкций. Каждый проект сопровождается разработкой
            индивидуального маршрута и схемы крепления.
          </p>
        </div>
      </section>

      <section class="cta-section">
        <h2>Готовы заказать перевозку?</h2>
        <p>
          Оформите заказ на нашем сайте, и мы доставим ваш груз быстро и
          надёжно!
        </p>
        <router-link to="/order" class="cta-btn">Оформить заказ</router-link>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import BaseBreadcrumbs from "@repo/ui/components/BaseBreadcrumbs.vue";
import { useSiteSettings } from "../composables/useSiteSettings";
import { useScrollReveal } from "../composables/useScrollReveal";
import type { Service, BreadcrumbItem } from "@repo/types";

const { loadSettings, getPhoto } = useSiteSettings();
const { initObserver, disconnect } = useScrollReveal();

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Главная", to: "/" },
  { label: "Услуги" },
];

const services = ref<Service[]>([]);
const loading = ref(true);

const serviceIcons: Record<string, string> = {
  "gorodskaya-dostavka": "🏙️",
  "mezhgorodnie-perevozki": "🛣️",
  "ofisnye-pereezdy": "📦",
  "takelazhnye-raboty": "🏗️",
  gruzchiki: "💪",
  takelazh: "🔧",
};

function getServiceIcon(slug: string): string {
  return serviceIcons[slug] || "🚚";
}

onMounted(async () => {
  await loadSettings();
  try {
    const response = await fetch("/api/services");
    const result = await response.json();
    if (result.success) {
      services.value = result.data.filter((s: Service) => s.isActive);
    }
  } catch (e) {
    console.error("Ошибка загрузки услуг:", e);
  } finally {
    loading.value = false;
    await nextTick();
    initObserver();
  }
});

onUnmounted(() => { disconnect(); });

function formatPrice(price: number | undefined): string {
  if (!price) return "от 1 500 ₽";
  return `${price.toLocaleString("ru-RU")} ₽ / шт`;
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
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) 0;
  color: var(--color-text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.service-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition:
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.service-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(var(--color-primary-rgb), 0.12);
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

.service-image-wrapper {
  height: 200px;
  overflow: hidden;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.service-card:hover .service-image {
  transform: scale(1.05);
}

.service-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-light)
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: white;
}

.placeholder-icon {
  font-size: 3rem;
}

.placeholder-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
  opacity: 0.9;
}

.service-body {
  padding: var(--spacing-lg);
}

.service-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.service-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.service-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.service-price {
  font-size: 1.1rem;
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
  transition:
    background var(--transition-base),
    transform var(--transition-fast);
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
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.info-block h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.dropdown-item-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

.info-block-photo {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
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
  transition:
    background var(--transition-base),
    transform var(--transition-fast),
    box-shadow var(--transition-base);
}

.cta-btn:hover {
  background: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(var(--color-secondary-rgb), 0.3);
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

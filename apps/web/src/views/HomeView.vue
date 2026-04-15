<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">Надёжные грузоперевозки по всей России</h1>
        <p class="hero-subtitle">
          Компания «ГрузЭкспресс» — ваш проверенный партнёр в сфере грузоперевозок. 
          Мы доставляем грузы быстро, безопасно и по доступным ценам. 
          С 2010 года мы перевезли более 50 000 грузов по всей стране.
        </p>
        <router-link to="/services" class="hero-cta">
          <span>Посмотреть услуги</span>
        </router-link>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section features">
      <div class="container">
        <h2 class="section-title">Почему выбирают нас</h2>
        <p class="section-description">
          Мы предоставляем полный спектр услуг грузоперевозок, гарантируя высокое качество обслуживания 
          и индивидуальный подход к каждому клиенту.
        </p>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🚚</div>
            <h3 class="feature-title">Быстрая доставка</h3>
            <p class="feature-text">
              Наш автопарк из 200+ единиц техники позволяет доставить ваш груз в кратчайшие сроки. 
              Среднее время подачи транспорта — не более 2 часов.
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🛡️</div>
            <h3 class="feature-title">Гарантия сохранности</h3>
            <p class="feature-text">
              Все грузы застрахованы. Мы гарантируем полную сохранность вашего имущества 
              на протяжении всего маршрута транспортировки.
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💰</div>
            <h3 class="feature-title">Доступные цены</h3>
            <p class="feature-text">
              Прозрачное ценообразование без скрытых платежей. 
              Фиксируем стоимость в договоре — вы всегда знаете, за что платите.
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📞</div>
            <h3 class="feature-title">Поддержка 24/7</h3>
            <p class="feature-text">
              Наш диспетчерский центр работает круглосуточно. 
              Мы всегда на связи, чтобы помочь вам в любое время.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Preview Section -->
    <section class="section services-preview">
      <div class="container">
        <h2 class="section-title">Наши услуги</h2>
        <p class="section-description">
          Мы предлагаем широкий спектр услуг грузоперевозок для частных лиц и бизнеса. 
          Выберите подходящий тип перевозки и оформите заявку.
        </p>
        <div v-if="loading" class="loading-indicator">
          <div class="spinner"></div>
          <span>Загрузка услуг...</span>
        </div>
        <div v-else-if="services.length > 0" class="services-grid">
          <router-link v-for="service in services" :key="service._id" :to="`/services/${service.slug}`" class="service-card">
            <img v-if="service.image" :src="service.image" :alt="service.title" class="service-image" />
            <div v-else class="service-image-placeholder"></div>
            <div class="service-content">
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-price">от {{ service.price }} ₽ / {{ service.priceUnit }}</div>
            </div>
          </router-link>
        </div>
        <div v-else class="no-services">
          <p>Услуги пока не добавлены. Попробуйте позже.</p>
        </div>
        <div class="section-footer" v-if="services.length > 0">
          <router-link to="/services" class="btn-outline">Все услуги →</router-link>
        </div>
      </div>
    </section>

    <!-- About Preview Section -->
    <section class="section about-preview">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="section-title">О компании «ГрузЭкспресс»</h2>
            <p>
              Компания «ГрузЭкспресс» была основана в 2010 году и с тех пор зарекомендовала себя 
              как надёжный партнёр в сфере грузоперевозок. За более чем 13 лет работы мы выполнили 
              свыше 50 000 заказов и заслужили доверие тысяч клиентов по всей России.
            </p>
            <p>
              Наша миссия — сделать грузоперевозки доступными, безопасными и удобными для каждого. 
              Мы постоянно развиваем наш автопарк, обучаем сотрудников и внедряем современные технологии 
              для повышения качества обслуживания.
            </p>
            <router-link to="/about" class="btn-outline">Подробнее о нас →</router-link>
          </div>
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number">13+</div>
              <div class="stat-label">Лет на рынке</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50 000+</div>
              <div class="stat-label">Выполненных заказов</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">200+</div>
              <div class="stat-label">Единиц техники</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="section-title">Готовы заказать грузоперевозку?</h2>
          <p>
            Оставьте заявку прямо сейчас, и наши менеджеры свяжутся с вами в течение 15 минут. 
            Мы подберём оптимальный вариант доставки с учётом ваших потребностей и бюджета.
          </p>
          <router-link to="/contacts" class="btn-primary">Связаться с нами</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Service } from '@repo/types';

const services = ref<Service[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch('/api/services');
    const json = await response.json();
    if (json.success) {
      services.value = json.data.slice(0, 6);
    }
  } catch (error) {
    console.error('Error loading services:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: 80px 0;
  text-align: center;
  color: var(--color-white);
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto var(--spacing-2xl);
  line-height: 1.8;
}

.hero-cta {
  display: inline-block;
  background: var(--color-secondary);
  color: var(--color-white);
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--font-size-lg);
  transition: background var(--transition-base), transform var(--transition-base);
}

.hero-cta:hover {
  background: var(--color-secondary-dark);
  transform: translateY(-2px);
}

.features {
  background: var(--color-white);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.loading-indicator {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-gray-600);
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
  to { transform: rotate(360deg); }
}

.service-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.service-image-placeholder {
  width: 100%;
  height: 200px;
  background: var(--color-gray-200);
}

.no-services {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  color: var(--color-gray-500);
}

.section-footer {
  text-align: center;
  margin-top: var(--spacing-2xl);
}

.btn-outline {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-2xl);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all var(--transition-base);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

/* About Preview */
.about-preview {
  background: var(--color-gray-50);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.about-text p {
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-md);
  line-height: 1.8;
}

.about-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin-top: var(--spacing-xs);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
  text-align: center;
  color: var(--color-white);
}

.cta-content p {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn-primary {
  display: inline-block;
  background: var(--color-white);
  color: var(--color-secondary-dark);
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--font-size-lg);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .hero-title { font-size: var(--font-size-3xl); }
  .about-content { grid-template-columns: 1fr; }
  .about-stats { grid-template-columns: 1fr; }
}
</style>
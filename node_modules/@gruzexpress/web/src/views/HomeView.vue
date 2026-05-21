<template>
  <div class="home-view">
    <!-- Animated cursor follower -->
    <div class="cursor-glow" ref="cursorGlow"></div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <!-- Animated mesh gradient -->
        <div class="hero-mesh"></div>
        <!-- Floating orbs -->
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
        <div class="hero-orb hero-orb-3"></div>
        <div class="hero-orb hero-orb-4"></div>
        <!-- Particles -->
        <div class="hero-particles">
          <span v-for="n in 20" :key="n" class="particle" :style="particleStyle(n)"></span>
        </div>
        <!-- Grid lines -->
        <div class="hero-grid"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-badge scroll-reveal">
          <span class="badge-pulse"></span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Лидер рынка грузоперевозок
        </div>
        <h1 class="hero-title scroll-reveal" style="transition-delay:.1s">
          Надёжные грузоперевозки<br>
          <span class="hero-highlight">по всей России</span>
        </h1>
        <p class="hero-subtitle scroll-reveal" style="transition-delay:.2s">
          Компания «ГрузЭкспресс» — ваш проверенный партнёр. Доставляем грузы быстро,
          безопасно и по доступным ценам с 2010 года.
        </p>
        <div class="hero-actions scroll-reveal" style="transition-delay:.3s">
          <router-link to="/order" class="btn-hero-primary ripple">
            <span>Оформить заявку</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
          <router-link to="/services" class="btn-hero-secondary">Посмотреть услуги</router-link>
        </div>
        <div class="hero-stats scroll-reveal" style="transition-delay:.4s">
          <div v-for="stat in heroStats" :key="stat.label" class="hero-stat">
            <span class="hero-stat-value" :data-target="stat.rawValue">{{ stat.displayValue }}</span>
            <span class="hero-stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <!-- Scroll indicator -->
      <div class="scroll-indicator scroll-reveal" style="transition-delay:.6s">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span>Прокрутите вниз</span>
      </div>
    </section>

    <!-- Ticker -->
    <section class="ticker-section">
      <div class="ticker-track">
        <span v-for="(item, i) in tickerItems" :key="'a'+i" class="ticker-item">
          <span class="ticker-dot"></span>{{ item }}
        </span>
        <span v-for="(item, i) in tickerItems" :key="'b'+i" class="ticker-item">
          <span class="ticker-dot"></span>{{ item }}
        </span>
      </div>
    </section>

    <!-- Как мы работаем -->
    <section class="section process-section">
      <div class="container">
        <h2 class="section-title scroll-reveal">Как мы работаем</h2>
        <p class="section-description scroll-reveal">Простой и прозрачный процесс — от заявки до доставки</p>
        <div class="process-steps">
          <div v-for="(step, i) in processSteps" :key="i" class="process-step-group">
            <div class="process-step scroll-reveal" :style="{ transitionDelay: `${0.1 + i * 0.15}s` }">
              <div class="step-glow"></div>
              <div class="step-number">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="step-icon" v-html="step.icon"></div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
            <div v-if="i < processSteps.length - 1" class="process-arrow scroll-reveal" :style="{ transitionDelay: `${0.2 + i * 0.15}s` }">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Преимущества -->
    <section class="section features-section">
      <div class="features-bg">
        <div class="features-orb features-orb-1"></div>
        <div class="features-orb features-orb-2"></div>
      </div>
      <div class="container">
        <h2 class="section-title light scroll-reveal">Почему выбирают нас</h2>
        <p class="section-description light scroll-reveal">Полный спектр услуг с гарантией качества и индивидуальным подходом</p>
        <div class="features-grid">
          <div v-for="(f, i) in features" :key="i" class="feature-card scroll-reveal" :style="{ transitionDelay: `${0.1 + i * 0.08}s` }">
            <div class="feature-card-glow"></div>
            <div class="feature-icon-wrap" v-html="f.icon"></div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Услуги превью -->
    <section class="section services-section">
      <div class="container">
        <h2 class="section-title scroll-reveal">Наши услуги</h2>
        <p class="section-description scroll-reveal">Широкий спектр услуг для частных лиц и бизнеса</p>
        <div v-if="loading" class="loading-state"><div class="spinner"></div><span>Загрузка...</span></div>
        <div v-else-if="services.length" class="services-grid">
          <router-link v-for="(s, i) in services" :key="s._id" :to="`/services/${s.slug}`"
            class="service-card scroll-reveal" :style="{ transitionDelay: `${i * 0.08}s` }">
            <div class="service-img-wrap">
              <img v-if="s.image" :src="s.image" :alt="s.title" class="service-img" loading="lazy" />
              <div v-else class="service-img-placeholder">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="6" width="22" height="12" rx="2"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              </div>
              <div class="service-shine"></div>
            </div>
            <div class="service-body">
              <h3>{{ s.title }}</h3>
              <p class="service-desc">{{ s.description }}</p>
              <div class="service-meta">
                <span class="service-price">от {{ s.price }} ₽ / {{ s.priceUnit }}</span>
                <span class="service-link">
                  Подробнее
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </router-link>
        </div>
        <div v-else class="empty-state"><p>Услуги пока не добавлены</p></div>
        <div v-if="services.length" class="section-cta scroll-reveal">
          <router-link to="/services" class="btn-outline">Все услуги →</router-link>
        </div>
      </div>
    </section>

    <!-- Галерея превью -->
    <section class="section gallery-section">
      <div class="container">
        <h2 class="section-title scroll-reveal">Наша галерея</h2>
        <p class="section-description scroll-reveal">Фотографии техники, грузов и рабочих процессов</p>
        <div v-if="galleryLoading" class="loading-state"><div class="spinner"></div></div>
        <div v-else-if="galleryItems.length" class="gallery-grid">
          <div v-for="(item, i) in galleryItems" :key="item._id"
            class="gallery-item scroll-reveal" :style="{ transitionDelay: `${i * 0.06}s` }"
            @click="openLightbox(item)">
            <img :src="item.imageUrl" :alt="item.title" class="gallery-img" loading="lazy" />
            <div class="gallery-overlay">
              <div class="gallery-zoom-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
              </div>
            </div>
            <div class="gallery-label">{{ item.title }}</div>
          </div>
        </div>
        <div v-else class="empty-state"><p>Фотографии скоро появятся</p></div>
        <div v-if="galleryItems.length" class="section-cta scroll-reveal">
          <router-link to="/gallery" class="btn-outline">Вся галерея →</router-link>
        </div>
      </div>
    </section>

    <!-- О компании -->
    <section class="section about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-text scroll-reveal-left">
            <span class="about-label">О нас</span>
            <h2>О компании «ГрузЭкспресс»</h2>
            <p>Основана в 2010 году. За 13+ лет выполнили свыше 50 000 заказов по всей России.</p>
            <p>Наша миссия — сделать грузоперевозки доступными, безопасными и удобными для каждого клиента.</p>
            <router-link to="/about" class="btn-outline">Подробнее о нас →</router-link>
          </div>
          <div class="about-stats scroll-reveal-right">
            <div v-for="stat in heroStats" :key="stat.label" class="about-stat-card">
              <div class="about-stat-icon">
                <svg v-if="stat.label.includes('опыта')" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <svg v-else-if="stat.label.includes('Заказов')" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <svg v-else-if="stat.label.includes('техники')" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="22" height="12" rx="2"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div class="about-stat-value">{{ stat.value }}</div>
              <div class="about-stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Отзывы -->
    <section class="section testimonials-section">
      <div class="container">
        <h2 class="section-title scroll-reveal">Отзывы клиентов</h2>
        <p class="section-description scroll-reveal">Что говорят о нас наши клиенты</p>
        <div class="testimonials-grid">
          <div v-for="(t, i) in testimonials" :key="i" class="testimonial-card scroll-reveal" :style="{ transitionDelay: `${0.1 + i * 0.1}s` }">
            <div class="testimonial-quote">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" opacity="0.1"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z"/></svg>
            </div>
            <div class="testimonial-stars">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <p class="testimonial-text">«{{ t.text }}»</p>
            <div class="testimonial-author">
              <div class="author-avatar">{{ t.initials }}</div>
              <div>
                <div class="author-name">{{ t.name }}</div>
                <div class="author-role">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="cta-bg">
        <div class="cta-orb cta-orb-1"></div>
        <div class="cta-orb cta-orb-2"></div>
      </div>
      <div class="container">
        <div class="cta-box scroll-reveal">
          <h2>Готовы заказать грузоперевозку?</h2>
          <p>Оставьте заявку — менеджер свяжется в течение 15 минут</p>
          <div class="cta-actions">
            <router-link to="/order" class="btn-cta-primary ripple">Оформить заявку</router-link>
            <a href="tel:+78005553535" class="btn-cta-phone">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +7 (800) 555-35-35
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxItem" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div class="lightbox-content">
            <img :src="lightboxItem.imageUrl" :alt="lightboxItem.title" class="lightbox-img" />
            <div v-if="lightboxItem.title" class="lightbox-info">
              <h3>{{ lightboxItem.title }}</h3>
              <p v-if="lightboxItem.description">{{ lightboxItem.description }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import type { Service, GalleryItem } from '@repo/types';
import { useScrollReveal } from '../composables/useScrollReveal';
import { useSiteSettings } from '../composables/useSiteSettings';

const { initObserver, disconnect: disconnectObserver } = useScrollReveal();
const { loadSettings, getSetting } = useSiteSettings();

const services = ref<Service[]>([]);
const loading = ref(true);
const galleryItems = ref<GalleryItem[]>([]);
const galleryLoading = ref(true);
const lightboxItem = ref<GalleryItem | null>(null);
const cursorGlow = ref<HTMLElement | null>(null);

/* === Данные из БД === */
const heroStats = ref([
  { value: '13+', label: 'Лет опыта', displayValue: '13+', rawValue: 13 },
  { value: '50 000+', label: 'Заказов', displayValue: '0', rawValue: 50000 },
  { value: '200+', label: 'Единиц техники', displayValue: '200+', rawValue: 200 },
  { value: '98%', label: 'Довольных клиентов', displayValue: '0%', rawValue: 98 },
]);

const tickerItems = [
  'Городские перевозки', 'Междугородние рейсы', 'Офисные переезды',
  'Негабаритные грузы', 'Страхование грузов', 'GPS-отслеживание',
  'Доставка 24/7', '200+ единиц техники',
];

function gs(key: string, fallback: string): string {
  return getSetting(key) || fallback;
}

function iconHtml(value: string): string {
  if (!value) return '';
  // Если значение — URL изображения, оборачиваем в <img>
  if (/\.(png|jpe?g|gif|svg|webp|ico|bmp|avif)(\?.*)?$/i.test(value) || /^https?:\/\//.test(value)) {
    return `<img src="${value}" alt="" style="width:32px;height:32px;object-fit:contain;" />`;
  }
  // Иначе это эмодзи или текст — возвращаем как есть
  return value;
}

const processSteps = computed(() => [
  { title: gs('process_step_1_title', 'Оставляете заявку'), text: gs('process_step_1_text', 'Заполните форму или позвоните. Менеджер свяжется в течение 15 минут.'), icon: iconHtml(gs('icon_process_1', '📝')) },
  { title: gs('process_step_2_title', 'Расчёт и согласование'), text: gs('process_step_2_text', 'Подберём транспорт и зафиксируем цену в договоре.'), icon: iconHtml(gs('icon_process_2', '📋')) },
  { title: gs('process_step_3_title', 'Доставка'), text: gs('process_step_3_text', 'Отслеживайте груз в реальном времени через личный кабинет.'), icon: iconHtml(gs('icon_process_3', '🚚')) },
  { title: gs('process_step_4_title', 'Получение груза'), text: gs('process_step_4_text', 'Доставим точно в срок. Проверьте и подпишите акт приёма.'), icon: iconHtml(gs('icon_process_4', '✅')) },
]);

const features = computed(() => [
  { title: gs('feature_1_title', 'Быстрая доставка'), text: gs('feature_1_text', 'Автопарк 200+ единиц техники. Среднее время подачи — не более 2 часов.'), icon: iconHtml(gs('icon_feature_1', '🚚')) },
  { title: gs('feature_2_title', 'Гарантия сохранности'), text: gs('feature_2_text', 'Все грузы застрахованы. Полная сохранность на протяжении маршрута.'), icon: iconHtml(gs('icon_feature_2', '🛡️')) },
  { title: gs('feature_3_title', 'Доступные цены'), text: gs('feature_3_text', 'Прозрачное ценообразование без скрытых платежей. Фиксация цены в договоре.'), icon: iconHtml(gs('icon_feature_3', '💰')) },
  { title: gs('feature_4_title', 'Поддержка 24/7'), text: gs('feature_4_text', 'Диспетчерский центр работает круглосуточно. Всегда на связи.'), icon: iconHtml(gs('icon_feature_4', '📞')) },
  { title: gs('feature_5_title', 'GPS-отслеживание'), text: gs('feature_5_text', 'Все транспортные средства оснащены GPS/ГЛОНАСС.'), icon: iconHtml(gs('icon_feature_5', '📍')) },
  { title: gs('feature_6_title', 'Лучшие специалисты'), text: gs('feature_6_text', '300+ профессионалов с многолетним опытом и регулярным обучением.'), icon: iconHtml(gs('icon_feature_6', '🏆')) },
]);

const testimonials = computed(() => [
  { name: gs('testimonial_1_name', 'Алексей Иванов'), initials: 'АИ', role: gs('testimonial_1_role', 'Директор ООО «ТехноСервис»'), text: gs('testimonial_1_text', 'Заказывали перевозку офисного оборудования при переезде. Всё организовано на высшем уровне.') },
  { name: gs('testimonial_2_name', 'Мария Петрова'), initials: 'МП', role: gs('testimonial_2_role', 'Логист АО «ПромТорг»'), text: gs('testimonial_2_text', 'Работаем с «ГрузЭкспресс» уже 3 года. Ни одного повреждённого груза.') },
  { name: gs('testimonial_3_name', 'Сергей Козлов'), initials: 'СК', role: gs('testimonial_3_role', 'Инженер ЗАО «МеталлПром»'), text: gs('testimonial_3_text', 'Перевозили негабаритное оборудование. Подобрали спецтранспорт и оформили все документы.') },
]);

/* === Частицы === */
function particleStyle(n: number) {
  const x = Math.random() * 100;
  const size = 2 + Math.random() * 4;
  const duration = 8 + Math.random() * 12;
  const delay = Math.random() * 10;
  const dx = -50 + Math.random() * 100;
  const dy = -150 - Math.random() * 200;
  return {
    left: `${x}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    '--dx': `${dx}px`,
    '--dy': `${dy}px`,
  };
}

/* === Анимация счётчиков === */
function animateCounters() {
  const targets: { idx: number; target: number; suffix: string; duration: number; format?: boolean }[] = [
    { idx: 0, target: 13, suffix: '+', duration: 2000 },
    { idx: 1, target: 50000, suffix: '+', duration: 2500, format: true },
    { idx: 2, target: 200, suffix: '+', duration: 2000 },
    { idx: 3, target: 98, suffix: '%', duration: 2000 },
  ];

  targets.forEach(({ idx, target, suffix, duration, format }) => {
    const start = performance.now();
    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(target * eased);
      const display = format ? current.toLocaleString('ru-RU') : String(current);
      heroStats.value[idx] = { ...heroStats.value[idx], displayValue: display + suffix };
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* === Cursor glow === */
function handleMouseMove(e: MouseEvent) {
  if (cursorGlow.value) {
    cursorGlow.value.style.left = `${e.clientX}px`;
    cursorGlow.value.style.top = `${e.clientY}px`;
  }
}

/* === Загрузка данных === */
async function loadServices() {
  try {
    const res = await fetch('/api/services');
    const json = await res.json();
    if (json.success) services.value = json.data.slice(0, 6);
  } catch (e) { console.error('Error loading services:', e); }
  finally { loading.value = false; }
}

async function loadGallery() {
  try {
    const res = await fetch('/api/gallery?limit=6');
    const json = await res.json();
    if (json.success && json.data) galleryItems.value = json.data;
  } catch (e) { console.error('Error loading gallery:', e); }
  finally { galleryLoading.value = false; }
}

/* === Lightbox === */
function openLightbox(item: GalleryItem) {
  lightboxItem.value = item;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxItem.value = null;
  document.body.style.overflow = '';
}

/* === Scroll progress === */
function updateScrollProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (scrolled / total) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
}

onMounted(async () => {
  await Promise.all([loadSettings(), loadServices(), loadGallery()]);
  await nextTick();
  initObserver();
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // Start counter animation after hero is visible
  setTimeout(animateCounters, 800);
});

onUnmounted(() => {
  disconnectObserver();
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('scroll', updateScrollProgress);
});
</script>

<style scoped>
/* ===== CURSOR GLOW ===== */
.cursor-glow {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--color-secondary-rgb), 0.06) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9998;
  transition: left 0.15s ease-out, top 0.15s ease-out;
  display: none;
}

@media (hover: hover) {
  .cursor-glow { display: block; }
}

/* ===== HERO ===== */
.hero {
  position: relative;
  background: linear-gradient(160deg, #040d19 0%, #0a2a3a 30%, var(--color-primary) 60%, #0a3642 100%);
  padding: 120px 0 80px;
  text-align: center;
  color: #fff;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Animated mesh gradient */
.hero-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(var(--color-secondary-rgb), 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(var(--color-secondary-rgb), 0.08) 0%, transparent 40%);
  animation: breathe 8s ease-in-out infinite;
}

/* Grid overlay */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: .2;
}

.hero-orb-1 {
  width: 500px; height: 500px;
  background: var(--color-secondary);
  top: -150px; right: -150px;
  animation: morphBlob 12s ease-in-out infinite, heroFloat 10s ease-in-out infinite;
}

.hero-orb-2 {
  width: 350px; height: 350px;
  background: #3498db;
  bottom: -100px; left: -80px;
  animation: morphBlob 14s ease-in-out infinite 2s, heroFloat 12s ease-in-out infinite 1s;
}

.hero-orb-3 {
  width: 250px; height: 250px;
  background: var(--color-accent);
  top: 40%; left: 60%;
  animation: morphBlob 10s ease-in-out infinite 4s, heroFloat 9s ease-in-out infinite 2s;
}

.hero-orb-4 {
  width: 180px; height: 180px;
  background: #e76f51;
  top: 20%; left: 10%;
  animation: morphBlob 16s ease-in-out infinite 1s, heroFloat 11s ease-in-out infinite 3s;
}

/* Particles */
.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -10px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: particleDrift linear infinite;
  opacity: 0;
}

.hero-content { position: relative; z-index: 1; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  padding: 8px 20px;
  border-radius: 50px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-xl);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: relative;
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: var(--color-success);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
}

.hero-title {
  font-size: clamp(2.5rem, 5.5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  letter-spacing: -0.03em;
}

.hero-highlight {
  background: linear-gradient(135deg, #f4a261, #e76f51, #f4a261);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  opacity: .8;
  max-width: 620px;
  margin: 0 auto var(--spacing-2xl);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-3xl);
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  background-size: 200% auto;
  color: #fff;
  padding: 16px 36px;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 24px rgba(var(--color-secondary-rgb), .35);
  position: relative;
  overflow: hidden;
}

.btn-hero-primary:hover {
  background-position: right center;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 36px rgba(var(--color-secondary-rgb), .5);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.06);
  color: #fff;
  padding: 16px 36px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--font-size-lg);
  text-decoration: none;
  border: 2px solid rgba(255,255,255,.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-hero-secondary:hover {
  background: rgba(255,255,255,.15);
  border-color: rgba(255,255,255,.4);
  transform: translateY(-3px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2xl);
  background: rgba(255,255,255,.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl) var(--spacing-2xl);
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.hero-stat::after {
  content: '';
  position: absolute;
  right: calc(-1 * var(--spacing-xl));
  top: 20%;
  height: 60%;
  width: 1px;
  background: rgba(255,255,255,.15);
}

.hero-stat:last-child::after { display: none; }

.hero-stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #fff, var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-stat-label {
  font-size: var(--font-size-xs);
  opacity: .65;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,.4);
  font-size: var(--font-size-xs);
  animation: float 3s ease-in-out infinite;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(255,255,255,.3);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.scroll-wheel {
  width: 3px;
  height: 8px;
  background: rgba(255,255,255,.6);
  border-radius: 2px;
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(8px); opacity: 0.3; }
}

/* ===== TICKER ===== */
.ticker-section {
  background: var(--color-primary-dark);
  padding: var(--spacing-md) 0;
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,.05);
  border-bottom: 1px solid rgba(255,255,255,.05);
}

.ticker-track {
  display: flex;
  gap: var(--spacing-3xl);
  animation: ticker 30s linear infinite;
  white-space: nowrap;
  width: max-content;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,.75);
  font-weight: 600;
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.ticker-dot {
  width: 6px; height: 6px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-accent));
  border-radius: 50%;
  flex-shrink: 0;
}

@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

/* ===== PROCESS ===== */
.process-section {
  background: #fff;
  position: relative;
}

.process-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gray-200), transparent);
}

.process-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.process-step-group {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.process-step {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  width: 220px;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.process-step::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1), transparent, rgba(var(--color-secondary-rgb), 0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.process-step:hover::before { opacity: 1; }

.process-step:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(var(--color-primary-rgb), .08);
}

.step-glow {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(var(--color-secondary-rgb), 0.15) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.process-step:hover .step-glow { opacity: 1; }

.step-number {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary);
  opacity: .1;
  margin-bottom: var(--spacing-sm);
  position: relative;
}

.step-icon {
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-icon :deep(svg) { margin: 0 auto; }
.step-icon :deep(img) {
  width: 40px;
  height: 40px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.process-step h3 {
  font-size: var(--font-size-base);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
  position: relative;
}

.process-step p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  position: relative;
}

.process-arrow {
  display: flex;
  align-items: center;
  padding-top: 60px;
  color: var(--color-gray-300);
  flex-shrink: 0;
  animation: breathe 3s ease-in-out infinite;
}

/* ===== FEATURES ===== */
.features-section {
  background: var(--color-gray-900);
  position: relative;
  overflow: hidden;
}

.features-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.features-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
}

.features-orb-1 {
  width: 400px; height: 400px;
  background: var(--color-secondary);
  top: -100px; right: -100px;
  animation: morphBlob 15s ease-in-out infinite;
}

.features-orb-2 {
  width: 300px; height: 300px;
  background: var(--color-primary-light);
  bottom: -100px; left: -50px;
  animation: morphBlob 12s ease-in-out infinite 3s;
}

.section-title.light { color: #fff; }
.section-description.light { color: rgba(255,255,255,.55); }

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  position: relative;
}

.feature-card {
  padding: var(--spacing-xl);
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: var(--radius-xl);
  text-align: center;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
}

.feature-card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(var(--color-secondary-rgb), 0.08) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.feature-card:hover .feature-card-glow { opacity: 1; }

.feature-card:hover {
  background: rgba(255,255,255,.07);
  border-color: rgba(var(--color-secondary-rgb), .25);
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 24px 48px rgba(0,0,0,.3);
}

.feature-icon-wrap {
  width: 64px; height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
  color: #fff;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
  font-size: 1.5rem;
  overflow: hidden;
}
.feature-icon-wrap :deep(img) {
  width: 36px;
  height: 36px;
  object-fit: contain;
  display: block;
}

.feature-card:hover .feature-icon-wrap {
  transform: scale(1.15) rotate(-5deg);
  box-shadow: 0 8px 24px rgba(var(--color-secondary-rgb), .4);
}

.feature-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: #fff;
}

.feature-card p {
  font-size: var(--font-size-sm);
  color: rgba(255,255,255,.5);
  line-height: 1.6;
}

/* ===== SERVICES ===== */
.services-section {
  background: #fff;
  position: relative;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.service-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--color-gray-100);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px) scale(1.01);
  box-shadow: 0 24px 48px rgba(var(--color-primary-rgb), .12);
  border-color: rgba(var(--color-primary-rgb), .1);
}

.service-img-wrap {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.service-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.service-card:hover .service-img { transform: scale(1.08); }

.service-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 55%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.service-card:hover .service-shine { transform: translateX(100%); }

.service-img-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.service-body { padding: var(--spacing-lg); flex: 1; display: flex; flex-direction: column; }

.service-body h3 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.service-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-md);
  border-top: 1px solid var(--color-gray-100);
}

.service-price { font-size: var(--font-size-sm); font-weight: 700; color: var(--color-primary); }

.service-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-secondary);
  transition: gap 0.3s ease;
}

.service-card:hover .service-link { gap: 8px; }

/* ===== GALLERY ===== */
.gallery-section { background: var(--color-gray-50); }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.gallery-item {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 48px rgba(0,0,0,.18);
}

.gallery-img { width: 100%; height: 220px; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }

.gallery-item:hover .gallery-img { transform: scale(1.08); }

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.gallery-zoom-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transform: scale(0.5);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-item:hover .gallery-zoom-icon { transform: scale(1); }

.gallery-label {
  padding: var(--spacing-md);
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: #fff;
}

/* ===== ABOUT ===== */
.about-section { background: var(--color-gray-50); }

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.about-label {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-md);
  position: relative;
  padding-left: 24px;
}

.about-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 2px;
  background: var(--color-secondary);
  border-radius: 1px;
}

.about-text h2 {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.about-text p {
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-md);
  line-height: 1.8;
}

.about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); }

.about-stat-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: #fff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid transparent;
}

.about-stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,.08);
  border-color: rgba(var(--color-primary-rgb), .08);
}

.about-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1), rgba(var(--color-primary-rgb), 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
  color: var(--color-primary);
}

.about-stat-value {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.about-stat-label { font-size: var(--font-size-sm); color: var(--color-gray-600); margin-top: 4px; }

/* ===== TESTIMONIALS ===== */
.testimonials-section { background: #fff; }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.testimonial-card {
  background: var(--color-gray-50);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-gray-100);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,.08);
}

.testimonial-quote {
  position: absolute;
  top: 16px;
  right: 20px;
  color: var(--color-primary);
}

.testimonial-stars {
  display: flex;
  gap: 2px;
  color: #f59e0b;
  margin-bottom: var(--spacing-md);
}

.testimonial-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-lg);
  font-style: italic;
  position: relative;
}

.testimonial-author { display: flex; align-items: center; gap: var(--spacing-md); }

.author-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--font-size-sm);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), .2);
}

.author-name { font-weight: 700; font-size: var(--font-size-sm); }
.author-role { font-size: var(--font-size-xs); color: var(--color-text-secondary); }

/* ===== CTA ===== */
.cta-section {
  background: linear-gradient(135deg, #040d19 0%, var(--color-primary) 50%, #0a3642 100%);
  position: relative;
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cta-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.cta-orb-1 {
  width: 300px; height: 300px;
  background: var(--color-secondary);
  top: -50px; right: 10%;
  animation: morphBlob 12s ease-in-out infinite;
}

.cta-orb-2 {
  width: 250px; height: 250px;
  background: var(--color-accent);
  bottom: -80px; left: 15%;
  animation: morphBlob 14s ease-in-out infinite 2s;
}

.cta-box {
  text-align: center;
  color: #fff;
  padding: var(--spacing-3xl) 0;
  position: relative;
}

.cta-box h2 {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  letter-spacing: -0.02em;
}

.cta-box p {
  font-size: var(--font-size-lg);
  opacity: .8;
  margin-bottom: var(--spacing-xl);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions { display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap; }

.btn-cta-primary {
  display: inline-block;
  background: #fff;
  color: var(--color-secondary-dark);
  padding: 16px 40px;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.btn-cta-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0,0,0,.2);
}

.btn-cta-phone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.08);
  border: 2px solid rgba(255,255,255,.25);
  color: #fff;
  padding: 16px 40px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.btn-cta-phone:hover {
  background: rgba(255,255,255,.18);
  border-color: rgba(255,255,255,.5);
  transform: translateY(-3px);
}

/* ===== LIGHTBOX ===== */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.94);
  z-index: var(--z-toast);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.lightbox-close {
  position: absolute;
  top: 20px; right: 20px;
  width: 52px; height: 52px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1;
}

.lightbox-close:hover {
  background: rgba(255,255,255,.2);
  transform: rotate(90deg);
}

.lightbox-content { max-width: 90vw; text-align: center; }

.lightbox-img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: var(--radius-md); }

.lightbox-info { margin-top: var(--spacing-lg); color: #fff; }
.lightbox-info h3 { font-size: var(--font-size-xl); margin-bottom: var(--spacing-xs); }
.lightbox-info p { color: rgba(255,255,255,.6); font-size: var(--font-size-sm); }

.lightbox-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.lightbox-enter-from { opacity: 0; transform: scale(0.95); }
.lightbox-leave-to { opacity: 0; transform: scale(0.95); }

/* ===== COMMON ===== */
.loading-state {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  color: var(--color-text-secondary);
}

.section-cta { text-align: center; margin-top: var(--spacing-2xl); }

.btn-outline {
  display: inline-block;
  padding: 14px 32px;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.btn-outline::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}

.btn-outline:hover {
  color: #fff;
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.btn-outline:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1024px) {
  .process-arrow { display: none; }
  .process-steps { flex-direction: column; align-items: center; }
  .process-step-group { flex-direction: column; align-items: center; }
  .process-step { width: 100%; max-width: 300px; }
  .hero-stats { flex-wrap: wrap; gap: var(--spacing-lg); }
}

@media (max-width: 768px) {
  .hero { padding: 80px 0 60px; min-height: auto; }
  .hero-title { font-size: clamp(1.8rem, 6vw, 2.5rem); }
  .features-grid, .services-grid { grid-template-columns: 1fr; }
  .about-grid { grid-template-columns: 1fr; }
  .about-stats { grid-template-columns: 1fr 1fr; }
  .hero-stats { flex-direction: column; align-items: center; }
  .hero-stat::after { display: none; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .scroll-indicator { display: none; }
  .cursor-glow { display: none !important; }
  .hero-particles { display: none; }
}

@media (max-width: 480px) {
  .gallery-grid { grid-template-columns: 1fr; }
  .about-stats { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; align-items: center; }
  .btn-hero-primary, .btn-hero-secondary { width: 100%; justify-content: center; }
}
</style>
<template>
  <div class="about-view">
    <section class="page-header">
      <div class="container">
        <h1 class="hero-title">О компании «ГрузЭкспресс»</h1>
        <p class="hero-subtitle">
          Мы делаем грузоперевозки доступными, безопасными и удобными для
          каждого
        </p>
      </div>
    </section>

    <section class="page-content">
      <div class="container">
        <BaseBreadcrumbs
          :items="[{ label: 'Главная', to: '/' }, { label: 'О компании' }]"
        />

        <!-- Фото для админа -->
        <div v-if="aboutHero" class="about-hero-photo" style="position:relative;margin-bottom:2rem">
          <img :src="aboutHero" alt="О компании" style="width:100%;max-height:400px;object-fit:cover;border-radius:12px" />
          <AdminPhotoEditor setting-key="about_hero" label="Фото героя (О компании)" @saved="(url: string) => aboutHero = url" />
        </div>

        <div v-else class="about-hero-placeholder" style="position:relative;margin-bottom:2rem">
          <div style="height:200px;background:linear-gradient(135deg,var(--color-primary),var(--color-primary-light));border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:3rem">🏢</div>
          <AdminPhotoEditor setting-key="about_hero" label="Фото героя (О компании)" style="position:absolute;top:8px;right:8px" />
        </div>

        <div class="text-block">
          <h3>Наша история</h3>
          <p>
            Компания «ГрузЭкспресс» была основана в 2010 году в Москве группой
            профессионалов логистической отрасли. Начав свою деятельность с
            небольшого парка из 10 грузовых автомобилей, мы за более чем 13 лет
            выросли в одну из крупнейших транспортно-логистических компаний
            России. Сегодня наш автопарк насчитывает свыше 200 единиц техники
            различной грузоподъёмности — от малотоннажных фургонов для городских
            перевозок до мощных большегрузных тягачей для магистральных рейсов.
          </p>
          <p>
            За годы работы мы заслужили доверие тысяч клиентов — от частных лиц,
            которым необходимо перевезти личные вещи при переезде, до крупных
            промышленных предприятий, требующих регулярных поставок сырья и
            готовой продукции. Мы гордимся тем, что 98% наших клиентов
            рекомендуют нас своим партнёрам и знакомым.
          </p>
        </div>

        <div class="text-block">
          <h3>Наша миссия и ценности</h3>
          <p>
            Миссия компании «ГрузЭкспресс» — сделать качественные грузоперевозки
            доступными для каждого, обеспечивая максимальную надёжность и
            безопасность транспортировки. Мы стремимся к тому, чтобы каждый
            клиент чувствовал уверенность в сохранности своего груза и получал
            удовольствие от сотрудничества с нами.
          </p>
          <p>
            Наши ключевые ценности: надёжность — мы всегда выполняем взятые на
            себя обязательства; прозрачность — честное ценообразование без
            скрытых платежей; клиентоориентированность — индивидуальный подход к
            потребностям каждого заказчика; профессионализм — наша команда
            состоит из опытных специалистов.
          </p>
        </div>

        <div class="text-block">
          <h3>Наш автопарк и возможности</h3>
          <p>
            Автопарк «ГрузЭкспресс» включает более 200 единиц техники, что
            позволяет нам подбирать оптимальный транспорт для любых задач:
            малотоннажные фургоны до 1,5 тонн для городских перевозок;
            среднетоннажные грузовики до 5 тонн для региональных маршрутов;
            большегрузные автомобили до 20 тонн для магистральных перевозок;
            рефрижераторы для транспортировки скоропортящихся продуктов;
            автомобили с гидробортом для работы в стеснённых условиях;
            специализированный транспорт для негабаритных грузов.
          </p>
          <p>
            Вся техника регулярно проходит техническое обслуживание и оснащена
            системами спутникового мониторинга GPS/ГЛОНАСС, что позволяет
            отслеживать местоположение груза в режиме реального времени и
            контролировать соблюдения температурного режима при транспортировке
            грузов, требующих особых условий.
          </p>
        </div>

        <div class="text-block">
          <h3>Наша команда</h3>
          <p>
            Команда «ГрузЭкспресс» — это более 300 профессионалов, каждый из
            которых вносит свой вклад в общий успех. Наши водители имеют
            многолетний опыт работы и регулярное повышение квалификации. Логисты
            разрабатывают оптимальные маршруты, учитывая дорожную ситуацию,
            погодные условия и особенности груза. Менеджеры по работе с
            клиентами обеспечивают оперативное решение любых вопросов на всех
            этапах сотрудничества. Служба контроля качества постоянно
            анализирует показатели и внедряет улучшения в рабочие процессы.
          </p>
        </div>

        <div class="stats-section">
          <h2
            class="section-title"
            style="text-align: center; margin-bottom: var(--spacing-2xl)"
          >
            Наши достижения в цифрах
          </h2>
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
              <div class="stat-number">300+</div>
              <div class="stat-label">Сотрудников</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">85</div>
              <div class="stat-label">Регионов доставки</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BaseBreadcrumbs } from '@repo/ui';
import { BreadcrumbItem } from '@repo/types';
import AdminPhotoEditor from '../components/AdminPhotoEditor.vue';
import { useSiteSettings } from '../composables/useSiteSettings';

const { loadSettings, getSetting } = useSiteSettings();
const aboutHero = ref('');

onMounted(async () => {
  await loadSettings();
  aboutHero.value = getSetting('about_hero');
});
</script>

<style scoped>
.about-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
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
</style>

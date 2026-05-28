<template>
  <main class="delivery-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <h1 class="page-title">Доставка</h1>

      <section class="delivery-intro">
        <img v-if="getPhoto('delivery_hero')" :src="getPhoto('delivery_hero')" alt="Доставка" class="section-photo" />
        <p>
          Компания «ГрузЭкспресс» обеспечивает надёжную доставку грузов по всей
          России. Мы предлагаем гибкие условия и различные варианты
          транспортировки, чтобы каждый клиент получил оптимальное решение для
          своих задач.
        </p>
      </section>

      <section class="delivery-section">
        <h2>Зоны доставки</h2>

        <div class="delivery-zones">
          <div class="zone-card">
            <img src="\icons\city-delivery.svg" class="zone-icon"/>
            <h3>По городу</h3>
            <p>
              Доставка в пределах города осуществляется в течение нескольких
              часов после оформления заказа. Мы работаем во всех районах и
              микрорайонах, обеспечивая максимальную оперативность.
            </p>
            <ul class="zone-features">
              <li>Срок доставки — от 1 до 4 часов</li>
              <li>Бесплатная подача транспорта</li>
              <li>Грузчики включены в стоимость</li>
            </ul>
          </div>

          <div class="zone-card">
            <img src="\icons\icons8-карта-50.png" class="zone-icon"/>
            <h3>По области</h3>
            <p>
              Перевозки в пределах области выполняются в течение одного рабочего
              дня. Мы охватываем все пригородные районы и ближайшие населённые
              пункты.
            </p>
            <ul class="zone-features">
              <li>Срок доставки — до 24 часов</li>
              <li>Фиксированная стоимость по тарифам</li>
              <li>Отслеживание на всех этапах</li>
            </ul>
          </div>

          <div class="zone-card">
            <img src="\icons\icons8-страна-48.png" class="zone-icon"/>
            <h3>По России</h3>
            <p>
              Межгородские перевозки в любую точку России. Мы работаем с
              крупными транспортными компаниями и обеспечиваем надёжную доставку
              на дальние расстояния.
            </p>
            <ul class="zone-features">
              <li>Срок доставки — от 1 до 14 дней</li>
              <li>Расчёт стоимости по весу и объёму</li>
              <li>Страхование груза</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="delivery-times">
        <h2>Сроки доставки</h2>
        <p>
          Время доставки зависит от удалённости адреса, объёма груза и
          загруженности транспортных маршрутов. Для городских перевозок
          стандартный срок — до 4 часов с момента оформления заявки.
          Межгородские перевозки рассчитываются индивидуально.
        </p>

        <div class="times-table">
          <table>
            <thead>
              <tr>
                <th>Тип доставки</th>
                <th>Минимальный срок</th>
                <th>Максимальный срок</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>По городу</td>
                <td>1 час</td>
                <td>4 часа</td>
              </tr>
              <tr>
                <td>По области</td>
                <td>3 часа</td>
                <td>24 часа</td>
              </tr>
              <tr>
                <td>По России (ближние регионы)</td>
                <td>1 день</td>
                <td>3 дня</td>
              </tr>
              <tr>
                <td>По России (дальние регионы)</td>
                <td>3 дня</td>
                <td>14 дней</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="delivery-cost">
        <h2>Стоимость доставки</h2>
        <p>
          Стоимость формируется на основе нескольких факторов: расстояние, вес и
          объём груза, необходимость грузчиков, этаж забора и доставки. Для
          городских перевозок действует минимальный тариф — от 1 500 ₽.
          Межгородские перевозки рассчитываются индивидуально после получения
          заявки.
        </p>
        <p>
          Мы всегда стараемся предложить конкурентоспособные цены и готовы
          обсудить индивидуальные условия для постоянных клиентов и крупных
          заказов.
        </p>
      </section>

      <section class="delivery-tracking">
        <img v-if="getPhoto('delivery_tracking')" :src="getPhoto('delivery_tracking')" alt="Отслеживание" class="section-photo" />
        <h2>Отслеживание груза</h2>
        <p>
          Все заказы сопровождаются отслеживанием на каждом этапе доставки.
          После оформления заказа вы получаете уникальный номер, по которому
          можете узнать актуальный статус вашего груза. Наша служба поддержки
          работает круглосуточно и готова предоставить информацию о
          местоположении вашего заказа в любой момент.
        </p>
        <p>
          Для отслеживания заказа перейдите в личный кабинет, раздел «Мои
          заказы», или свяжитесь с нами по телефону +7 (800) 555-35-35.
        </p>
      </section>

      <section class="delivery-special">
        <h2>Особые условия</h2>
        <p>
          Для некоторых типов грузов действуют особые условия доставки. Хрупкие
          предметы, ценное оборудование, опасные грузы — каждый тип перевозок
          требует соблюдения специальных правил. Наши менеджеры подберут
          оптимальные условия для любого вида груза.
        </p>
        <ul class="special-list">
          <li>
            <strong>Хрупкие грузы:</strong> дополнительная упаковка и крепёж,
            осторожная погрузка
          </li>
          <li>
            <strong>Опасные грузы:</strong> лицензированный транспорт,
            оформление документов
          </li>
          <li>
            <strong>Температурный режим:</strong> рефрижераторы для
            скоропортящихся товаров
          </li>
          <li><strong>Крупногабарит:</strong> тралы и низкорамные платформы</li>
        </ul>
      </section>

      <section class="delivery-cta">
        <h2>Нужна консультация по доставке?</h2>
        <p>
          Свяжитесь с нами, и мы подберём оптимальный вариант для вашего груза!
        </p>
        <router-link to="/contacts" class="cta-btn"
          >Связаться с нами</router-link
        >
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import BaseBreadcrumbs from '@repo/ui/components/BaseBreadcrumbs.vue';
import { useSiteSettings } from '../composables/useSiteSettings';
import type { BreadcrumbItem } from '@repo/types';

const { loadSettings, getPhoto } = useSiteSettings();

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Доставка' },
];

onMounted(() => { loadSettings(); });
</script>

<style scoped>
.delivery-view {
  padding: var(--spacing-xl) 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.delivery-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.delivery-section,
.delivery-times,
.delivery-cost,
.delivery-tracking,
.delivery-special {
  margin-bottom: var(--spacing-xl);
}

.delivery-section h2,
.delivery-times h2,
.delivery-cost h2,
.delivery-tracking h2,
.delivery-special h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.delivery-zones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.zone-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.zone-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.zone-icon {
  width: 40px;
  height: 40px;
  margin-bottom: var(--spacing-md);
}

.zone-card h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.zone-card p {
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.zone-features {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.zone-features li {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.zone-features li::before {
  content: "✓";
  color: var(--color-success);
  font-weight: bold;
}

.times-table {
  overflow-x: auto;
}

.times-table table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.times-table th,
.times-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.times-table th {
  background: var(--color-primary);
  color: var(--color-white);
  font-weight: 600;
}

.times-table td {
  color: var(--color-text-secondary);
}

.times-table tbody tr:last-child td {
  border-bottom: none;
}

.delivery-cost p,
.delivery-tracking p,
.delivery-special p {
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.special-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.special-list li {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-light);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
}

.section-photo {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.delivery-cta {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.delivery-cta h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.delivery-cta p {
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
  transition: background var(--transition-base);
}

.cta-btn:hover {
  background: var(--color-secondary-dark);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .delivery-zones {
    grid-template-columns: 1fr;
  }
}
</style>

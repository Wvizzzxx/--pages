<template>
  <main class="guarantee-view">
    <div class="container">
      <BaseBreadcrumbs :items="breadcrumbs" />

      <h1 class="page-title">Гарантии</h1>

      <section class="guarantee-intro">
        <img v-if="getPhoto('guarantee_hero')" :src="getPhoto('guarantee_hero')" alt="Гарантии" class="section-photo" />
        <p>
          Компания «ГрузЭкспресс» несёт полную ответственность за сохранность
          вашего груза и гарантирует выполнение всех обязательств. Мы дорожим
          репутацией и делаем всё, чтобы каждый клиент остался доволен качеством
          наших услуг.
        </p>
      </section>

      <section class="guarantee-section">
        <h2>Гарантия сохранности груза</h2>
        <p>
          Мы гарантируем полную сохранность груза на всех этапах транспортировки
          — от момента погрузки до доставки по месту назначения. Каждый заказ
          сопровождается ответственным лицом, а все транспортные средства
          оснащены системами видеонаблюдения и контроля безопасности.
        </p>
        <p>
          Перед началом перевозки наши специалисты проводят оценку состояния
          упаковки и составляют опись вложений. Это позволяет однозначно
          зафиксировать первоначальное состояние груза и исключить любые спорные
          ситуации.
        </p>
      </section>

      <section class="insurance-section">
        <img v-if="getPhoto('guarantee_insurance')" :src="getPhoto('guarantee_insurance')" alt="Страхование" class="section-photo" />
        <h2>Страхование</h2>
        <p>
          Все заказы на перевозку автоматически застрахованы на сумму до 100 000
          ₽ без дополнительной оплаты. Если стоимость вашего груза превышает эту
          сумму, мы предлагаем расширенное страхование по выгодным тарифам — от
          0,1% от объявленной стоимости.
        </p>
        <p>
          Страхование покрывает полный спектр рисков: повреждение, утрату,
          хищение, непредвиденные обстоятельства. В случае наступления
          страхового случая мы берём на себя все вопросы по оформлению и
          получению компенсации.
        </p>

        <div class="insurance-features">
          <div class="insurance-item">
            <img src="\icons\shield.svg" class="insurance-icon" />
            <div>
              <strong>Базовое страхование</strong>
              <span>Включено во все заказы на сумму до 100 000 ₽</span>
            </div>
          </div>
          <div class="insurance-item">
            <img src="\icons\diamond.svg" class="insurance-icon" />
            <div>
              <strong>Расширенное страхование</strong>
              <span>Полное покрытие стоимости груза от 0,1%</span>
            </div>
          </div>
          <div class="insurance-item">
            <img src="\icons\document.svg" class="insurance-icon" />
            <div>
              <strong>Быстрое оформление</strong>
              <span>Страховой полис оформляется за 5 минут</span>
            </div>
          </div>
        </div>
      </section>

      <section class="compensation-section">
        <h2>Компенсация в случае ущерба</h2>
        <p>
          В случае повреждения или утраты груза мы гарантируем полную
          компенсацию документально подтверждённой стоимости. Рассмотрение
          претензий и выплата компенсации осуществляется в срок до 14 рабочих
          дней.
        </p>
        <p>
          Наша компания имеет безупречную репутацию в сфере урегулирования
          претензий. За всё время работы нами была выплачена компенсация по
          каждому обоснованному случаю обращения клиентов.
        </p>
      </section>

      <section class="warranty-section">
        <h2>Гарантийные обязательства по срокам</h2>
        <p>
          Мы гарантируем доставку в оговорённые сроки. Если груз не был
          доставлен вовремя по нашей вине, мы возвращаем до 30% стоимости
          перевозки. Для постоянных клиентов и при регулярных перевозках
          действуют особые условия гарантийных обязательств.
        </p>
        <p>
          В случае форс-мажорных обстоятельств (стихийные бедствия, дорожные
          блокировки) сроки доставки могут быть сдвинуты. В таких ситуациях мы
          своевременно информируем клиента и предлагаем альтернативные маршруты.
        </p>
      </section>

      <section class="claims-section">
        <h2>Порядок подачи претензий</h2>
        <p>
          Если у вас возникли вопросы по качеству услуги или претензии к
          сохранности груза, вы можете подать письменную претензию одним из
          следующих способов:
        </p>
        <ol class="claims-list">
          <li>
            <strong>Через личный кабинет:</strong> перейдите в раздел «Мои
            заказы», выберите нужный заказ и нажмите «Подать претензию».
            Приложите фотографии повреждений и подробное описание проблемы.
          </li>
          <li>
            <strong>По электронной почте:</strong> отправьте претензию на адрес
            claims@gruzexpress.ru с указанием номера заказа и подробным
            описанием ситуации.
          </li>
          <li>
            <strong>Лично в офисе:</strong> подайте претензию в любой из наших
            офисов с документом, удостоверяющим личность, и номером заказа.
          </li>
          <li>
            <strong>По телефону поддержки:</strong> позвоните на горячую линию
            +7 (800) 555-35-35 для устной регистрации претензии.
          </li>
        </ol>
        <p>
          Срок рассмотрения претензии — не более 14 рабочих дней с момента
          получения. Мы свяжемся с вами для информирования о результатах
          рассмотрения и принятия решения о компенсации.
        </p>
      </section>

      <section class="guarantee-cta">
        <h2>Остались вопросы о гарантиях?</h2>
        <p>
          Наши специалисты готовы проконсультировать вас по всем вопросам
          гарантий и страхования.
        </p>
        <router-link to="/contacts" class="cta-btn"
          >Связаться с нами</router-link
        >
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import BaseBreadcrumbs from "@repo/ui/components/BaseBreadcrumbs.vue";
import { useSiteSettings } from "../composables/useSiteSettings";
import type { BreadcrumbItem } from "@repo/types";

const { loadSettings, getPhoto } = useSiteSettings();

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Главная", to: "/" },
  { label: "Гарантия" },
];

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.guarantee-view {
  padding: var(--spacing-xl) 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.guarantee-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.guarantee-section,
.insurance-section,
.compensation-section,
.warranty-section,
.claims-section {
  margin-bottom: var(--spacing-xl);
}

.guarantee-section h2,
.insurance-section h2,
.compensation-section h2,
.warranty-section h2,
.claims-section h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.guarantee-section p,
.compensation-section p,
.warranty-section p,
.claims-section p {
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.insurance-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.insurance-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  transition: transform var(--transition-base);
}

.insurance-item:hover {
  transform: translateY(-2px);
}

.insurance-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

.insurance-item strong {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.insurance-item span {
  display: block;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

.claims-list {
  padding-left: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.claims-list li {
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.claims-list strong {
  color: var(--color-text-primary);
}

.guarantee-cta {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.guarantee-cta h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.guarantee-cta p {
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

.section-photo {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .insurance-features {
    grid-template-columns: 1fr;
  }
}
</style>

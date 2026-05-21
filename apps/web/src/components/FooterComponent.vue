<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-section footer-about">
          <router-link to="/" class="footer-logo">
            <span class="footer-logo-text">ГрузЭкспресс</span>
          </router-link>
          <p class="footer-description">
            Надёжные грузоперевозки по всей России с 2010 года. Более 50 000
            выполненных заказов.
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Навигация</h4>
          <ul class="footer-links">
            <li><router-link to="/">Главная</router-link></li>
            <li><router-link to="/services">Услуги</router-link></li>
            <li><router-link to="/about">О компании</router-link></li>
            <li><router-link to="/delivery">Доставка</router-link></li>
            <li><router-link to="/guarantee">Гарантия</router-link></li>
            <li><router-link to="/gallery">Галерея</router-link></li>
            <li><router-link to="/contacts">Контакты</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Услуги</h4>
          <ul class="footer-links">
            <li>
              <router-link to="/services/gorodskaya-dostavka"
                >Городские перевозки</router-link
              >
            </li>
            <li>
              <router-link to="/services/mezhgorodnie-perevozki"
                >Межгородские перевозки</router-link
              >
            </li>
            <li>
              <router-link to="/services/ofisnye-pereezdy"
                >Офисные переезды</router-link
              >
            </li>
            <li>
              <router-link to="/services/takelazhnye-raboty"
                >Такелажные работы</router-link
              >
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Контакты</h4>
          <ul class="footer-contacts">
            <li class="contact-item">
              <svg
                class="contact-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
              <div>
                <a href="tel:+78005553535" class="footer-phone"
                  >+7 (800) 555-35-35</a
                >
                <span class="work-hours">Круглосуточно</span>
              </div>
            </li>
            <li class="contact-item">
              <svg
                class="contact-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <a href="mailto:info@gruzexpress.ru" class="footer-email"
                  >info@gruzexpress.ru</a
                >
                <span class="response-time">Ответим в течение 15 минут</span>
              </div>
            </li>
            <li class="contact-item">
              <svg
                class="contact-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <span>г. Москва, ул. Транспортная, д. 1</span>
                <span class="work-hours">Пн-Пт: 9:00 - 18:00</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} «ГрузЭкспресс». Все права защищены.
        </p>
        <div class="footer-bottom-links">
          <router-link to="/privacy" class="footer-bottom-link">Политика конфиденциальности</router-link>
          <router-link to="/privacy" class="footer-bottom-link">Пользовательское соглашение</router-link>
        </div>
      </div>
    </div>

    <button
      class="scroll-to-top"
      :class="{ visible: isVisible }"
      @click="scrollToTop"
      aria-label="Наверх"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const currentYear = new Date().getFullYear();
const isVisible = ref(false);

function handleScroll() {
  isVisible.value = window.scrollY > 500;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.site-footer {
  background: var(--color-gray-950);
  color: var(--color-gray-400);
  margin-top: auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
  gap: var(--spacing-2xl);
  padding: var(--spacing-3xl) 0;
}

.footer-section {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.footer-section:nth-child(1) { animation-delay: 0.1s; }
.footer-section:nth-child(2) { animation-delay: 0.2s; }
.footer-section:nth-child(3) { animation-delay: 0.3s; }
.footer-section:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.footer-about {
  max-width: 280px;
}

.footer-logo {
  display: inline-block;
  margin-bottom: var(--spacing-md);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.footer-logo:hover {
  opacity: 0.85;
  transform: scale(1.02);
}

.footer-logo-text {
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-white);
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffffff, #a8d5e2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.footer-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: var(--spacing-lg);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-links a {
  color: var(--color-gray-400);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}

.footer-links a:hover {
  color: var(--color-white);
  transform: translateX(8px);
}

.footer-contacts {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.contact-item {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.contact-icon {
  color: var(--color-primary-light);
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-item a {
  color: var(--color-white);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color 0.3s ease;
}

.contact-item a:hover {
  color: var(--color-primary-light);
}

.footer-phone {
  display: block;
  font-weight: 600;
  font-size: var(--font-size-base);
  margin-bottom: 4px;
}

.work-hours,
.response-time {
  display: block;
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
}

.footer-email {
  display: block;
  margin-bottom: 4px;
}

/* Footer bottom */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.copyright {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

.footer-bottom-links {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.footer-bottom-link {
  color: var(--color-gray-500);
  text-decoration: none;
  font-size: var(--font-size-xs);
  transition: color 0.3s ease;
}

.footer-bottom-link:hover {
  color: var(--color-gray-300);
}

/* Scroll to top */
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  background-size: 200% auto;
  color: var(--color-white);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(var(--color-secondary-rgb), .35);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.8);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: var(--z-dropdown);
}

.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.scroll-to-top:hover {
  background-position: right center;
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 8px 30px rgba(var(--color-secondary-rgb), .5);
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom-links {
    justify-content: center;
  }

  .scroll-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}
</style>
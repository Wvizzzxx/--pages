<template>
  <header class="site-header">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <span class="logo-text">ГрузЭкспресс</span>
      </router-link>

      <button
        class="mobile-menu-btn"
        :class="{ 'menu-open': mobileMenuOpen }"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="main-nav" :class="{ 'nav-open': mobileMenuOpen }">
        <ul class="nav-list">
          <li>
            <router-link
              to="/"
              class="nav-link"
              exact-active-class="nav-link-active"
              @click="closeMobileMenu"
              >Главная</router-link
            >
          </li>
          <li
            class="nav-dropdown"
            @mouseenter="dropdownOpen = true"
            @mouseleave="dropdownOpen = false"
          >
            <router-link
              to="/services"
              class="nav-link nav-link-dropdown"
              exact-active-class="nav-link-active"
            >
              Услуги
              <svg
                class="dropdown-arrow"
                :class="{ 'arrow-open': dropdownOpen }"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </router-link>
            <div
              class="dropdown-menu"
              :class="{ 'dropdown-open': dropdownOpen }"
            >
              <div class="dropdown-content">
                <router-link
                  to="/services"
                  class="dropdown-item"
                  @click="closeMobileMenu"
                >
                  <img src="\icons\all-services.svg" class="dropdown-item-icon"/>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title">Все услуги</span>
                    <span class="dropdown-item-desc">Полный список услуг</span>
                  </div>
                </router-link>
                <router-link
                  to="/services/gorodskaya-dostavka"
                  class="dropdown-item"
                  @click="closeMobileMenu"
                >
                  <img src="\icons\city-delivery.svg" class="dropdown-item-icon"/>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title">Городские перевозки</span>
                    <span class="dropdown-item-desc">Быстро по городу</span>
                  </div>
                </router-link>
                <router-link
                  to="/services/mezhgorodnie-perevozki"
                  class="dropdown-item"
                  @click="closeMobileMenu"
                >
                  <img src="\icons\icons8-страна-48.png" class="dropdown-item-icon"/>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title"
                      >Межгородские перевозки</span
                    >
                    <span class="dropdown-item-desc">По всей России</span>
                  </div>
                </router-link>
                <router-link
                  to="/services/ofisnye-pereezdy"
                  class="dropdown-item"
                  @click="closeMobileMenu"
                >
                  <img src="\icons\package.svg" class="dropdown-item-icon"/>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title">Переезды</span>
                    <span class="dropdown-item-desc">Квартиры и офисы</span>
                  </div>
                </router-link>
                <router-link
                  to="/services/takelazhnye-raboty"
                  class="dropdown-item"
                  @click="closeMobileMenu"
                >
                  <img src="\icons\oversized-cargo.svg" class="dropdown-item-icon"/>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title">Негабаритные грузы</span>
                    <span class="dropdown-item-desc">Спецтехника</span>
                  </div>
                </router-link>
              </div>
            </div>
          </li>
          <li>
            <router-link
              to="/about"
              class="nav-link"
              exact-active-class="nav-link-active"
              @click="closeMobileMenu"
              >О компании</router-link
            >
          </li>
          <li>
            <router-link
              to="/delivery"
              class="nav-link"
              exact-active-class="nav-link-active"
              @click="closeMobileMenu"
              >Доставка</router-link
            >
          </li>
          <li>
            <router-link
              to="/guarantee"
              class="nav-link"
              exact-active-class="nav-link-active"
              @click="closeMobileMenu"
              >Гарантия</router-link
            >
          </li>
          <li>
            <router-link
              to="/gallery"
              class="nav-link"
              exact-active-class="nav-link-active"
              @click="closeMobileMenu"
              >Галерея</router-link
            >
          </li>
          <li>
            <router-link
              to="/contacts"
              class="nav-link"
              exact-active-class="nav-link-active"
              @click="closeMobileMenu"
              >Контакты</router-link
            >
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="header-btn header-btn-login"
          >Войти</router-link
        >
        <template v-else>
          <a v-if="authStore.isAdmin" href="/admin/dashboard" target="_blank" class="header-btn header-btn-admin">
            ⚙️ Админ
          </a>
          <router-link to="/profile" class="header-btn header-btn-profile">
            <svg
              class="profile-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {{ authStore.user?.name || "Профиль" }}
          </router-link>
        </template>
        <router-link to="/order" class="header-btn header-btn-cta"
          >Оформить</router-link
        >
      </div>
    </div>

    <div
      class="mobile-overlay"
      :class="{ 'overlay-visible': mobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const dropdownOpen = ref(false);
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  document.body.style.overflow = mobileMenuOpen.value ? "hidden" : "";
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
  dropdownOpen.value = false;
  document.body.style.overflow = "";
}

onMounted(() => {});
</script>

<style scoped>
.site-header {
  background: var(--color-primary);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

/* Main header */
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  position: relative;
  gap: var(--spacing-md);
  flex-wrap: nowrap;
}

.logo {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}

.logo:hover {
  transform: scale(1.03);
}

.logo-text {
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-white);
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffffff, #cde8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

/* Navigation */
.main-nav {
  display: flex;
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 8px;
  align-items: center;
  margin: 0;
  padding: 0;
  flex-wrap: nowrap;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-decoration: none;
  position: relative;
  white-space: nowrap;
  font-size: 0.9rem;
}

.nav-link:hover {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}

.nav-link-active {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.15);
  position: relative;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-secondary);
  border-radius: 1px;
}

/* Dropdown */
.nav-dropdown {
  position: relative;
}

.nav-link-dropdown {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.dropdown-arrow {
  transition: transform var(--transition-fast);
}

.arrow-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  min-width: 300px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-md) 0;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-base);
  z-index: 100;
}

.dropdown-open {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-gray-800);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--color-gray-50);
  padding-left: var(--spacing-xl);
}

.dropdown-item-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

.dropdown-item-text {
  display: flex;
  flex-direction: column;
}

.dropdown-item-title {
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-gray-900);
}

.dropdown-item-desc {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

/* Header actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  margin-left: auto;
  padding-left: var(--spacing-md);
}

.header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: all var(--transition-fast);
  white-space: nowrap;
  line-height: 1;
  min-width: fit-content;
}

.header-btn-login {
  color: var(--color-white);
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
}

.header-btn-login:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-1px);
}

.header-btn-profile {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-btn-profile:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.header-btn-admin {
  color: var(--color-white);
  background: rgba(230, 126, 34, 0.3);
  border: 2px solid rgba(230, 126, 34, 0.5);
  font-size: var(--font-size-sm);
}

.header-btn-admin:hover {
  background: rgba(230, 126, 34, 0.5);
  border-color: rgba(230, 126, 34, 0.7);
  transform: translateY(-1px);
}

.profile-icon {
  opacity: 0.9;
  flex-shrink: 0;
}

.header-btn-cta {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  background-size: 200% auto;
  color: var(--color-white);
  font-weight: 600;
  border: 2px solid var(--color-secondary);
  box-shadow: 0 2px 12px rgba(230, 126, 34, 0.25);
}

.header-btn-cta:hover {
  background-position: right center;
  border-color: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  z-index: 1010;
  position: relative;
}

.mobile-menu-btn span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-white);
  border-radius: 2px;
  transition: all 0.3s ease;
  position: absolute;
}

.mobile-menu-btn span:nth-child(1) {
  transform: translateY(-7px);
}

.mobile-menu-btn span:nth-child(3) {
  transform: translateY(7px);
}

.menu-open span:nth-child(1) {
  transform: rotate(45deg);
}

.menu-open span:nth-child(2) {
  opacity: 0;
}

.menu-open span:nth-child(3) {
  transform: rotate(-45deg);
}

/* Mobile overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-base);
  z-index: 999;
}

.overlay-visible {
  opacity: 1;
  visibility: visible;
}

/* Mobile styles */
@media (max-width: 1200px) {
  .nav-link {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .header-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .logo-text {
    font-size: 1.3rem;
  }
}

@media (max-width: 1024px) {
  .mobile-menu-btn {
    display: flex;
  }

  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 320px;
    height: 100vh;
    background: var(--color-primary-dark);
    padding: 80px var(--spacing-lg) var(--spacing-lg);
    transition: right var(--transition-slow);
    z-index: 1001;
    overflow-y: auto;
  }

  .nav-open {
    right: 0;
  }

  .nav-list {
    flex-direction: column;
    gap: 0;
  }

  .nav-link {
    display: block;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    width: 100%;
  }

  .dropdown-menu {
    position: static;
    transform: none;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: none;
    max-height: 0;
    overflow: hidden;
    opacity: 1;
    visibility: visible;
    transition: max-height var(--transition-base);
    border-radius: 0;
    margin-top: var(--spacing-xs);
  }

  .dropdown-open {
    max-height: 500px;
  }

  .dropdown-item {
    color: rgba(255, 255, 255, 0.8);
    padding-left: var(--spacing-2xl);
  }

  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .dropdown-item-title {
    color: var(--color-white);
  }

  .dropdown-item-desc {
    color: rgba(255, 255, 255, 0.6);
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .header-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

<template>
  <div class="not-found-view">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">
          <span class="digit digit-1">4</span>
          <span class="digit digit-2">0</span>
          <span class="digit digit-3">4</span>
        </div>
        
        <h1 class="error-title">Страница не найдена</h1>
        
        <p class="error-message">
          Упс! Страница, которую вы ищете, не существует.
          Возможно, она была удалена, переименована или временно недоступна.
        </p>

        <div class="error-actions">
          <router-link to="/" class="btn-primary">
            <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            На главную
          </router-link>
          <router-link to="/services" class="btn-secondary">
            <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="7" height="7" rx="1"/>
              <rect x="16" y="3" width="7" height="7" rx="1"/>
              <rect x="1" y="14" width="7" height="7" rx="1"/>
              <rect x="16" y="14" width="7" height="7" rx="1"/>
            </svg>
            Наши услуги
          </router-link>
        </div>

        <div class="quick-links">
          <h3>Популярные страницы</h3>
          <ul class="links-list">
            <li><router-link to="/services">Услуги грузоперевозок</router-link></li>
            <li><router-link to="/delivery">Доставка</router-link></li>
            <li><router-link to="/guarantee">Гарантия</router-link></li>
            <li><router-link to="/contacts">Контакты</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Страница 404
</script>

<style scoped>
.not-found-view {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) 0;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.error-code {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.digit {
  font-size: 8rem;
  font-weight: 800;
  color: var(--color-primary);
  display: inline-block;
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  opacity: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.digit-1 { animation-delay: 0.2s; }
.digit-2 { animation-delay: 0.4s; }
.digit-3 { animation-delay: 0.6s; }

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-50px);
  }
  50% {
    transform: scale(1.1) translateY(10px);
  }
  70% {
    transform: scale(0.95) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.digit:hover {
  animation: pulse 1s ease infinite;
  transform: scale(1.1);
}

@keyframes pulse {
  0%, 100% { transform: scale(1.1); }
  50% { transform: scale(1.15); }
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  animation: fadeInUp 0.6s ease 0.8s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-message {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
  animation: fadeInUp 0.6s ease 1s forwards;
  opacity: 0;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-3xl);
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease 1.2s forwards;
  opacity: 0;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(26, 95, 122, 0.3);
}

.btn-secondary {
  background: var(--color-white);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(26, 95, 122, 0.3);
}

.btn-icon {
  transition: transform var(--transition-fast);
}

.btn-primary:hover .btn-icon,
.btn-secondary:hover .btn-icon {
  transform: translateX(-3px);
}

.quick-links {
  animation: fadeInUp 0.6s ease 1.4s forwards;
  opacity: 0;
}

.quick-links h3 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.links-list {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}

.links-list li a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding-bottom: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.links-list li a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.links-list li a:hover {
  color: var(--color-primary-dark);
}

.links-list li a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .digit {
    font-size: 5rem;
  }

  .error-title {
    font-size: 1.8rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .links-list {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>
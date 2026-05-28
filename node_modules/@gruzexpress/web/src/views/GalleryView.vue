<template>
  <main class="gallery-view">
    <section class="page-header">
      <div class="container">
        <h1 class="hero-title">Наша галерея</h1>
        <p class="hero-subtitle">Фотографии нашей техники, грузов и рабочих процессов</p>
      </div>
    </section>

    <section class="page-content">
      <div class="container">
        <BaseBreadcrumbs :items="breadcrumbs" />

        <!-- Фильтры по категориям -->
        <div class="gallery-filters" v-if="categories.length > 0">
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === '' }"
            @click="filterByCategory('')"
          >
            Все фото
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: selectedCategory === cat }"
            @click="filterByCategory(cat)"
          >
            {{ categoryLabels[cat] || cat }}
          </button>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>Загрузка фотографий...</span>
        </div>

        <!-- Галерея -->
        <div v-else-if="items.length > 0" class="gallery-grid">
          <div
            v-for="(item, index) in items"
            :key="item._id"
            class="gallery-item scroll-reveal"
            :style="{ transitionDelay: `${index * 0.05}s` }"
            @click="openLightbox(item)"
          >
            <div class="gallery-image-wrapper">
              <img :src="item.imageUrl" :alt="item.title" class="gallery-image" loading="lazy" />
              <div class="gallery-overlay">
                <img src="\icons\search-gallery-new.svg" class="gallery-expand-icon"/>
              </div>
            </div>
            <div class="gallery-info">
              <h3 class="gallery-title">{{ item.title }}</h3>
              <p v-if="item.description" class="gallery-description">{{ item.description }}</p>
              <span class="gallery-category">{{ categoryLabels[item.category] || item.category }}</span>
            </div>
          </div>
        </div>

        <!-- Пусто -->
        <div v-else class="empty-state">
          <div class="empty-icon">📷</div>
          <h3>Фотографии пока не добавлены</h3>
          <p>Скоро здесь появятся фотографии нашей техники и рабочих процессов.</p>
        </div>

        <!-- Лайтбокс -->
        <Teleport to="body">
          <div v-if="lightboxItem" class="lightbox" @click.self="closeLightbox">
            <button class="lightbox-close" @click="closeLightbox">✕</button>
            <div class="lightbox-content">
              <img :src="lightboxItem.imageUrl" :alt="lightboxItem.title" class="lightbox-image" />
              <div class="lightbox-info">
                <h3>{{ lightboxItem.title }}</h3>
                <p v-if="lightboxItem.description">{{ lightboxItem.description }}</p>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { BaseBreadcrumbs } from '@repo/ui';
import type { BreadcrumbItem, GalleryItem } from '@repo/types';
import { getGalleryItems, getGalleryCategories } from '../api/gallery';

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Галерея' },
];

const categoryLabels: Record<string, string> = {
  general: 'Общее',
  fleet: 'Наш автопарк',
  delivery: 'Доставка',
  office: 'Офис',
  warehouse: 'Склад',
  city: 'Городские перевозки',
  intercity: 'Межгородские перевозки',
};

const items = ref<GalleryItem[]>([]);
const categories = ref<string[]>([]);
const selectedCategory = ref('');
const loading = ref(true);
const lightboxItem = ref<GalleryItem | null>(null);

async function loadGallery() {
  loading.value = true;
  try {
    const response = await getGalleryItems(selectedCategory.value || undefined);
    if (response.success && response.data) {
      items.value = response.data;
    }
  } catch (error) {
    console.error('Error loading gallery:', error);
  } finally {
    loading.value = false;
    await nextTick();
    initScrollReveal();
  }
}

async function loadCategories() {
  try {
    const response = await getGalleryCategories();
    if (response.success && response.data) {
      categories.value = response.data;
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

function filterByCategory(category: string) {
  selectedCategory.value = category;
  loadGallery();
}

function openLightbox(item: GalleryItem) {
  lightboxItem.value = item;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxItem.value = null;
  document.body.style.overflow = '';
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  elements.forEach((el) => observer.observe(el));
}

onMounted(() => {
  loadGallery();
  loadCategories();
});
</script>

<style scoped>
.gallery-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  justify-content: center;
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--font-size-sm);
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-3xl) 0;
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
  to { transform: rotate(360deg); }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.gallery-item {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.gallery-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 220px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.08);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-expand-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.gallery-info {
  padding: var(--spacing-lg);
}

.gallery-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.gallery-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.gallery-category {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  color: var(--color-text-secondary);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-base);
  z-index: 1;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  text-align: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.lightbox-info {
  margin-top: var(--spacing-lg);
  color: white;
}

.lightbox-info h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-xs);
}

.lightbox-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
}

/* Scroll reveal */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div class="layout">
    <HeaderComponent />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <keep-alive :include="['HomeView']">
          <component :is="Component" class="page-component" :key="$route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from './HeaderComponent.vue';
import FooterComponent from './FooterComponent.vue';
</script>

<style scoped>
.page-enter-active {
  animation: pageEnter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-leave-active {
  animation: pageLeave 0.25s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateX(30px) scale(0.98);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
  }
}

@keyframes pageLeave {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-30px) scale(0.98);
  }
}

.page-component {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
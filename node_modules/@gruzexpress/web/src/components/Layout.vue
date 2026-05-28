<template>
  <div class="layout">
    <HeaderComponent />
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
    <FooterComponent />
    <ChatBot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import HeaderComponent from "./HeaderComponent.vue";
import FooterComponent from "./FooterComponent.vue";
import ChatBot from "./ChatBot.vue";
import { useSiteSettings } from "../composables/useSiteSettings";

const { loadSettings } = useSiteSettings();

onMounted(() => {
  loadSettings(true);
});
</script>
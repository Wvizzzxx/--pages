import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue';
import '@repo/ui-styles/variables.css';
import '@repo/ui-styles/base.css';
import './styles/global.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
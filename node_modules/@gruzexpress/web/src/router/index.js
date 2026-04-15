import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
const routes = [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/services', name: 'services', component: () => import('../views/ServicesView.vue') },
    { path: '/services/:slug', name: 'service-detail', component: () => import('../views/ServiceDetailView.vue') },
    { path: '/delivery', name: 'delivery', component: () => import('../views/DeliveryView.vue') },
    { path: '/guarantee', name: 'guarantee', component: () => import('../views/GuaranteeView.vue') },
    { path: '/contacts', name: 'contacts', component: () => import('../views/ContactsView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guest: true } },
    { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { auth: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
];
export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0, behavior: 'smooth' };
    },
});
router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();
    if (!authStore.user && authStore.token) {
        await authStore.fetchMe();
    }
    if (to.meta.auth && !authStore.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }
    if (to.meta.guest && authStore.isAuthenticated) {
        return { name: 'profile' };
    }
});
router.afterEach((to, from) => {
    // Уведомление о смене страницы для accessibility
    if (to.name !== from.name) {
        document.title = `${getPageTitle(to.name)} | ГрузЭкспресс`;
    }
});
function getPageTitle(routeName) {
    const titles = {
        home: 'Главная',
        about: 'О компании',
        services: 'Услуги',
        'service-detail': 'Услуга',
        delivery: 'Доставка',
        guarantee: 'Гарантия',
        contacts: 'Контакты',
        login: 'Вход',
        register: 'Регистрация',
        profile: 'Профиль',
        'not-found': 'Страница не найдена',
    };
    return titles[routeName] || 'ГрузЭкспресс';
}

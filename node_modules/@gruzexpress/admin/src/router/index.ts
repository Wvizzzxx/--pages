import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'admin-login', component: () => import('../views/admin/AdminLoginView.vue'), meta: { guest: true } },
  { path: '/', component: () => import('../components/AdminLayout.vue'), meta: { auth: true }, children: [
    { path: '', redirect: '/dashboard' },
    { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboard.vue') },
    { path: 'services', name: 'admin-services', component: () => import('../views/admin/AdminServicesView.vue') },
    { path: 'orders', name: 'admin-orders', component: () => import('../views/admin/AdminOrdersView.vue') },
    { path: 'users', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue') },
    { path: 'gallery', name: 'admin-gallery', component: () => import('../views/admin/AdminGalleryView.vue') },
    { path: 'site-photos', name: 'admin-site-photos', component: () => import('../views/admin/AdminSiteSettingsView.vue') },
  ]},
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const { useAuthStore } = await import('../stores/auth');
  const authStore = useAuthStore();

  if (!authStore.user && authStore.token) {
    await authStore.fetchMe();
  }

  if (to.meta.auth && !authStore.isAuthenticated) {
    return { name: 'admin-login' };
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'admin-dashboard' };
  }

  if (to.meta.auth && !authStore.isAdmin) {
    return { name: 'admin-login' };
  }
});
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/src/components/BaseBreadcrumbs.vue';
import BaseLoader from '@repo/ui/src/components/BaseLoader.vue';
import BaseBadge from '@repo/ui/src/components/BaseBadge.vue';
import { useAuthStore } from '../stores/auth';
const router = useRouter();
const authStore = useAuthStore();
const breadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Профиль' },
];
const userInitial = computed(() => {
    return authStore.user?.name?.charAt(0)?.toUpperCase() || '?';
});
const orders = ref([]);
const ordersLoading = ref(true);
const services = ref([]);
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    await loadOrders();
    await loadServices();
});
async function loadOrders() {
    ordersLoading.value = true;
    try {
        const response = await fetch('/api/orders', {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
        const result = await response.json();
        if (result.success) {
            orders.value = result.data || [];
        }
    }
    catch (e) {
        console.error('Ошибка загрузки заказов:', e);
    }
    finally {
        ordersLoading.value = false;
    }
}
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        const result = await response.json();
        if (result.success) {
            services.value = result.data || [];
        }
    }
    catch (e) {
        console.error('Ошибка загрузки услуг:', e);
    }
}
function getServiceTitle(serviceId) {
    const service = services.value.find((s) => s._id === serviceId);
    return service?.title || 'Услуга удалена';
}
function getStatusVariant(status) {
    switch (status) {
        case 'pending': return 'warning';
        case 'in_progress': return 'primary';
        case 'completed': return 'success';
        case 'cancelled': return 'error';
        default: return 'secondary';
    }
}
function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'Ожидает';
        case 'in_progress': return 'В работе';
        case 'completed': return 'Выполнен';
        case 'cancelled': return 'Отменён';
        default: return status;
    }
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
function handleLogout() {
    authStore.logout();
    router.push('/');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-logout']} */ ;
/** @type {__VLS_StyleScopedClasses['orders-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-services']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "profile-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container" },
});
/** @type {[typeof BaseBreadcrumbs, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BaseBreadcrumbs, new BaseBreadcrumbs({
    items: (__VLS_ctx.breadcrumbs),
}));
const __VLS_1 = __VLS_0({
    items: (__VLS_ctx.breadcrumbs),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-avatar" },
});
(__VLS_ctx.userInitial);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-details" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
(__VLS_ctx.authStore.user?.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "user-email" },
});
(__VLS_ctx.authStore.user?.email);
/** @type {[typeof BaseBadge, typeof BaseBadge, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseBadge, new BaseBadge({
    variant: (__VLS_ctx.authStore.isAdmin ? 'success' : 'secondary'),
}));
const __VLS_4 = __VLS_3({
    variant: (__VLS_ctx.authStore.isAdmin ? 'success' : 'secondary'),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
(__VLS_ctx.authStore.isAdmin ? 'Администратор' : 'Пользователь');
var __VLS_5;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleLogout) },
    ...{ class: "btn-logout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "orders-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
if (__VLS_ctx.ordersLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "orders-loading" },
    });
    /** @type {[typeof BaseLoader, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(BaseLoader, new BaseLoader({
        text: "Загрузка заказов...",
    }));
    const __VLS_7 = __VLS_6({
        text: "Загрузка заказов...",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
else if (__VLS_ctx.orders.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "orders-list" },
    });
    for (const [order] of __VLS_getVForSourceType((__VLS_ctx.orders))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (order._id),
            ...{ class: "order-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "order-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "order-id" },
        });
        (order._id.slice(-6));
        /** @type {[typeof BaseBadge, typeof BaseBadge, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(BaseBadge, new BaseBadge({
            variant: (__VLS_ctx.getStatusVariant(order.status)),
        }));
        const __VLS_10 = __VLS_9({
            variant: (__VLS_ctx.getStatusVariant(order.status)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        (__VLS_ctx.getStatusLabel(order.status));
        var __VLS_11;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "order-details" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "order-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "order-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "order-value" },
        });
        (__VLS_ctx.getServiceTitle(order.serviceId));
        if (order.address) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "order-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "order-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "order-value" },
            });
            (order.address);
        }
        if (order.comment) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "order-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "order-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "order-value" },
            });
            (order.comment);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "order-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "order-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "order-value" },
        });
        (__VLS_ctx.formatDate(order.createdAt));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "orders-empty" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_12 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        to: "/services",
        ...{ class: "btn-services" },
    }));
    const __VLS_14 = __VLS_13({
        to: "/services",
        ...{ class: "btn-services" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
}
/** @type {__VLS_StyleScopedClasses['profile-view']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-content']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-info']} */ ;
/** @type {__VLS_StyleScopedClasses['user-card']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-details']} */ ;
/** @type {__VLS_StyleScopedClasses['user-email']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-logout']} */ ;
/** @type {__VLS_StyleScopedClasses['orders-section']} */ ;
/** @type {__VLS_StyleScopedClasses['orders-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['orders-list']} */ ;
/** @type {__VLS_StyleScopedClasses['order-card']} */ ;
/** @type {__VLS_StyleScopedClasses['order-header']} */ ;
/** @type {__VLS_StyleScopedClasses['order-id']} */ ;
/** @type {__VLS_StyleScopedClasses['order-details']} */ ;
/** @type {__VLS_StyleScopedClasses['order-row']} */ ;
/** @type {__VLS_StyleScopedClasses['order-label']} */ ;
/** @type {__VLS_StyleScopedClasses['order-value']} */ ;
/** @type {__VLS_StyleScopedClasses['order-row']} */ ;
/** @type {__VLS_StyleScopedClasses['order-label']} */ ;
/** @type {__VLS_StyleScopedClasses['order-value']} */ ;
/** @type {__VLS_StyleScopedClasses['order-row']} */ ;
/** @type {__VLS_StyleScopedClasses['order-label']} */ ;
/** @type {__VLS_StyleScopedClasses['order-value']} */ ;
/** @type {__VLS_StyleScopedClasses['order-row']} */ ;
/** @type {__VLS_StyleScopedClasses['order-label']} */ ;
/** @type {__VLS_StyleScopedClasses['order-value']} */ ;
/** @type {__VLS_StyleScopedClasses['orders-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-services']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseBreadcrumbs: BaseBreadcrumbs,
            BaseLoader: BaseLoader,
            BaseBadge: BaseBadge,
            authStore: authStore,
            breadcrumbs: breadcrumbs,
            userInitial: userInitial,
            orders: orders,
            ordersLoading: ordersLoading,
            getServiceTitle: getServiceTitle,
            getStatusVariant: getStatusVariant,
            getStatusLabel: getStatusLabel,
            formatDate: formatDate,
            handleLogout: handleLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

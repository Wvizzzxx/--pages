/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import BaseBreadcrumbs from '@repo/ui/src/components/BaseBreadcrumbs.vue';
import BaseCard from '@repo/ui/src/components/BaseCard.vue';
import BaseLoader from '@repo/ui/src/components/BaseLoader.vue';
const breadcrumbs = [
    { label: 'Главная', to: '/' },
    { label: 'Услуги' },
];
const services = ref([]);
const loading = ref(true);
onMounted(async () => {
    try {
        const response = await fetch('/api/services');
        const result = await response.json();
        if (result.success) {
            services.value = result.data.filter((s) => s.isActive);
        }
    }
    catch (e) {
        console.error('Ошибка загрузки услуг:', e);
    }
    finally {
        loading.value = false;
    }
});
function formatPrice(price) {
    if (!price)
        return 'от 1 500 ₽';
    return `${price.toLocaleString('ru-RU')} ₽`;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-section']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-section']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['services-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "services-view" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "page-intro" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
    });
    /** @type {[typeof BaseLoader, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(BaseLoader, new BaseLoader({
        text: "Загрузка услуг...",
    }));
    const __VLS_4 = __VLS_3({
        text: "Загрузка услуг...",
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
else if (__VLS_ctx.services.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "services-grid" },
    });
    for (const [service] of __VLS_getVForSourceType((__VLS_ctx.services))) {
        /** @type {[typeof BaseCard, typeof BaseCard, ]} */ ;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(BaseCard, new BaseCard({
            key: (service._id || service.slug),
            title: (service.title),
            description: (service.description),
            image: (service.image),
            ...{ class: "service-card" },
        }));
        const __VLS_7 = __VLS_6({
            key: (service._id || service.slug),
            title: (service.title),
            description: (service.description),
            image: (service.image),
            ...{ class: "service-card" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        __VLS_8.slots.default;
        {
            const { footer: __VLS_thisSlot } = __VLS_8.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "card-footer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "price" },
            });
            (__VLS_ctx.formatPrice(service.price));
            const __VLS_9 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
            // @ts-ignore
            const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
                to: (`/services/${service.slug}`),
                ...{ class: "btn-detail" },
            }));
            const __VLS_11 = __VLS_10({
                to: (`/services/${service.slug}`),
                ...{ class: "btn-detail" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_10));
            __VLS_12.slots.default;
            var __VLS_12;
        }
        var __VLS_8;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "no-data" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "info-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "cta-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_13 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    to: "/login",
    ...{ class: "cta-btn" },
}));
const __VLS_15 = __VLS_14({
    to: "/login",
    ...{ class: "cta-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
var __VLS_16;
/** @type {__VLS_StyleScopedClasses['services-view']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-intro']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['services-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['service-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['no-data']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-section']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseBreadcrumbs: BaseBreadcrumbs,
            BaseCard: BaseCard,
            BaseLoader: BaseLoader,
            breadcrumbs: breadcrumbs,
            services: services,
            loading: loading,
            formatPrice: formatPrice,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

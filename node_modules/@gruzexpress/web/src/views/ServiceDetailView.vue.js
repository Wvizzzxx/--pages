import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/src/components/BaseBreadcrumbs.vue';
import BaseLoader from '@repo/ui/src/components/BaseLoader.vue';
import BaseModal from '@repo/ui/src/components/BaseModal.vue';
import BaseInput from '@repo/ui/src/components/BaseInput.vue';
import BaseButton from '@repo/ui/src/components/BaseButton.vue';
import { useAuthStore } from '../stores/auth';
const route = useRoute();
const authStore = useAuthStore();
const service = ref(null);
const loading = ref(true);
const showOrderModal = ref(false);
const submitting = ref(false);
const orderForm = ref({
    comment: '',
    address: '',
});
const breadcrumbs = computed(() => {
    const items = [
        { label: 'Главная', path: '/' },
        { label: 'Услуги', path: '/services' },
    ];
    if (service.value) {
        items.push({ label: service.value.title });
    }
    return items;
});
async function loadService() {
    loading.value = true;
    try {
        const slug = route.params.slug;
        const response = await fetch(`/api/services/${slug}`);
        const result = await response.json();
        if (result.success) {
            service.value = result.data;
        }
    }
    catch (e) {
        console.error('Ошибка загрузки услуги:', e);
    }
    finally {
        loading.value = false;
    }
}
onMounted(loadService);
watch(() => route.params.slug, loadService);
function formatPrice(price) {
    if (!price)
        return 'Договорная';
    return `${price.toLocaleString('ru-RU')} ₽`;
}
async function submitOrder() {
    if (!service.value || !authStore.token)
        return;
    submitting.value = true;
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`,
            },
            body: JSON.stringify({
                serviceId: service.value._id,
                comment: orderForm.value.comment,
                address: orderForm.value.address,
            }),
        });
        const result = await response.json();
        if (result.success) {
            showOrderModal.value = false;
            orderForm.value = { comment: '', address: '' };
            alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        }
        else {
            alert(result.error || 'Ошибка при создании заказа');
        }
    }
    catch (e) {
        alert('Произошла ошибка при отправке заявки');
        console.error(e);
    }
    finally {
        submitting.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['price-block']} */ ;
/** @type {__VLS_StyleScopedClasses['price-block']} */ ;
/** @type {__VLS_StyleScopedClasses['description-section']} */ ;
/** @type {__VLS_StyleScopedClasses['features-section']} */ ;
/** @type {__VLS_StyleScopedClasses['order-section']} */ ;
/** @type {__VLS_StyleScopedClasses['description-section']} */ ;
/** @type {__VLS_StyleScopedClasses['features-list']} */ ;
/** @type {__VLS_StyleScopedClasses['order-section']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-order']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-prompt']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-card']} */ ;
/** @type {__VLS_StyleScopedClasses['benefits-list']} */ ;
/** @type {__VLS_StyleScopedClasses['benefits-list']} */ ;
/** @type {__VLS_StyleScopedClasses['benefits-list']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-back']} */ ;
/** @type {__VLS_StyleScopedClasses['service-details']} */ ;
/** @type {__VLS_StyleScopedClasses['service-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['service-hero']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "service-detail-view" },
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
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
    });
    /** @type {[typeof BaseLoader, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(BaseLoader, new BaseLoader({
        text: "Загрузка информации об услуге...",
    }));
    const __VLS_4 = __VLS_3({
        text: "Загрузка информации об услуге...",
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
else if (__VLS_ctx.service) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "service-content" },
    });
    if (__VLS_ctx.service.image) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "service-hero" },
            ...{ style: ({ backgroundImage: `url(${__VLS_ctx.service.image})` }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "hero-overlay" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
            ...{ class: "hero-title" },
        });
        (__VLS_ctx.service.title);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
            ...{ class: "page-title" },
        });
        (__VLS_ctx.service.title);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "service-details" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "service-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "price-block" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price" },
    });
    (__VLS_ctx.formatPrice(__VLS_ctx.service.price));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "description-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.service.description);
    if (__VLS_ctx.service.features && __VLS_ctx.service.features.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "features-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: "features-list" },
        });
        for (const [feature, index] of __VLS_getVForSourceType((__VLS_ctx.service.features))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (index),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "check-icon" },
            });
            (feature);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "order-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    if (__VLS_ctx.authStore.isAuthenticated) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!(__VLS_ctx.service))
                        return;
                    if (!(__VLS_ctx.authStore.isAuthenticated))
                        return;
                    __VLS_ctx.showOrderModal = true;
                } },
            ...{ class: "btn-order" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "auth-prompt" },
        });
        const __VLS_6 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
            to: "/login",
        }));
        const __VLS_8 = __VLS_7({
            to: "/login",
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        __VLS_9.slots.default;
        var __VLS_9;
        const __VLS_10 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
            to: "/register",
        }));
        const __VLS_12 = __VLS_11({
            to: "/register",
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        __VLS_13.slots.default;
        var __VLS_13;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
        ...{ class: "service-sidebar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sidebar-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "benefits-list" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "benefit-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "benefit-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "benefit-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "benefit-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "not-found" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_14 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
        to: "/services",
        ...{ class: "btn-back" },
    }));
    const __VLS_16 = __VLS_15({
        to: "/services",
        ...{ class: "btn-back" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_17.slots.default;
    var __VLS_17;
}
if (__VLS_ctx.showOrderModal) {
    /** @type {[typeof BaseModal, typeof BaseModal, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(BaseModal, new BaseModal({
        ...{ 'onClose': {} },
        title: (`Заказать: ${__VLS_ctx.service?.title}`),
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClose': {} },
        title: (`Заказать: ${__VLS_ctx.service?.title}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.showOrderModal))
                return;
            __VLS_ctx.showOrderModal = false;
        }
    };
    __VLS_20.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.submitOrder) },
        ...{ class: "order-form" },
    });
    /** @type {[typeof BaseInput, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
        modelValue: (__VLS_ctx.orderForm.comment),
        label: "Комментарий к заказу",
        type: "textarea",
        placeholder: "Опишите ваш груз, адрес забора и доставки...",
        required: (true),
    }));
    const __VLS_26 = __VLS_25({
        modelValue: (__VLS_ctx.orderForm.comment),
        label: "Комментарий к заказу",
        type: "textarea",
        placeholder: "Опишите ваш груз, адрес забора и доставки...",
        required: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    /** @type {[typeof BaseInput, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
        modelValue: (__VLS_ctx.orderForm.address),
        label: "Адрес доставки",
        placeholder: "Город, улица, дом",
        required: (true),
    }));
    const __VLS_29 = __VLS_28({
        modelValue: (__VLS_ctx.orderForm.address),
        label: "Адрес доставки",
        placeholder: "Город, улица, дом",
        required: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-actions" },
    });
    /** @type {[typeof BaseButton, typeof BaseButton, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
        type: "submit",
        disabled: (__VLS_ctx.submitting),
    }));
    const __VLS_32 = __VLS_31({
        type: "submit",
        disabled: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_33.slots.default;
    (__VLS_ctx.submitting ? 'Отправка...' : 'Отправить заявку');
    var __VLS_33;
    /** @type {[typeof BaseButton, typeof BaseButton, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
        ...{ 'onClick': {} },
        type: "button",
        variant: "secondary",
    }));
    const __VLS_35 = __VLS_34({
        ...{ 'onClick': {} },
        type: "button",
        variant: "secondary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_37;
    let __VLS_38;
    let __VLS_39;
    const __VLS_40 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.showOrderModal))
                return;
            __VLS_ctx.showOrderModal = false;
        }
    };
    __VLS_36.slots.default;
    var __VLS_36;
    var __VLS_20;
}
/** @type {__VLS_StyleScopedClasses['service-detail-view']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['service-content']} */ ;
/** @type {__VLS_StyleScopedClasses['service-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['service-details']} */ ;
/** @type {__VLS_StyleScopedClasses['service-main']} */ ;
/** @type {__VLS_StyleScopedClasses['price-block']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['description-section']} */ ;
/** @type {__VLS_StyleScopedClasses['features-section']} */ ;
/** @type {__VLS_StyleScopedClasses['features-list']} */ ;
/** @type {__VLS_StyleScopedClasses['check-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['order-section']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-order']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-prompt']} */ ;
/** @type {__VLS_StyleScopedClasses['service-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-card']} */ ;
/** @type {__VLS_StyleScopedClasses['benefits-list']} */ ;
/** @type {__VLS_StyleScopedClasses['benefit-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['benefit-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['benefit-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['benefit-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-back']} */ ;
/** @type {__VLS_StyleScopedClasses['order-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseBreadcrumbs: BaseBreadcrumbs,
            BaseLoader: BaseLoader,
            BaseModal: BaseModal,
            BaseInput: BaseInput,
            BaseButton: BaseButton,
            authStore: authStore,
            service: service,
            loading: loading,
            showOrderModal: showOrderModal,
            submitting: submitting,
            orderForm: orderForm,
            breadcrumbs: breadcrumbs,
            formatPrice: formatPrice,
            submitOrder: submitOrder,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

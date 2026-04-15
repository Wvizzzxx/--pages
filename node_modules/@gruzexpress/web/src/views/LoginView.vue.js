import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseBreadcrumbs from '@repo/ui/src/components/BaseBreadcrumbs.vue';
import BaseInput from '@repo/ui/src/components/BaseInput.vue';
import BaseButton from '@repo/ui/src/components/BaseButton.vue';
import { useAuthStore } from '../stores/auth';
const router = useRouter();
const authStore = useAuthStore();
const breadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Войти' },
];
const form = ref({
    email: '',
    password: '',
});
const error = ref('');
const submitting = ref(false);
async function handleLogin() {
    if (!form.value.email || !form.value.password) {
        error.value = 'Заполните все поля';
        return;
    }
    submitting.value = true;
    error.value = '';
    try {
        const response = await authStore.login(form.value.email, form.value.password);
        if (response?.success && response.data) {
            router.push('/profile');
        }
        else {
            error.value = (response && response.message) || 'Неверный email или пароль';
        }
    }
    catch (e) {
        error.value = e?.response?.data?.message || 'Произошла ошибка. Попробуйте ещё раз.';
    }
    finally {
        submitting.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "login-view" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "auth-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleLogin) },
    ...{ class: "auth-form" },
});
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.email),
    label: "Email",
    type: "email",
    placeholder: "example@mail.ru",
    required: (true),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.form.email),
    label: "Email",
    type: "email",
    placeholder: "example@mail.ru",
    required: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.password),
    label: "Пароль",
    type: "password",
    placeholder: "Введите пароль",
    required: (true),
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.form.password),
    label: "Пароль",
    type: "password",
    placeholder: "Введите пароль",
    required: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
}
/** @type {[typeof BaseButton, typeof BaseButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
    type: "submit",
    disabled: (__VLS_ctx.submitting),
    ...{ class: "submit-btn" },
}));
const __VLS_10 = __VLS_9({
    type: "submit",
    disabled: (__VLS_ctx.submitting),
    ...{ class: "submit-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
(__VLS_ctx.submitting ? 'Вход...' : 'Войти');
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "auth-link" },
});
const __VLS_12 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    to: "/register",
}));
const __VLS_14 = __VLS_13({
    to: "/register",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
/** @type {__VLS_StyleScopedClasses['login-view']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-title']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-form']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseBreadcrumbs: BaseBreadcrumbs,
            BaseInput: BaseInput,
            BaseButton: BaseButton,
            breadcrumbs: breadcrumbs,
            form: form,
            error: error,
            submitting: submitting,
            handleLogin: handleLogin,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

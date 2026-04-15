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
    { label: 'Регистрация' },
];
const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
});
const error = ref('');
const submitting = ref(false);
async function handleRegister() {
    if (!form.value.name || !form.value.email || !form.value.password || !form.value.confirmPassword) {
        error.value = 'Заполните все поля';
        return;
    }
    if (form.value.password.length < 6) {
        error.value = 'Пароль должен содержать минимум 6 символов';
        return;
    }
    if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Пароли не совпадают';
        return;
    }
    submitting.value = true;
    error.value = '';
    try {
        const response = await authStore.register(form.value.name, form.value.email, form.value.password);
        if (response?.success && response.data) {
            router.push('/profile');
        }
        else {
            error.value = (response && response.message) || 'Ошибка при регистрации';
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
    ...{ class: "register-view" },
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
    ...{ onSubmit: (__VLS_ctx.handleRegister) },
    ...{ class: "auth-form" },
});
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.name),
    label: "Имя",
    placeholder: "Иван Иванов",
    required: (true),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.form.name),
    label: "Имя",
    placeholder: "Иван Иванов",
    required: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.email),
    label: "Email",
    type: "email",
    placeholder: "example@mail.ru",
    required: (true),
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.form.email),
    label: "Email",
    type: "email",
    placeholder: "example@mail.ru",
    required: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.password),
    label: "Пароль",
    type: "password",
    placeholder: "Минимум 6 символов",
    required: (true),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.form.password),
    label: "Пароль",
    type: "password",
    placeholder: "Минимум 6 символов",
    required: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.confirmPassword),
    label: "Подтверждение пароля",
    type: "password",
    placeholder: "Повторите пароль",
    required: (true),
}));
const __VLS_13 = __VLS_12({
    modelValue: (__VLS_ctx.form.confirmPassword),
    label: "Подтверждение пароля",
    type: "password",
    placeholder: "Повторите пароль",
    required: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
}
/** @type {[typeof BaseButton, typeof BaseButton, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(BaseButton, new BaseButton({
    type: "submit",
    disabled: (__VLS_ctx.submitting),
    ...{ class: "submit-btn" },
}));
const __VLS_16 = __VLS_15({
    type: "submit",
    disabled: (__VLS_ctx.submitting),
    ...{ class: "submit-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
(__VLS_ctx.submitting ? 'Регистрация...' : 'Зарегистрироваться');
var __VLS_17;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "auth-link" },
});
const __VLS_18 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    to: "/login",
}));
const __VLS_20 = __VLS_19({
    to: "/login",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
var __VLS_21;
/** @type {__VLS_StyleScopedClasses['register-view']} */ ;
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
            handleRegister: handleRegister,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

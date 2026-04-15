import { ref } from 'vue';
import BaseBreadcrumbs from '@repo/ui/src/components/BaseBreadcrumbs.vue';
import BaseInput from '@repo/ui/src/components/BaseInput.vue';
import BaseButton from '@repo/ui/src/components/BaseButton.vue';
const breadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Контакты' },
];
const form = ref({
    name: '',
    email: '',
    phone: '',
    message: '',
});
const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
async function submitForm() {
    if (!form.value.name || !form.value.email || !form.value.message) {
        errorMessage.value = 'Пожалуйста, заполните все обязательные поля';
        return;
    }
    submitting.value = true;
    successMessage.value = '';
    errorMessage.value = '';
    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value),
        });
        if (response.ok) {
            successMessage.value = 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
            form.value = { name: '', email: '', phone: '', message: '' };
        }
        else {
            errorMessage.value = 'Ошибка при отправке сообщения. Попробуйте ещё раз.';
        }
    }
    catch (e) {
        errorMessage.value = 'Произошла ошибка. Попробуйте связаться с нами по телефону.';
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
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-value']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-value']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-table']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-table']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-form']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "contacts-view" },
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
    ...{ class: "contacts-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contacts-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "contact-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "tel:+78005553535",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "contact-note" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "contact-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "mailto:info@gruzexpress.ru",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "contact-note" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "contact-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "contact-note" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contact-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
    ...{ class: "schedule-table" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "contact-note" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "contacts-form" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.submitForm) },
    ...{ class: "contact-form" },
});
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.name),
    label: "Ваше имя",
    placeholder: "Иван Иванов",
    required: (true),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.form.name),
    label: "Ваше имя",
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
    modelValue: (__VLS_ctx.form.phone),
    label: "Телефон",
    type: "tel",
    placeholder: "+7 (___) ___-__-__",
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.form.phone),
    label: "Телефон",
    type: "tel",
    placeholder: "+7 (___) ___-__-__",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.form.message),
    label: "Сообщение",
    type: "textarea",
    placeholder: "Опишите ваш вопрос...",
    required: (true),
}));
const __VLS_13 = __VLS_12({
    modelValue: (__VLS_ctx.form.message),
    label: "Сообщение",
    type: "textarea",
    placeholder: "Опишите ваш вопрос...",
    required: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
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
(__VLS_ctx.submitting ? 'Отправка...' : 'Отправить сообщение');
var __VLS_17;
if (__VLS_ctx.successMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "success-message" },
    });
    (__VLS_ctx.successMessage);
}
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.errorMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "contacts-info-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
/** @type {__VLS_StyleScopedClasses['contacts-view']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-content']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-info']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-value']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-note']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-value']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-note']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-value']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-note']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-table']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-note']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-form']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-form']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['contacts-info-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseBreadcrumbs: BaseBreadcrumbs,
            BaseInput: BaseInput,
            BaseButton: BaseButton,
            breadcrumbs: breadcrumbs,
            form: form,
            submitting: submitting,
            successMessage: successMessage,
            errorMessage: errorMessage,
            submitForm: submitForm,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

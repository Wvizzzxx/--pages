/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
const currentYear = new Date().getFullYear();
const isVisible = ref(false);
function handleScroll() {
    isVisible.value = window.scrollY > 500;
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['social-link']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-links']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-links']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-bottom-link']} */ ;
/** @type {__VLS_StyleScopedClasses['scrollToTop']} */ ;
/** @type {__VLS_StyleScopedClasses['scrollToTop']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-main']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-main']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-bottom-links']} */ ;
/** @type {__VLS_StyleScopedClasses['scrollToTop']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "site-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-section footer-about" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "footer-logo" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "footer-logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "footer-logo-icon" },
    viewBox: "0 0 200 50",
    width: "160",
    height: "40",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    x: "5",
    y: "20",
    width: "50",
    height: "20",
    rx: "3",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    x: "55",
    y: "10",
    width: "30",
    height: "30",
    rx: "3",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "20",
    cy: "45",
    r: "5",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "45",
    cy: "45",
    r: "5",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "75",
    cy: "45",
    r: "5",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.text, __VLS_intrinsicElements.text)({
    x: "95",
    y: "35",
    'font-family': "Arial, sans-serif",
    'font-size': "24",
    'font-weight': "bold",
    fill: "currentColor",
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "footer-description" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "social-links" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
    ...{ class: "social-link" },
    'aria-label': "VKontakte",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.596-.19 1.364 1.26 2.178 1.817.615.42 1.084.327 1.084.327l2.18-.03s1.14-.07.6-.964c-.045-.073-.317-.661-1.63-1.869-1.374-1.264-1.19-1.059.466-3.245.758-1.001 1.06-1.617.967-1.881-.088-.248-.633-.183-.633-.183l-2.45.015s-.182-.025-.317.056c-.132.079-.217.264-.217.264s-.39 1.038-.91 1.92c-1.098 1.863-1.537 1.963-1.716 1.847-.416-.27-.312-1.087-.312-1.669 0-1.822.276-2.58-.536-2.777-.27-.065-.468-.108-1.156-.115-.882-.009-1.628.003-2.05.21-.28.14-.496.446-.365.463.163.022.53.1.725.364.252.341.243 1.108.243 1.108s.145 2.133-.338 2.4c-.332.184-.787-.19-1.76-1.878-.5-.866-.878-1.825-.878-1.825s-.073-.179-.203-.275c-.158-.116-.378-.153-.378-.153l-2.33.015s-.35.01-.479.162c-.114.136-.009.417-.009.417s1.836 4.272 3.92 6.423c1.907 1.97 4.072 1.84 4.072 1.84h.982z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
    ...{ class: "social-link" },
    'aria-label': "Telegram",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
    ...{ class: "social-link" },
    'aria-label': "WhatsApp",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "footer-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "footer-links" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
const __VLS_4 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    to: "/",
}));
const __VLS_6 = __VLS_5({
    to: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/services",
}));
const __VLS_10 = __VLS_9({
    to: "/services",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
const __VLS_12 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    to: "/about",
}));
const __VLS_14 = __VLS_13({
    to: "/about",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
const __VLS_16 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    to: "/delivery",
}));
const __VLS_18 = __VLS_17({
    to: "/delivery",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
const __VLS_20 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    to: "/guarantee",
}));
const __VLS_22 = __VLS_21({
    to: "/guarantee",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
const __VLS_24 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    to: "/contacts",
}));
const __VLS_26 = __VLS_25({
    to: "/contacts",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "footer-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "footer-links" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "footer-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "footer-contacts" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "contact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "contact-icon" },
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "tel:+78005553535",
    ...{ class: "footer-phone" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "work-hours" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "contact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "contact-icon" },
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.polyline)({
    points: "22,6 12,13 2,6",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "mailto:info@gruzexpress.ru",
    ...{ class: "footer-email" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "response-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "contact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "contact-icon" },
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "12",
    cy: "10",
    r: "3",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "work-hours" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-bottom" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "copyright" },
});
(__VLS_ctx.currentYear);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-bottom-links" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
    ...{ class: "footer-bottom-link" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
    ...{ class: "footer-bottom-link" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.scrollToTop) },
    ...{ class: "scroll-to-top" },
    ...{ class: ({ 'visible': __VLS_ctx.isVisible }) },
    'aria-label': "Наверх",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.polyline)({
    points: "18 15 12 9 6 15",
});
/** @type {__VLS_StyleScopedClasses['site-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-main']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-about']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-logo-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-description']} */ ;
/** @type {__VLS_StyleScopedClasses['social-links']} */ ;
/** @type {__VLS_StyleScopedClasses['social-link']} */ ;
/** @type {__VLS_StyleScopedClasses['social-link']} */ ;
/** @type {__VLS_StyleScopedClasses['social-link']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-title']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-links']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-title']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-links']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-section']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-title']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-contacts']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-phone']} */ ;
/** @type {__VLS_StyleScopedClasses['work-hours']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-email']} */ ;
/** @type {__VLS_StyleScopedClasses['response-time']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['contact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['work-hours']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['copyright']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-bottom-links']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-bottom-link']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-bottom-link']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-to-top']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            currentYear: currentYear,
            isVisible: isVisible,
            scrollToTop: scrollToTop,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

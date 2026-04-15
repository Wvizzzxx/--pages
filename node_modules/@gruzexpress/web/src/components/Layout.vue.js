/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import HeaderComponent from './HeaderComponent.vue';
import FooterComponent from './FooterComponent.vue';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "layout" },
});
/** @type {[typeof HeaderComponent, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(HeaderComponent, new HeaderComponent({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const __VLS_3 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
{
    const { default: __VLS_thisSlot } = __VLS_6.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_7 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        name: "page",
        mode: "out-in",
    }));
    const __VLS_9 = __VLS_8({
        name: "page",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_10.slots.default;
    const __VLS_11 = {}.KeepAlive;
    /** @type {[typeof __VLS_components.KeepAlive, typeof __VLS_components.keepAlive, typeof __VLS_components.KeepAlive, typeof __VLS_components.keepAlive, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        include: (['HomeView']),
    }));
    const __VLS_13 = __VLS_12({
        include: (['HomeView']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    __VLS_14.slots.default;
    const __VLS_15 = ((Component));
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        ...{ class: "page-component" },
        key: (__VLS_ctx.$route.path),
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: "page-component" },
        key: (__VLS_ctx.$route.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    var __VLS_14;
    var __VLS_10;
    __VLS_6.slots['' /* empty slot name completion */];
}
var __VLS_6;
/** @type {[typeof FooterComponent, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(FooterComponent, new FooterComponent({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['page-component']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            HeaderComponent: HeaderComponent,
            FooterComponent: FooterComponent,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

import { onMounted, onUnmounted, ref } from 'vue';
export function useScrollReveal(target, options = {}) {
    const { threshold = 0.1, rootMargin = '0px', delay = 100, } = options;
    const isVisible = ref(false);
    let observer = null;
    let timeoutId = null;
    const observe = (element) => {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    timeoutId = setTimeout(() => {
                        isVisible.value = true;
                        element.classList.add('visible');
                        observer?.unobserve(element);
                    }, delay);
                }
            });
        }, { threshold, rootMargin });
        observer.observe(element);
    };
    const unobserve = () => {
        if (observer && target?.value) {
            observer.unobserve(target.value);
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
    onMounted(() => {
        if (target?.value) {
            observe(target.value);
        }
    });
    onUnmounted(() => {
        unobserve();
    });
    return { isVisible, observe, unobserve };
}
export function useScrollRevealAll(selector = '.scroll-reveal', options = {}) {
    const { threshold = 0.1, rootMargin = '0px', delay = 100, } = options;
    let observer = null;
    const elements = ref([]);
    const init = () => {
        const observedElements = document.querySelectorAll(selector);
        elements.value = Array.from(observedElements);
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const elementIndex = elements.value.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        observer?.unobserve(entry.target);
                    }, elementIndex * 100 + delay);
                }
            });
        }, { threshold, rootMargin });
        observedElements.forEach((el) => {
            observer?.observe(el);
        });
    };
    const destroy = () => {
        if (observer) {
            elements.value.forEach((el) => observer?.unobserve(el));
            observer.disconnect();
        }
    };
    onMounted(() => {
        init();
    });
    onUnmounted(() => {
        destroy();
    });
    return { elements, init, destroy };
}

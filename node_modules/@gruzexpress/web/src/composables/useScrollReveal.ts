import { onMounted, onUnmounted, Ref, ref } from 'vue';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

/**
 * Для наблюдения за одним элементом (ref).
 */
export function useScrollReveal(
  target?: Ref<HTMLElement | null> | null,
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    delay = 80,
  } = options;

  const isVisible = ref(false);
  let observer: IntersectionObserver | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const observe = (element: HTMLElement) => {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeoutId = setTimeout(() => {
              isVisible.value = true;
              element.classList.add('visible');
              observer?.unobserve(element);
            }, delay);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(element);
  };

  const unobserve = () => {
    if (observer && target?.value) {
      observer.unobserve(target.value);
    }
    if (timeoutId) clearTimeout(timeoutId);
  };

  /**
   * Инициализация observer для всех .scroll-reveal элементов на странице.
   * Используется в HomeView и других страницах.
   */
  const initObserver = (selector = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right') => {
    if (observer) observer.disconnect();
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer?.observe(el));
  };

  const disconnect = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (timeoutId) clearTimeout(timeoutId);
  };

  if (target) {
    onMounted(() => {
      if (target.value) observe(target.value);
    });
    onUnmounted(() => unobserve());
  }

  return { isVisible, observe, unobserve, initObserver, disconnect };
}

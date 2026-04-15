import { onMounted, onUnmounted, Ref, ref } from 'vue';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export function useScrollReveal(
  target: Ref<HTMLElement | null> | null,
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    delay = 100,
  } = options;

  const isVisible = ref(false);
  let observer: IntersectionObserver | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const observe = (element: HTMLElement) => {
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

export function useScrollRevealAll(
  selector = '.scroll-reveal',
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    delay = 100,
  } = options;

  let observer: IntersectionObserver | null = null;
  const elements = ref<HTMLElement[]>([]);

  const init = () => {
    const observedElements = document.querySelectorAll<HTMLElement>(selector);
    elements.value = Array.from(observedElements);

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const elementIndex = elements.value.indexOf(entry.target as HTMLElement);
            setTimeout(() => {
              entry.target.classList.add('visible');
              observer?.unobserve(entry.target as HTMLElement);
            }, elementIndex * 100 + delay);
          }
        });
      },
      { threshold, rootMargin }
    );

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
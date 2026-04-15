import { ref, readonly } from 'vue';

const isOpen = ref(false);
const confirmMessage = ref('');
const confirmTitle = ref('');
let resolveFn: ((value: boolean) => void) | null = null;

export function useConfirmDialog() {
  function openConfirm(title: string, message: string): Promise<boolean> {
    confirmTitle.value = title;
    confirmMessage.value = message;
    isOpen.value = true;
    
    return new Promise((resolve) => {
      resolveFn = resolve;
    });
  }

  function confirm(value: boolean) {
    isOpen.value = false;
    if (resolveFn) {
      resolveFn(value);
      resolveFn = null;
    }
  }

  function closeConfirm() {
    isOpen.value = false;
    if (resolveFn) {
      resolveFn(false);
      resolveFn = null;
    }
  }

  return {
    isOpen: readonly(isOpen),
    confirmMessage: readonly(confirmMessage),
    confirmTitle: readonly(confirmTitle),
    openConfirm,
    closeConfirm,
    confirm,
  };
}
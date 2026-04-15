import { ref, readonly } from 'vue';
import type { Notification, NotificationType } from '@repo/types';

const notifications = ref<Notification[]>([]);

let nextId = 0;

export function useNotifications() {
  function addNotification(
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000
  ) {
    const notification: Notification = {
      id: String(nextId++),
      type,
      title,
      message,
      duration,
    };
    notifications.value.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  function success(title: string, message: string) {
    addNotification('success', title, message);
  }

  function error(title: string, message: string) {
    addNotification('error', title, message);
  }

  function warning(title: string, message: string) {
    addNotification('warning', title, message);
  }

  function info(title: string, message: string) {
    addNotification('info', title, message);
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
}
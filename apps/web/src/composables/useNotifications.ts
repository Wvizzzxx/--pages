import { ref, readonly } from 'vue';
import type { Notification, NotificationType } from '@repo/types';

const notifications = ref<Notification[]>([]);

let nextId = 1;

function addNotification(notification: {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}): string {
  const id = `notification-${nextId++}`;
  const newNotification: Notification = {
    id,
    type: notification.type,
    title: notification.title || '',
    message: notification.message,
    duration: notification.duration || 5000,
  };

  notifications.value.push(newNotification);

  if (newNotification.duration && newNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);
  }

  return id;
}

function removeNotification(id: string): void {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
}

function success(message: string, title?: string, duration?: number): string {
  return addNotification({ type: 'success', title, message, duration });
}

function error(message: string, title?: string, duration?: number): string {
  return addNotification({ type: 'error', title, message, duration });
}

function warning(message: string, title?: string, duration?: number): string {
  return addNotification({ type: 'warning', title, message, duration });
}

function info(message: string, title?: string, duration?: number): string {
  return addNotification({ type: 'info', title, message, duration });
}

export function useNotifications() {
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
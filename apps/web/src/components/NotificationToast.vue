<template>
  <div class="notification-container">
    <TransitionGroup name="notification-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        role="alert"
      >
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✓</span>
          <span v-else-if="notification.type === 'error'">✕</span>
          <span v-else-if="notification.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <div class="notification-content">
          <div v-if="notification.title" class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button class="notification-close" @click="removeNotification(notification.id)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '../composables/useNotifications';

const { notifications, removeNotification } = useNotifications();
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}

.notification-success .notification-icon { background: #10b981; }
.notification-error .notification-icon { background: #ef4444; }
.notification-warning .notification-icon { background: #f59e0b; }
.notification-info .notification-icon { background: #3b82f6; }

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
}

.notification-close:hover {
  color: #374151;
}

.notification-list-enter-active {
  transition: all 0.3s ease;
}

.notification-list-leave-active {
  transition: all 0.2s ease;
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-list-move {
  transition: transform 0.3s ease;
}
</style>
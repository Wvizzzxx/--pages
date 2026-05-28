<template>
  <Teleport to="body">
    <Transition name="confirm-dialog">
      <div v-if="isOpen" class="confirm-overlay">
        <div class="confirm-dialog-box">
          <div class="confirm-header">
            <h3>{{ confirmTitle }}</h3>
          </div>
          <div class="confirm-body">
            <p>{{ confirmMessage }}</p>
          </div>
          <div class="confirm-footer">
            <button class="btn-cancel" @click="closeConfirm">Отмена</button>
            <button class="btn-confirm" @click="confirm(true)">Подтвердить</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useConfirmDialog } from '../composables/useConfirmDialog';

const { isOpen, confirmTitle, confirmMessage, closeConfirm, confirm } = useConfirmDialog();
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.confirm-dialog-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.confirm-header h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #111827;
}

.confirm-body p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
  font-size: 14px;
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 20px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-confirm {
  padding: 10px 20px;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  background: #dc2626;
}

.confirm-dialog-enter-active,
.confirm-dialog-leave-active {
  transition: all 0.3s ease;
}

.confirm-dialog-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.confirm-dialog-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
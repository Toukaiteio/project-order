<template>
  <GameDialog
    :show="dialogStore.show"
    :title="dialogStore.options.title"
    :variant="dialogStore.options.variant"
    @close="dialogStore.close"
  >
    <p>{{ dialogStore.options.content }}</p>

    <template #footer>
      <button
        v-if="dialogStore.isConfirm"
        class="dialog-btn cancel"
        @click="dialogStore.handleCancel"
      >
        {{ dialogStore.options.cancelText }}
      </button>
      <button
        class="dialog-btn confirm"
        :class="[dialogStore.options.variant]"
        @click="dialogStore.handleConfirm"
      >
        {{ dialogStore.options.confirmText }}
      </button>
    </template>
  </GameDialog>
</template>

<script setup lang="ts">
import GameDialog from './common/GameDialog.vue'
import type { useDialogStore } from '../stores/dialog'

defineProps<{
  dialogStore: ReturnType<typeof useDialogStore>
}>()
</script>

<style scoped>
.dialog-btn {
  padding: 8px 20px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.dialog-btn.cancel {
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.dialog-btn.cancel:active { background-color: var(--bg-tertiary); }

.dialog-btn.confirm {
  background-color: var(--accent-primary);
  color: white;
}

.dialog-btn.confirm.danger { background-color: var(--accent-red); }
.dialog-btn.confirm.accent { background-color: var(--accent-bright); }

.dialog-btn.confirm:active {
  opacity: 0.8;
  transform: scale(0.96);
}
</style>

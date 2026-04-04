<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="show" class="dialog-overlay" @click.self="onOverlayClick">
        <Transition name="dialog-scale" appear>
          <div v-if="show" class="dialog-panel" :class="[variant]">
            <header v-if="title" class="dialog-header">
              <span class="dialog-title">{{ title }}</span>
              <button v-if="showClose" class="dialog-close" @click="close">
                <X :size="18" />
              </button>
            </header>

            <main class="dialog-body scrollbar-hide">
              <slot></slot>
            </main>

            <footer v-if="$slots.footer" class="dialog-footer">
              <slot name="footer"></slot>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  title?: string
  showClose?: boolean
  variant?: 'default' | 'danger' | 'accent'
  closeOnOverlay?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}

const onOverlayClick = () => {
  if (props.closeOnOverlay) close()
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 11, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.dialog-panel {
  width: 100%;
  max-width: 420px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.dialog-panel.danger { border-color: var(--accent-red); }
.dialog-panel.accent { border-color: var(--accent-primary); }

.dialog-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
}

.dialog-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.dialog-close {
  color: var(--text-muted);
  transition: color 0.2s;
}

.dialog-close:active { color: var(--text-primary); }

.dialog-body {
  padding: 24px 20px;
  max-height: 70vh;
  overflow-y: auto;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.dialog-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
}

/* ── Transitions ── */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.25s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dialog-scale-leave-active {
  transition: all 0.2s ease-in;
}
.dialog-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.dialog-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

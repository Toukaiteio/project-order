<template>
  <div class="start-menu">
    <div class="menu-bg">
      <div class="scanline"></div>
      <div class="noise"></div>
    </div>

    <div class="menu-content">
      <header class="menu-header">
        <h1 class="game-title">PROJECT<br/><span class="accent">ORDER</span></h1>
        <p class="game-subtitle">RECOVERY FACILITY ZERO // DAY 01-90</p>
      </header>

      <div class="menu-actions">
        <button class="menu-btn primary" @click="emit('action', 'new')">
          <span class="btn-label">开始新实验</span>
          <span class="btn-sub">INITIATE NEW SEQUENCE</span>
        </button>

        <button 
          class="menu-btn" 
          :disabled="!hasSave" 
          @click="emit('action', 'continue')"
        >
          <span class="btn-label">继续当前进度</span>
          <span class="btn-sub">RESUME EXPERIMENT</span>
        </button>

        <button class="menu-btn" @click="emit('action', 'settings')">
          <span class="btn-label">环境配置</span>
          <span class="btn-sub">SYSTEM CALIBRATION</span>
        </button>
      </div>

      <footer class="menu-footer">
        <div class="footer-line"></div>
        <div class="footer-info">
          <span>VER 0.8.5 ALPHA</span>
          <span>© 2026 EYE OF ORDER CORP.</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  action: [type: 'new' | 'continue' | 'settings']
}>()

const hasSave = ref(false)

onMounted(() => {
  hasSave.value = !!localStorage.getItem('save_slot_auto')
})
</script>

<style scoped>
.start-menu {
  position: fixed;
  inset: 0;
  background-color: #04080b;
  color: #c4ccd4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: var(--font-ui);
}

.menu-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(44, 110, 168, 0.03) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
}

.noise {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.menu-content {
  position: relative;
  z-index: 10;
  width: min(400px, 90vw);
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.menu-header {
  text-align: center;
}

.game-title {
  font-family: var(--font-mono);
  font-size: 3rem;
  line-height: 0.9;
  letter-spacing: -2px;
  margin-bottom: 10px;
  font-weight: 800;
}

.game-title .accent {
  color: var(--accent-primary);
  text-shadow: 0 0 20px rgba(44, 110, 168, 0.4);
}

.game-subtitle {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 3px;
  color: var(--text-muted);
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-btn {
  background: rgba(24, 37, 47, 0.4);
  border: 1px solid var(--border-color);
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  border-radius: var(--radius-md);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.menu-btn:not(:disabled):hover {
  background: rgba(44, 110, 168, 0.1);
  border-color: var(--accent-primary);
  transform: translateX(4px);
}

.menu-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-sub {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.menu-btn.primary {
  border-left: 4px solid var(--accent-primary);
}

.menu-footer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-line {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border-color), transparent);
}

.footer-info {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-muted);
}
</style>

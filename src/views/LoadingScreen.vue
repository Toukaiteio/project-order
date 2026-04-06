<template>
  <div class="loading-screen">
    <div class="loading-bg">
      <div class="scanline"></div>
      <div class="noise"></div>
    </div>

    <div class="loading-content">
      <div class="loading-block">
        <div class="loading-logo">
          <span class="logo-text">PROJECT <span class="accent">ORDER</span></span>
        </div>
        
        <div class="progress-section">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          </div>
          <div class="progress-info">
            <span class="progress-text">{{ currentStep }}</span>
            <span class="progress-percent">{{ progress }}%</span>
          </div>
        </div>

        <div v-if="validationResult && !validationResult.isValid" class="error-container error-hard">
          <div class="error-header">⚠ 校验失败 — {{ validationResult.errors.length }} 个严重错误</div>
          <div class="error-list">
            <div v-for="e in validationResult.errors" :key="e.sceneId + e.actionId" class="error-item error-item-error">
              {{ e.details }}
            </div>
          </div>
          <div class="error-actions">
             <button class="menu-btn primary" @click="proceedToGame">强行进入</button>
             <button class="menu-btn" @click="toggleDebugInfo">原始日志</button>
          </div>
        </div>
        <div v-if="validationResult && validationResult.isValid && validationResult.warnings.length > 0" class="error-container error-warn">
          <div class="warn-header">⚑ {{ validationResult.warnings.length }} 个运行时风险警告</div>
          <div class="error-list">
            <div v-for="w in validationResult.warnings" :key="w.sceneId + w.actionId" class="error-item error-item-warn">
              {{ w.details }}
            </div>
          </div>
          <div class="error-actions" style="margin-top:12px">
             <button class="menu-btn" @click="toggleDebugInfo">原始日志</button>
          </div>
        </div>
      </div>
      
      <!-- Debug Info -->
      <div v-if="showDebugInfo && validationResult" class="debug-info">
        <pre>{{ JSON.stringify(validationResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useSceneValidator, type ValidationResult } from '../composables/useSceneValidator';

const emit = defineEmits<{
  ready: [];
}>();

const validationResult = ref<ValidationResult | null>(null);
const progress = ref(0);
const currentStep = ref('INITIALIZING SYSTEM...');
const showDebugInfo = ref(false);
const autoEnterTimeout = ref<number | null>(null);

const steps = [
  { text: 'LOADING SCENARIO DATABASE...', duration: 600 },
  { text: 'VALIDATING SCENE LINKS...', duration: 800 },
  { text: 'CHECKING INTEGRITY...', duration: 600 },
  { text: 'SYSTEM READY', duration: 400 },
];

onMounted(async () => {
  let currentProgress = 0;

  // 模拟加载进度
  const progressInterval = setInterval(() => {
    if (currentProgress < 90) {
      currentProgress += Math.random() * 15;
      if (currentProgress > 90) currentProgress = 90;
      progress.value = Math.floor(currentProgress);
    }
  }, 250);

  // 执行自检
  try {
    const { validateAll } = useSceneValidator();

    // 模拟逐步检查
    for (let i = 0; i < steps.length; i++) {
      currentStep.value = steps[i].text;
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      progress.value = Math.floor(((i + 1) / steps.length) * 100);
    }

    // 执行真正的验证
    currentStep.value = 'RUNNING DIAGNOSTICS...';
    await new Promise(resolve => setTimeout(resolve, 300));
    
    validationResult.value = validateAll();
    progress.value = 100;

    if (validationResult.value.isValid) {
      const warnCount = validationResult.value.warnings.length;
      if (warnCount > 0) {
        currentStep.value = `ALL SYSTEMS NOMINAL — ${warnCount} WARNING(S). ENTERING...`;
      } else {
        currentStep.value = 'ALL SYSTEMS NOMINAL. ENTERING...';
      }
      autoEnterTimeout.value = window.setTimeout(() => {
        proceedToGame();
      }, warnCount > 0 ? 1800 : 600);
    } else {
      currentStep.value = `CRITICAL ERRORS DETECTED (${validationResult.value.errors.length}). HALTING.`;
    }
  } finally {
    clearInterval(progressInterval);
  }
});

onUnmounted(() => {
  if (autoEnterTimeout.value !== null) {
    window.clearTimeout(autoEnterTimeout.value);
  }
});

const proceedToGame = () => {
  emit('ready');
};

const toggleDebugInfo = () => {
  showDebugInfo.value = !showDebugInfo.value;
};
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-ui);
  overflow: hidden;
}

.loading-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
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

.loading-content {
  position: relative;
  z-index: 10;
  width: min(400px, 90vw);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loading-block {
  background: rgba(24, 37, 47, 0.4);
  border: 1px solid var(--border-color);
  padding: 32px 24px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.loading-logo {
  text-align: center;
}

.logo-text {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--text-primary);
  line-height: 1;
}

.logo-text .accent {
  color: var(--accent-primary);
  text-shadow: 0 0 15px rgba(44, 110, 168, 0.4);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-bar-container {
  width: 100%;
  height: 2px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 1px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--accent-primary);
  box-shadow: 0 0 8px var(--accent-primary);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.error-container {
  margin-top: 8px;
  padding-top: 24px;
  border-top: 1px dashed rgba(184, 50, 40, 0.3);
}

.error-container.error-warn {
  border-top-color: rgba(200, 140, 40, 0.3);
}

.error-header {
  color: var(--accent-red);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  text-align: center;
}

.warn-header {
  color: #c8a028;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  text-align: center;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  max-height: 120px;
  overflow-y: auto;
}

.error-item {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  line-height: 1.5;
  padding: 4px 8px;
  border-radius: 3px;
  word-break: break-all;
}

.error-item-error {
  color: #e85050;
  background: rgba(184, 50, 40, 0.08);
  border-left: 2px solid rgba(184, 50, 40, 0.5);
}

.error-item-warn {
  color: #c8a028;
  background: rgba(200, 140, 40, 0.08);
  border-left: 2px solid rgba(200, 140, 40, 0.4);
}

.error-actions {
  display: flex;
  gap: 12px;
}

.menu-btn {
  background: rgba(24, 37, 47, 0.4);
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  text-align: center;
  cursor: pointer;
}

.menu-btn:hover {
  background: rgba(44, 110, 168, 0.1);
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.menu-btn.primary {
  border-color: rgba(184, 50, 40, 0.5);
  color: var(--accent-red);
}

.menu-btn.primary:hover {
  background: rgba(184, 50, 40, 0.1);
  border-color: var(--accent-red);
  box-shadow: 0 0 12px rgba(184, 50, 40, 0.2);
}

.debug-info {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.debug-info pre {
  margin: 0;
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
}
</style>


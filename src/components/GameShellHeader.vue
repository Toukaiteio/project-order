<template>
  <header class="g-header">
    <div class="hdr-day">
      <span class="hdr-day-num">D{{ game.day }}</span>
      <span :class="['hdr-phase', game.isRestDay ? 'phase-rest' : 'phase-game']">
        {{ game.isRestDay ? '浼戞伅鏃?' : '娓告垙鏃?' }}
      </span>
    </div>

    <div class="hdr-vitals">
      <div class="hdr-vital-pair">
        <Heart :size="13" class="vital-ico ico-hp" />
        <span class="vital-number">{{ player.stats.hp }}</span>
      </div>
      <span class="hdr-vital-sep">路</span>
      <div class="hdr-vital-pair">
        <Brain :size="13" class="vital-ico ico-san" />
        <span class="vital-number">{{ player.stats.sanity }}</span>
      </div>
    </div>

    <div class="hdr-right">
      <span class="hdr-time">{{ formattedTime }}</span>
      <component :is="weatherIcon" :size="13" class="hdr-wico" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Brain, Heart } from 'lucide-vue-next'
import type { GameState, PlayerStats } from '../stores/game'

defineProps<{
  formattedTime: string
  game: GameState
  player: { stats: PlayerStats }
  weatherIcon: Component
}>()
</script>

<style scoped>
.g-header {
  flex-shrink: 0;
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  gap: 0;
  z-index: 50;
  box-shadow: 0 1px 0 rgba(44,110,168,0.1);
}

.hdr-day {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.hdr-day-num {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--accent-bright);
  letter-spacing: 0.5px;
}

.hdr-phase {
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.phase-rest {
  background: rgba(35,117,84,0.15);
  color: var(--accent-green);
  border: 1px solid rgba(35,117,84,0.3);
}

.phase-game {
  background: rgba(184,50,40,0.15);
  color: var(--accent-red);
  border: 1px solid rgba(184,50,40,0.3);
}

.hdr-vitals {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.hdr-vital-pair {
  display: flex;
  align-items: center;
  gap: 5px;
}

.vital-ico { flex-shrink: 0; }
.ico-hp { color: var(--accent-red); }
.ico-san { color: var(--accent-bright); }

.vital-number {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.5px;
}

.hdr-vital-sep {
  color: var(--text-muted);
  font-size: 0.8rem;
  line-height: 1;
}

.hdr-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.hdr-time {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent-amber);
  letter-spacing: 0.5px;
}

.hdr-wico { color: var(--accent-amber); }
</style>

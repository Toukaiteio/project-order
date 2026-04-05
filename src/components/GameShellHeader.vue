<template>
  <header class="g-header">
    <div class="gh-top">
      <div class="gh-loc">
        <MapPin :size="14" class="gh-ico-primary" />
        <span class="gh-loc-text">{{ locationName }}</span>
      </div>
      <div class="gh-stats">
        <div class="gh-stat-item">
          <Clock :size="14" class="gh-ico-muted" />
          <span>{{ formattedTime }}</span>
        </div>
        <div class="gh-stat-item">
          <component :is="weatherIcon" :size="14" class="gh-ico-muted" />
        </div>
      </div>
    </div>
    
    <!-- 任务目标栏 -->
    <div class="gh-objective">
      <Target :size="12" class="gh-obj-ico" />
      <span class="gh-obj-label">当前意图:</span>
      <span class="gh-obj-text">{{ game.objective }}</span>
    </div>

    <div class="gh-bars">
      <div class="gh-bar-wrap hp">
        <div class="gh-bar-fill" :style="{ width: hpPct + '%' }"></div>
      </div>
      <div class="gh-bar-wrap san">
        <div class="gh-bar-fill" :style="{ width: sanPct + '%' }"></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { MapPin, Clock, Target } from 'lucide-vue-next'
import type { GameState, PlayerStats } from '../stores/game'
import { LOCATION_NAMES } from '../constants/gameUi'

const props = defineProps<{
  game: GameState
  player: { stats: PlayerStats }
  formattedTime: string
  weatherIcon: Component
}>()

const locationName = computed(() => LOCATION_NAMES[props.game.location] ?? props.game.location)
const hpPct = computed(() => (props.player.stats.hp / props.player.stats.maxHp) * 100)
const sanPct = computed(() => (props.player.stats.sanity / props.player.stats.maxSanity) * 100)
</script>

<style scoped>
.g-header {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 10px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  z-index: 10;
}

.gh-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gh-loc {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gh-loc-text {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.gh-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gh-stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.gh-ico-primary { color: var(--accent-primary); }
.gh-ico-muted { color: var(--text-muted); }

/* 任务目标栏样式 */
.gh-objective {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(44, 110, 168, 0.08);
  padding: 4px 10px;
  border-radius: 4px;
  border-left: 2px solid var(--accent-primary);
}

.gh-obj-ico {
  color: var(--accent-primary);
}

.gh-obj-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gh-obj-text {
  font-size: 0.78rem;
  color: var(--accent-bright);
  font-weight: 500;
}

.gh-bars {
  display: flex;
  gap: 6px;
}

.gh-bar-wrap {
  flex: 1;
  height: 3px;
  background-color: var(--bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.gh-bar-fill {
  height: 100%;
  transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.hp .gh-bar-fill { background-color: var(--accent-red); }
.san .gh-bar-fill { background-color: var(--accent-primary); }
</style>

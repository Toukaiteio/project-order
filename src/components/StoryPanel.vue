<template>
  <div :class="['tab-pane', { active }]">
    <div class="map-strip">
      <MapCanvas :nodes="mapNodes" :compact="true" />
      <div class="map-strip-overlay">
        <div class="mso-loc">
          <MapPin :size="10" />
          <span>{{ locationName }}</span>
        </div>
        <div class="mso-right">
          <component :is="weatherIcon" :size="10" />
          <span>{{ weatherName }}</span>
        </div>
      </div>
    </div>

    <!-- 战斗状态条 -->
    <div v-if="combat.active" class="combat-hud">
      <div class="ch-enemy-info">
        <span class="ch-enemy-name">{{ combat.enemyName }}</span>
        <div class="ch-hp-bar">
          <div class="ch-hp-fill" :style="{ width: (combat.enemyHp / combat.enemyMaxHp * 100) + '%' }"></div>
        </div>
        <span class="ch-hp-text">{{ combat.enemyHp }} / {{ combat.enemyMaxHp }}</span>
      </div>
    </div>

    <div ref="logEl" class="story-scroll scrollbar-hide">
      <div class="story-inner">
        <div class="log-day-header">
          <span class="ldh-line"></span>
          <span class="ldh-text">第 {{ day }} 天 {{ weatherName }}</span>
          <span class="ldh-line"></span>
        </div>

        <template v-for="entry in logs" :key="entry.id">
          <div
            v-if="entry.type !== 'actions'"
            :class="['log-entry', `le-${entry.type}`]"
          >
            <span class="le-ts">{{ formatLogTime(entry.time) }}</span>
            <p class="le-body">{{ entry.text }}</p>
          </div>

          <div v-else class="log-actions-entry">
            <div v-if="entry.resolvedId" class="la-resolved">
              <span class="lar-arrow">›</span>
              <span class="lar-label">{{ entry.resolvedLabel }}</span>
              <span class="lar-cost">
                {{ entry.choices.find((choice) => choice.id === entry.resolvedId)?.timeCost }}h
              </span>
            </div>

            <template v-else>
              <div class="ia-divider">
                <span class="ia-div-line"></span>
                <span class="ia-div-label">可选行动</span>
                <span class="ia-div-line"></span>
              </div>

              <div class="ia-grid">
                <!-- 正常剧情行动 -->
                <template v-if="!combat.active">
                  <button
                    v-for="choice in entry.choices"
                    :key="choice.id"
                    :class="['ia-btn', `ia-${choice.variant}`]"
                    @click="emit('executeAction', entry, choice)"
                  >
                    <div class="ia-ico">
                      <component :is="resolveActionIcon(choice.id)" :size="15" />
                    </div>
                    <div class="ia-text">
                      <span class="ia-label">{{ choice.label }}</span>
                      <span class="ia-cost">{{ choice.timeCost }}h</span>
                    </div>
                  </button>
                </template>

                <!-- 战斗专属行动 -->
                <template v-else>
                  <button class="ia-btn ia-danger" @click="emit('combatAction', 'atk')">
                    <div class="ia-ico"><Swords :size="15" /></div>
                    <div class="ia-text"><span class="ia-label">攻击</span></div>
                  </button>
                  <button class="ia-btn ia-accent" @click="emit('combatAction', 'def')">
                    <div class="ia-ico"><Shield :size="15" /></div>
                    <div class="ia-text"><span class="ia-label">防御</span></div>
                  </button>
                </template>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch, type Component } from 'vue'
import { MapPin, Swords, Shield } from 'lucide-vue-next'
import MapCanvas from './MapCanvas.vue'
import type { ActionChoice, ActionsEntry, LogEntry, MapNode, CombatState } from '../stores/game'
import { formatLogTime, resolveActionIcon } from '../constants/gameUi'

const props = defineProps<{
  active: boolean
  day: number
  locationName: string
  logs: LogEntry[]
  mapNodes: MapNode[]
  weatherIcon: Component
  weatherName: string
  combat: CombatState
}>()

const emit = defineEmits<{
  executeAction: [entry: ActionsEntry, choice: ActionChoice]
  combatAction: [type: 'atk' | 'def']
}>()

const logEl = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  logEl.value?.scrollTo({
    top: logEl.value.scrollHeight,
    behavior: 'smooth',
  })
}

watch(() => props.logs.length, scrollToBottom)

onMounted(() => {
  if (props.logs.length) scrollToBottom()
})
</script>

<style scoped>
.tab-pane {
  display: none;
  position: absolute;
  inset: 0;
  flex-direction: column;
}
.tab-pane.active { display: flex; }

.map-strip {
  flex-shrink: 0; height: 130px; position: relative;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary); overflow: hidden;
}

.map-strip-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 5px 10px; background: linear-gradient(to top, rgba(7,12,16,0.85) 0%, transparent 100%);
  pointer-events: none;
}

.mso-loc, .mso-right {
  display: flex; align-items: center; gap: 4px;
  font-family: var(--font-mono); font-size: 0.62rem;
  color: rgba(196, 204, 212, 0.7);
}

/* 战斗 HUD */
.combat-hud {
  padding: 10px 16px;
  background-color: rgba(184, 50, 40, 0.1);
  border-bottom: 1px solid var(--accent-red);
}
.ch-enemy-info {
  display: flex; flex-direction: column; gap: 4px;
}
.ch-enemy-name {
  font-size: 0.7rem; font-weight: 700; color: var(--accent-red);
  text-transform: uppercase; letter-spacing: 1px;
}
.ch-hp-bar {
  height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden;
}
.ch-hp-fill {
  height: 100%; background: var(--accent-red); transition: width 0.3s ease;
}
.ch-hp-text {
  font-family: var(--font-mono); font-size: 0.6rem; text-align: right; color: var(--text-muted);
}

.story-scroll { flex: 1; overflow-y: auto; min-height: 0; }
.story-inner { padding: 14px 16px 24px; display: flex; flex-direction: column; }

.log-day-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.ldh-line { flex: 1; height: 1px; background-color: var(--border-color); }
.ldh-text {
  font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted);
  letter-spacing: 2px; text-transform: uppercase; white-space: nowrap;
}

.log-entry {
  display: flex; flex-direction: column; gap: 5px;
  padding: 10px 0 10px 14px; border-left: 2px solid transparent;
  animation: entryIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.log-entry + .log-entry { border-top: 1px solid rgba(24, 35, 48, 0.6); }

@keyframes entryIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.le-story { border-left-color: var(--accent-primary); }
.le-info { border-left-color: transparent; padding-left: 16px; }
.le-warning { border-left-color: var(--accent-amber); }
.le-danger { border-left-color: var(--accent-red); }

.le-ts { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); }
.le-body { font-family: var(--font-narrative); font-size: 0.95rem; line-height: 1.8; color: var(--text-primary); }

.log-actions-entry { padding: 14px 0 6px; }
.la-resolved {
  display: flex; align-items: center; gap: 8px; padding: 7px 14px;
  background-color: rgba(44, 110, 168, 0.07); border: 1px solid rgba(44, 110, 168, 0.18);
  border-radius: var(--radius-md); animation: entryIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.lar-arrow { color: var(--accent-primary); }
.lar-label { flex: 1; font-size: 0.82rem; font-weight: 600; color: var(--accent-bright); }
.lar-cost { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); }

.ia-divider { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.ia-div-line { flex: 1; height: 1px; background-color: var(--border-color); }
.ia-div-label {
  font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-muted);
  letter-spacing: 2px; text-transform: uppercase; white-space: nowrap;
}

.ia-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.ia-btn {
  display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 12px;
  background-color: var(--bg-tertiary); border: 1px solid var(--border-color);
  border-radius: var(--radius-md); color: var(--text-secondary);
  transition: all 0.14s; text-align: left;
}
.ia-btn:active { transform: scale(0.97); background-color: var(--bg-elevated); }
.ia-ico { color: var(--text-muted); flex-shrink: 0; width: 20px; display: flex; justify-content: center; }
.ia-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.ia-label { font-size: 0.82rem; font-weight: 500; color: var(--text-primary); }
.ia-cost { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); }

.ia-accent { border-color: rgba(44,110,168,0.3); background-color: rgba(44,110,168,0.06); }
.ia-accent .ia-ico { color: var(--accent-primary); }
.ia-danger { border-color: rgba(184,50,40,0.3); background-color: rgba(184,50,40,0.05); }
.ia-danger .ia-ico { color: var(--accent-red); }
</style>

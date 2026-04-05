<template>
  <Teleport to="body">
    <Transition name="sidebar-overlay">
      <div v-if="open" class="sidebar-overlay" @click.self="emit('close')">
        <Transition name="sidebar-panel" appear>
          <div v-if="open" class="sidebar-panel scrollbar-hide">

            <!-- Header -->
            <div class="sp-header">
              <div class="sp-title-row">
                <div class="sp-avatar">
                  <User :size="20" />
                </div>
                <div class="sp-title-text">
                  <span class="sp-name">{{ player.name || '无名者' }}</span>
                  <span class="sp-sub">编号未知 · 第 {{ game.day }} 天</span>
                </div>
              </div>
              <button class="sp-close-btn" @click="emit('close')" aria-label="关闭">
                <X :size="18" />
              </button>
            </div>

            <!-- Vitals -->
            <div class="sp-section">
              <div class="sp-sec-label">生存状态</div>
              <div class="sp-vitals">

                <div class="sp-vital-card hp">
                  <Heart :size="13" class="svc-ico" />
                  <div class="svc-content">
                    <span class="svc-label">生命值</span>
                    <div class="svc-bar-wrap">
                      <div class="svc-bar-track">
                        <div class="svc-fill fill-hp" :style="{ width: hpPct + '%' }">
                          <span class="svc-shine"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="svc-val">
                    {{ player.stats.hp }}<em>/{{ player.stats.maxHp }}</em>
                  </span>
                </div>

                <div class="sp-vital-card san">
                  <Brain :size="13" class="svc-ico" />
                  <div class="svc-content">
                    <span class="svc-label">理智值</span>
                    <div class="svc-bar-wrap">
                      <div class="svc-bar-track">
                        <div class="svc-fill fill-san" :style="{ width: sanPct + '%' }">
                          <span class="svc-shine"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="svc-val">
                    {{ player.stats.sanity }}<em>/{{ player.stats.maxSanity }}</em>
                  </span>
                </div>

              </div>
            </div>

            <!-- Attributes -->
            <div class="sp-section">
              <div class="sp-sec-label">能力属性 (上限 100)</div>
              <div class="sp-attrs">
                <div v-for="s in statsConfig" :key="s.id" class="sp-attr-row-new">
                  <div class="san-header">
                    <div class="san-label-group">
                      <component :is="s.icon" :size="12" class="san-ico" />
                      <span class="san-name">{{ s.label }}</span>
                    </div>
                    <span class="san-val">{{ player.stats[s.id] }}</span>
                  </div>
                  <div class="san-bar-track">
                    <div class="san-bar-fill" :style="{ width: player.stats[s.id] + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resources -->
            <div class="sp-section">
              <div class="sp-sec-label">持有资源</div>
              <div class="sp-res-row">
                <DollarSign :size="13" class="sr-ico" />
                <span class="sr-name">积分</span>
                <span class="sr-val">{{ game.money }}</span>
              </div>
              <div class="sp-res-row mt-8">
                <Zap :size="13" class="sr-ico-zap" />
                <span class="sr-name">设施电力</span>
                <span class="sr-val-zap">{{ game.energy }}%</span>
              </div>
              <div v-if="player.equippedWeapon" class="sp-res-row mt-8">
                <Shield :size="13" class="sr-ico" style="color: var(--accent-bright)" />
                <span class="sr-name" style="color: var(--accent-bright)">当前装备</span>
                <span class="sr-val" style="color: var(--accent-bright); font-size: 0.75rem;">
                  {{ getWeaponName(player.equippedWeapon) }}
                </span>
              </div>
            </div>

            <!-- NPCs -->
            <div v-if="metNPCs.length" class="sp-section">
              <div class="sp-sec-label">已知幸存者</div>
              <div class="sp-npc-list">
                <div v-for="npc in metNPCs" :key="npc.id" class="sp-npc-card">
                  <div class="snc-header">
                    <span class="snc-name">{{ npc.name }}</span>
                    <span class="snc-origin">{{ npc.originLabel }}</span>
                  </div>
                  <div class="snc-bars">
                    <div class="snc-bar fav">
                      <div class="sncb-fill" :style="{ width: ((npc.favorability + 100) / 2) + '%' }"></div>
                    </div>
                    <div class="snc-bar trust">
                      <div class="sncb-fill" :style="{ width: npc.trust + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Game Phase Info -->
            <div class="sp-section">
              <div class="sp-sec-label">当前状态</div>
              <div class="sp-info-grid">
                <div class="sp-info-cell">
                  <span class="sic-label">天数</span>
                  <span class="sic-val">{{ game.day }}</span>
                </div>
                <div class="sp-info-cell">
                  <span class="sic-label">时间</span>
                  <span class="sic-val">{{ formattedTime }}</span>
                </div>
                <div class="sp-info-cell">
                  <span class="sic-label">天气</span>
                  <span class="sic-val">{{ weatherName }}</span>
                </div>
                <div class="sp-info-cell">
                  <span class="sic-label">阶段</span>
                  <span :class="['sic-val', game.isRestDay ? 'c-rest' : 'c-game']">
                    {{ game.isRestDay ? '休息日' : '游戏日' }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Heart, Brain, Shield, BookOpen, Zap, DollarSign, User, X, Users } from 'lucide-vue-next'
import type { PlayerStats, GameState } from '../stores/game'
import type { NPC } from '../stores/npcs'

const props = defineProps<{
  open: boolean
  player: { name: string; gender: string; stats: PlayerStats }
  game: GameState
  npcs: Record<string, NPC>
}>()

const emit = defineEmits<{
  close: []
}>()

const hpPct  = computed(() => (props.player.stats.hp      / props.player.stats.maxHp)     * 100)
const sanPct = computed(() => (props.player.stats.sanity  / props.player.stats.maxSanity) * 100)

const formattedTime = computed(() => {
  const h = Math.floor(props.game.time).toString().padStart(2, '0')
  const m = Math.floor((props.game.time % 1) * 60).toString().padStart(2, '0')
  return `${h}:${m}`
})

const weatherName = computed(() => {
  const map: Record<string, string> = {
    sunny: '晴朗', rainy: '大雨', foggy: '浓雾', blood_mist: '血雾',
  }
  return map[props.game.weather] ?? '未知'
})

const metNPCs = computed(() => {
  return Object.values(props.npcs).filter(n => n.met)
})

const getWeaponName = (id: string) => {
  if (id === 'iron_pipe') return '生锈的铁管';
  return id;
}

const statsConfig = [
  { id: 'strength' as keyof PlayerStats, label: '力量', icon: Shield },
  { id: 'intelligence' as keyof PlayerStats, label: '智力', icon: BookOpen },
  { id: 'dexterity' as keyof PlayerStats, label: '敏捷', icon: Zap },
]
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────────── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 11, 0.65);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* ── Panel ───────────────────────────────────────── */
.sidebar-panel {
  width: min(300px, 88vw);
  height: 100%;
  background-color: var(--bg-secondary);
  border-left: 1px solid var(--border-bright);
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.6);
}

/* ── Header ─────────────────────────────────────── */
.sp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  flex-shrink: 0;
}

.sp-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sp-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-bright);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.sp-name {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.sp-sub {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  margin-top: 1px;
}

.sp-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border-radius: var(--radius-md);
  transition: all 0.15s;
}

.sp-close-btn:active {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

/* ── Sections ────────────────────────────────────── */
.sp-section {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
}

.sp-sec-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

/* ── Vitals ─────────────────────────────────────── */
.sp-vitals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sp-vital-card {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
}

.svc-ico { flex-shrink: 0; }
.hp .svc-ico  { color: var(--accent-red);   }
.san .svc-ico { color: var(--accent-bright); }

.svc-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.svc-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1;
}

.svc-bar-track {
  height: 4px;
  background-color: var(--bg-elevated);
  border-radius: 99px;
  overflow: hidden;
}

.svc-fill {
  height: 100%;
  border-radius: 99px;
  position: relative;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fill-hp  { background-color: var(--accent-red);    }
.fill-san { background-color: var(--accent-primary); }

.svc-shine {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 99px 99px 0 0;
}

.svc-val {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 54px;
  text-align: right;
}

.svc-val em {
  font-style: normal;
  color: var(--text-muted);
  font-size: 0.62rem;
}

/* ── Attributes New Style ───────────────────────── */
.sp-attr-row-new {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.san-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.san-label-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.san-ico { color: var(--text-muted); }
.san-name { font-size: 0.78rem; color: var(--text-secondary); }
.san-val { font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-bright); font-weight: 600; }

.san-bar-track {
  height: 3px;
  background-color: var(--bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.san-bar-fill {
  height: 100%;
  background-color: var(--accent-primary);
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Resources ──────────────────────────────────── */
.sp-res-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
}

.sr-ico  { color: var(--accent-amber); flex-shrink: 0; }
.sr-ico-zap { color: var(--accent-bright); flex-shrink: 0; }
.sr-name { font-size: 0.78rem; color: var(--text-secondary); flex: 1; }
.sr-val  { font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: var(--accent-amber); }
.sr-val-zap { font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: var(--accent-bright); }

.mt-8 { margin-top: 8px; }

/* ── NPC List ───────────────────────────────────── */
.sp-npc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sp-npc-card {
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.snc-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.snc-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.snc-origin {
  font-size: 0.6rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.snc-bars {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.snc-bar {
  height: 2px;
  background-color: var(--bg-tertiary);
  border-radius: 1px;
  overflow: hidden;
}

.snc-bar.fav .sncb-fill { background-color: var(--accent-primary); }
.snc-bar.trust .sncb-fill { background-color: var(--accent-green); }

.sncb-fill {
  height: 100%;
  transition: width 0.4s ease;
}

/* ── Info Grid ──────────────────────────────────── */
.sp-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.sp-info-cell {
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sic-label {
  font-size: 0.6rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
}

.sic-val {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.c-rest { color: var(--accent-green); }
.c-game { color: var(--accent-red);   }

/* ── Transitions ────────────────────────────────── */
.sidebar-overlay-enter-active,
.sidebar-overlay-leave-active {
  transition: opacity 0.22s ease;
}
.sidebar-overlay-enter-from,
.sidebar-overlay-leave-to {
  opacity: 0;
}

.sidebar-panel-enter-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.sidebar-panel-leave-active {
  transition: transform 0.22s ease-in;
}
.sidebar-panel-enter-from,
.sidebar-panel-leave-to {
  transform: translateX(100%);
}
</style>

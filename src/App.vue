<template>
  <div class="game-root">

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  HEADER                                                  -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <header class="g-header">

      <!-- Day / Phase -->
      <div class="hdr-day">
        <span class="hdr-day-num">D{{ game.day }}</span>
        <span :class="['hdr-phase', game.isRestDay ? 'phase-rest' : 'phase-game']">
          {{ game.isRestDay ? '休息日' : '游戏日' }}
        </span>
      </div>

      <!-- HP + Sanity  (numbers only, parallel) -->
      <div class="hdr-vitals">
        <div class="hdr-vital-pair">
          <Heart :size="13" class="vital-ico ico-hp" />
          <span class="vital-number">{{ player.stats.hp }}</span>
        </div>
        <span class="hdr-vital-sep">·</span>
        <div class="hdr-vital-pair">
          <Brain :size="13" class="vital-ico ico-san" />
          <span class="vital-number">{{ player.stats.sanity }}</span>
        </div>
      </div>

      <!-- Clock + weather -->
      <div class="hdr-right">
        <span class="hdr-time">{{ formattedTime }}</span>
        <component :is="weatherIcon" :size="13" class="hdr-wico" />
      </div>

    </header>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  MAIN CONTENT                                            -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <main class="g-main">

      <!-- ─────── 剧情 TAB ─────────────────────────────────── -->
      <div :class="['tab-pane', { active: tab === 'story' }]">

        <!-- Mini Map Strip -->
        <div class="map-strip">
          <MapCanvas :nodes="mapNodes" :compact="true" />
          <!-- Strip overlay: location label -->
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

        <!-- Story Log — entries + action choices all in one stream -->
        <div class="story-scroll scrollbar-hide" ref="logEl">
          <div class="story-inner">

            <!-- Day header -->
            <div class="log-day-header">
              <span class="ldh-line"></span>
              <span class="ldh-text">第{{ game.day }}天 {{ weatherName }}</span>
              <span class="ldh-line"></span>
            </div>

            <template v-for="entry in logs" :key="entry.id">

              <!-- ── 叙事条目 ── -->
              <div
                v-if="entry.type !== 'actions'"
                :class="['log-entry', `le-${entry.type}`]"
              >
                <span class="le-ts">{{ formatLogTime(entry.time) }}</span>
                <p class="le-body">{{ entry.text }}</p>
              </div>

              <!-- ── 行动条目：已选择 → 显示回执；未选择 → 显示按钮 ── -->
              <div v-else class="log-actions-entry">

                <!-- 已解决：显示选择记录 -->
                <div v-if="entry.resolvedId" class="la-resolved">
                  <span class="lar-arrow">›</span>
                  <span class="lar-label">{{ entry.resolvedLabel }}</span>
                  <span class="lar-cost">
                    {{ entry.choices.find(c => c.id === entry.resolvedId)?.timeCost }}h
                  </span>
                </div>

                <!-- 未解决：显示可点击按钮 -->
                <template v-else>
                  <div class="ia-divider">
                    <span class="ia-div-line"></span>
                    <span class="ia-div-label">可选行动</span>
                    <span class="ia-div-line"></span>
                  </div>
                  <div class="ia-grid">
                    <button
                      v-for="choice in entry.choices"
                      :key="choice.id"
                      :class="['ia-btn', `ia-${choice.variant}`]"
                      @click="executeAction(entry, choice)"
                    >
                      <div class="ia-ico">
                        <component :is="ACTION_ICONS[choice.id]" :size="15" />
                      </div>
                      <div class="ia-text">
                        <span class="ia-label">{{ choice.label }}</span>
                        <span class="ia-cost">{{ choice.timeCost }}h</span>
                      </div>
                    </button>
                  </div>
                </template>

              </div>

            </template>

          </div>
        </div>

      </div>

      <!-- ─────── 背包 TAB ─────────────────────────────────── -->
      <div :class="['tab-pane', { active: tab === 'inventory' }]">
        <div class="inv-pane">

          <div class="inv-toolbar">
            <span class="inv-title">随身物品</span>
            <div class="inv-cap">
              <Package :size="12" />
              <span>{{ inventory.length }} / 18</span>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!inventory.length" class="inv-empty">
            <Package :size="32" class="inv-empty-ico" />
            <p class="inv-empty-text">暂无物品</p>
            <p class="inv-empty-sub">探索区域以获取道具和线索</p>
          </div>

          <!-- Item list -->
          <div v-else class="inv-list scrollbar-hide">
            <div
              v-for="item in inventory"
              :key="item.id"
              class="inv-item"
              @click="selectedItem = item"
            >
              <div class="ii-icon-wrap">
                <Package :size="18" />
              </div>
              <div class="ii-info">
                <span class="ii-name">{{ item.name }}</span>
                <span class="ii-desc">{{ item.description }}</span>
              </div>
              <div class="ii-right">
                <span v-if="item.quantity > 1" class="ii-qty">×{{ item.quantity }}</span>
                <ChevronRight :size="14" class="ii-arrow" />
              </div>
            </div>
          </div>

          <!-- Item detail panel -->
          <div v-if="selectedItem" class="inv-detail">
            <div class="idet-header">
              <span class="idet-name">{{ selectedItem.name }}</span>
              <button class="idet-close" @click="selectedItem = null">
                <X :size="14" />
              </button>
            </div>
            <p class="idet-desc">{{ selectedItem.description }}</p>
          </div>
          <div v-else class="inv-detail inv-detail-empty">
            <span>选择物品查看详情</span>
          </div>

        </div>
      </div>

    </main>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  BOTTOM NAVIGATION                                       -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <nav class="g-nav">
      <button
        v-for="t in navItems"
        :key="t.id"
        :class="['g-nav-btn', { active: t.sidebar ? sidebarOpen : tab === t.id }]"
        @click="handleNavClick(t)"
      >
        <component :is="t.icon" :size="21" />
        <span>{{ t.label }}</span>
        <span v-if="t.sidebar ? sidebarOpen : tab === t.id" class="nav-pip"></span>
      </button>
    </nav>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  STATUS SIDEBAR                                          -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <StatusSidebar
      :open="sidebarOpen"
      :player="player"
      :game="game"
      @close="sidebarOpen = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Heart, Brain, Navigation, Moon, MessageSquare,
  Skull, Package, BookOpen, Sun, CloudRain, Wind,
  MapPin, User, Users, ChevronRight, X,
  type Component,
} from 'lucide-vue-next'
import { useGameStore }            from './stores/game'
import type { InventoryItem, ActionsEntry, ActionChoice } from './stores/game'
import MapCanvas     from './components/MapCanvas.vue'
import StatusSidebar from './components/StatusSidebar.vue'

const gameStore = useGameStore()
const { player, game, logs, inventory, mapNodes } = storeToRefs(gameStore)

type TabId = 'story' | 'inventory'
const tab          = ref<TabId>('story')
const logEl        = ref<HTMLElement | null>(null)
const sidebarOpen  = ref(false)
const selectedItem = ref<InventoryItem | null>(null)

const navItems = [
  { id: 'story',     label: '剧情', icon: BookOpen, sidebar: false },
  { id: 'inventory', label: '背包', icon: Package,  sidebar: false },
  { id: 'status',    label: '状态', icon: Users,    sidebar: true  },
]

const handleNavClick = (item: typeof navItems[0]) => {
  if (item.sidebar) {
    sidebarOpen.value = true
  } else {
    tab.value = item.id as TabId
  }
}

// ── 行动图标映射 ────────────────────────────────────────────────

const ACTION_ICONS: Record<string, Component> = {
  explore:     Navigation,
  rest:        Moon,
  shout:       MessageSquare,
  investigate: Skull,
}

// 本局可用行动定义
const BASE_ACTIONS: ActionChoice[] = [
  { id: 'explore',     label: '探索四周', timeCost: 0.50, variant: 'default' },
  { id: 'rest',        label: '稍作休息', timeCost: 1.00, variant: 'default' },
  { id: 'shout',       label: '尝试呼喊', timeCost: 0.25, variant: 'accent'  },
  { id: 'investigate', label: '调查尸体', timeCost: 0.75, variant: 'danger'  },
]

// ── Computed ───────────────────────────────────────────────────

const formattedTime = computed(() => {
  const h = Math.floor(game.value.time).toString().padStart(2, '0')
  const m = Math.floor((game.value.time % 1) * 60).toString().padStart(2, '0')
  return `${h}:${m}`
})

const weatherName = computed(() => {
  const map: Record<string, string> = {
    sunny: '晴朗', rainy: '大雨', foggy: '浓雾', blood_mist: '血雾',
  }
  return map[game.value.weather] ?? '未知'
})

const weatherIcon = computed(() => {
  if (game.value.weather === 'rainy')  return CloudRain
  if (game.value.weather === 'foggy')  return Wind
  return Sun
})

const locationName = computed(() => {
  const m: Record<string, string> = {
    cell_01: '牢房 01', corridor_a: '走廊', cell_02: '牢房 02', hall_main: '主厅',
  }
  return m[game.value.location] ?? game.value.location
})

// ── Helpers ────────────────────────────────────────────────────

const formatLogTime = (ts: number) => {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const scrollToBottom = async () => {
  await nextTick()
  if (logEl.value) {
    logEl.value.scrollTo({ top: logEl.value.scrollHeight, behavior: 'smooth' })
  }
}

watch(() => logs.value.length, scrollToBottom)

// ── 行动执行 ────────────────────────────────────────────────────

const executeAction = (entry: ActionsEntry, choice: ActionChoice) => {
  // 1. 标记当前行动条目为"已选择"
  gameStore.resolveAction(entry.id, choice.id, choice.label)

  // 2. 消耗时间
  gameStore.consumeTime(choice.timeCost)

  // 3. 执行对应逻辑，产生叙事日志
  switch (choice.id) {
    case 'explore':
      gameStore.addLog(
        '你环顾四周，这间牢房虽然昏暗，但你还是发现了一些奇怪的抓痕。某人曾在这里竭力留下什么。',
        'story',
      )
      break
    case 'rest':
      gameStore.addLog(
        '你闭上眼睛，试图平复心情。混乱的思绪慢慢平静下来，理智稍微恢复了一些。',
        'info',
      )
      if (player.value.stats.sanity < player.value.stats.maxSanity) {
        player.value.stats.sanity = Math.min(
          player.value.stats.maxSanity,
          player.value.stats.sanity + 5,
        )
      }
      break
    case 'shout':
      gameStore.addLog(
        '你大声呼喊，声音在空旷的走廊里来回回响。沉默是唯一的答复，只有远处隐约的滴水声。',
        'warning',
      )
      break
    case 'investigate':
      gameStore.addLog(
        '你靠近角落里那团黑暗……那是一具已经腐烂的尸体，口袋里似乎还塞着什么皱巴巴的东西。',
        'story',
      )
      break
  }

  // 4. 追加新的行动条目（出现在叙事日志下方）
  gameStore.addActions(BASE_ACTIONS)
}

onMounted(() => {
  gameStore.addLog(
    '你在头痛欲裂中醒来，空气里弥漫着消毒水与铁锈的气味。你不知道自己在哪里，也不知道已经过了多久。',
    'story',
  )
  // 首次行动列表出现在初始叙事下方
  gameStore.addActions(BASE_ACTIONS)
  scrollToBottom()
})
</script>

<style scoped>
/* ════════════════════════════════════════════════ */
/*  ROOT                                            */
/* ════════════════════════════════════════════════ */

.game-root {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  font-family: var(--font-ui);
  /* Dot-grid atmosphere */
  background-image: radial-gradient(circle, rgba(44,110,168,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* ════════════════════════════════════════════════ */
/*  HEADER                                          */
/* ════════════════════════════════════════════════ */

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

/* Day block */
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

/* Vitals: numbers only, parallel */
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
.ico-hp    { color: var(--accent-red);    }
.ico-san   { color: var(--accent-bright); }

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

/* Clock + status */
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

/* ════════════════════════════════════════════════ */
/*  MAIN + TAB PANES                                */
/* ════════════════════════════════════════════════ */

.g-main {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.tab-pane {
  display: none;
  position: absolute;
  inset: 0;
  flex-direction: column;
}

.tab-pane.active { display: flex; }

/* ════════════════════════════════════════════════ */
/*  STORY TAB                                       */
/* ════════════════════════════════════════════════ */

/* ── Mini Map Strip ────────────────────────────── */

.map-strip {
  flex-shrink: 0;
  height: 130px;
  position: relative;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  overflow: hidden;
}

.map-strip-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background: linear-gradient(to top, rgba(7,12,16,0.85) 0%, transparent 100%);
  pointer-events: none;
}

.mso-loc,
.mso-right {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: rgba(196, 204, 212, 0.7);
}

/* ── Story Log ─────────────────────────────────── */

.story-scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
}

.story-inner {
  padding: 14px 16px 24px;
  display: flex;
  flex-direction: column;
}

/* Day header in log */
.log-day-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.ldh-line {
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.ldh-text {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Log entries */
.log-entry {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 0 10px 14px;
  border-left: 2px solid transparent;
  animation: entryIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.log-entry + .log-entry {
  border-top: 1px solid rgba(24, 35, 48, 0.6);
}

@keyframes entryIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}

.le-story  { border-left-color: var(--accent-primary); }
.le-info   { border-left-color: transparent; padding-left: 16px; }
.le-warning{ border-left-color: var(--accent-amber); }

.le-ts {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.le-body {
  font-family: var(--font-narrative);
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-primary);
}

.le-info .le-body {
  font-family: var(--font-ui);
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.le-warning .le-body {
  font-family: var(--font-ui);
  color: var(--accent-amber);
  font-size: 0.88rem;
}

/* ── 行动日志条目 ──────────────────────────────── */

.log-actions-entry {
  padding: 14px 0 6px;
}

/* 已选择回执 */
.la-resolved {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background-color: rgba(44, 110, 168, 0.07);
  border: 1px solid rgba(44, 110, 168, 0.18);
  border-radius: var(--radius-md);
  animation: entryIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.lar-arrow {
  font-size: 1rem;
  color: var(--accent-primary);
  line-height: 1;
  flex-shrink: 0;
}

.lar-label {
  flex: 1;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent-bright);
}

.lar-cost {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
}

/* 未选择：分割线 + 按钮网格 */

.ia-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.ia-div-line {
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.ia-div-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
}

.ia-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.ia-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 12px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 0.14s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  text-align: left;
}

.ia-btn:active {
  transform: scale(0.97) translateY(1px);
  background-color: var(--bg-elevated);
}

.ia-ico {
  color: var(--text-muted);
  flex-shrink: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ia-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.ia-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.2;
}

.ia-cost {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
}

.ia-accent {
  border-color: rgba(44,110,168,0.3);
  background-color: rgba(44,110,168,0.06);
}
.ia-accent .ia-ico  { color: var(--accent-primary); }
.ia-accent .ia-label{ color: var(--accent-bright);  }

.ia-danger {
  border-color: rgba(184,50,40,0.3);
  background-color: rgba(184,50,40,0.05);
}
.ia-danger .ia-ico  { color: var(--accent-red); }
.ia-danger .ia-label{ color: var(--accent-red); }

/* ════════════════════════════════════════════════ */
/*  INVENTORY TAB                                   */
/* ════════════════════════════════════════════════ */

.inv-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 14px;
  gap: 12px;
  min-height: 0;
}

.inv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.inv-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
}

.inv-cap {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 3px 9px;
  border-radius: 99px;
}

/* Empty state */
.inv-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-muted);
}

.inv-empty-ico    { opacity: 0.25; }
.inv-empty-text   { font-size: 0.88rem; font-weight: 600; color: var(--text-secondary); }
.inv-empty-sub    { font-size: 0.75rem; }

/* Item list */
.inv-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
}

.inv-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.12s;
}

.inv-item:active { background-color: rgba(44,110,168,0.05); }

.ii-icon-wrap {
  width: 38px;
  height: 38px;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.ii-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ii-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.ii-desc { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ii-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.ii-qty {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  border-radius: 4px;
}

.ii-arrow { color: var(--text-muted); }

/* Detail panel */
.inv-detail {
  flex-shrink: 0;
  min-height: 70px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 12px 14px;
}

.inv-detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.idet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.idet-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
}

.idet-close {
  color: var(--text-muted);
  padding: 2px;
  border-radius: var(--radius-sm);
}

.idet-close:active { color: var(--text-primary); }

.idet-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ════════════════════════════════════════════════ */
/*  BOTTOM NAVIGATION                               */
/* ════════════════════════════════════════════════ */

.g-nav {
  flex-shrink: 0;
  height: 56px;
  display: flex;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left:  env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.g-nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--text-muted);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: var(--font-ui);
  transition: color 0.18s ease;
  position: relative;
}

.g-nav-btn.active { color: var(--accent-bright); }

.nav-pip {
  position: absolute;
  top: 0;
  left: 28%;
  right: 28%;
  height: 2px;
  background-color: var(--accent-primary);
  border-radius: 0 0 3px 3px;
  animation: pipIn 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes pipIn {
  from { transform: scaleX(0.3); opacity: 0; }
  to   { transform: scaleX(1);   opacity: 1; }
}
</style>

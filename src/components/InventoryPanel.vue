<template>
  <div :class="['tab-pane', { active }]">
    <div class="inv-pane">
      <div class="inv-toolbar">
        <span class="inv-title">随身物品</span>
        <div class="inv-cap">
          <Package :size="12" />
          <span>{{ inventory.length }} / 18</span>
        </div>
      </div>

      <div v-if="!inventory.length" class="inv-empty">
        <Package :size="32" class="inv-empty-ico" />
        <p class="inv-empty-text">暂无物品</p>
        <p class="inv-empty-sub">探索区域以获取道具和线索</p>
      </div>

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

      <div v-if="selectedItem" class="inv-detail">
        <div class="idet-header">
          <span class="idet-name">{{ selectedItem.name }}</span>
          <button class="idet-close" @click="selectedItem = null">
            <X :size="14" />
          </button>
        </div>
        <p class="idet-desc">{{ selectedItem.description }}</p>
        <div class="idet-footer">
          <button 
            v-if="selectedItem.category === 'consumable'"
            class="use-btn"
            @click="handleUse"
          >
            使用物品
          </button>
        </div>
      </div>
      <div v-else class="inv-detail inv-detail-empty">
        <span>选择物品查看详情</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ChevronRight, Package, X } from 'lucide-vue-next'
import type { InventoryItem } from '../stores/game'

const props = defineProps<{
  active: boolean
  inventory: InventoryItem[]
}>()

const emit = defineEmits<{
  useItem: [id: string]
}>()

const selectedItem = ref<InventoryItem | null>(null)

const handleUse = () => {
  if (selectedItem.value) {
    emit('useItem', selectedItem.value.id)
    selectedItem.value = null
  }
}

watch(
  () => props.inventory,
  (items) => {
    if (selectedItem.value && !items.some((item) => item.id === selectedItem.value?.id)) {
      selectedItem.value = null
    }
  },
  { deep: true },
)
</script>

<style scoped>
.tab-pane {
  display: none;
  position: absolute;
  inset: 0;
  flex-direction: column;
}

.tab-pane.active { display: flex; }

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

.inv-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-muted);
}

.inv-empty-ico { opacity: 0.25; }
.inv-empty-text { font-size: 0.88rem; font-weight: 600; color: var(--text-secondary); }
.inv-empty-sub { font-size: 0.75rem; }

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
.ii-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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

.inv-detail {
  flex-shrink: 0;
  min-height: 100px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  margin-bottom: 2px;
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
  flex: 1;
}

.idet-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

.use-btn {
  background-color: var(--accent-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: var(--radius-md);
  transition: all 0.15s;
}

.use-btn:active {
  transform: scale(0.95);
  background-color: var(--accent-bright);
}
</style>

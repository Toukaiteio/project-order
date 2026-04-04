<template>
  <nav class="g-nav">
    <button
      v-for="item in navItems"
      :key="item.id"
      :class="['g-nav-btn', { active: item.sidebar ? sidebarOpen : tab === item.id }]"
      @click="emit('select', item)"
    >
      <component :is="item.icon" :size="21" />
      <span>{{ item.label }}</span>
      <span v-if="item.sidebar ? sidebarOpen : tab === item.id" class="nav-pip"></span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem, TabId } from '../constants/gameUi'

defineProps<{
  navItems: NavItem[]
  sidebarOpen: boolean
  tab: TabId
}>()

const emit = defineEmits<{
  select: [item: NavItem]
}>()
</script>

<style scoped>
.g-nav {
  flex-shrink: 0;
  height: 56px;
  display: flex;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
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
  to { transform: scaleX(1); opacity: 1; }
}
</style>

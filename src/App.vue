<template>
  <div :class="[
    'game-root',
    { 'is-low-power': game.energy < 30 },
    { 'is-insane': player.stats.sanity < 40 },
    { 'is-critical-sanity': player.stats.sanity < 15 }
  ]">
    <!-- 加载屏幕 -->
    <LoadingScreen v-if="mode === 'loading'" @ready="onLoadingComplete" />

    <!-- 主菜单 -->
    <StartMenu v-else-if="mode === 'menu'" @action="handleMenuAction" />

    <!-- 角色创建 -->
    <CharacterCreation v-else-if="mode === 'creation'" @complete="onCreationComplete" />

    <!-- 游戏主体 -->
    <template v-else-if="mode === 'playing'">
      <GameShellHeader
        :game="game"
        :player="player"
        :formatted-time="formattedTime"
        :weather-icon="weatherIcon"
      />

      <main class="g-main">
        <StoryPanel
          :active="tab === 'story'"
          :day="game.day"
          :location-name="locationName"
          :logs="logs"
          :map-nodes="mapNodes"
          :weather-icon="weatherIcon"
          :weather-name="weatherName"
          :combat="combat"
          @execute-action="executeAction"
        />

        <InventoryPanel
          :active="tab === 'inventory'"
          :inventory="inventory"
          @use-item="useItem"
        />
      </main>

      <GameBottomNav
        :nav-items="navItems"
        :sidebar-open="sidebarOpen"
        :tab="tab"
        @select="handleNavClick"
      />

      <StatusSidebar
        :open="sidebarOpen"
        :player="player"
        :game="game"
        :npcs="npcStore.npcs"
        @close="sidebarOpen = false"
      />

      <GameDialogHost :dialog-store="dialogStore" />
    </template>
  </div>
</template>

<script setup lang="ts">
import StartMenu from './views/StartMenu.vue'
import CharacterCreation from './views/CharacterCreation.vue'
import LoadingScreen from './views/LoadingScreen.vue'
import GameBottomNav from './components/GameBottomNav.vue'
import GameDialogHost from './components/GameDialogHost.vue'
import GameShellHeader from './components/GameShellHeader.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import StatusSidebar from './components/StatusSidebar.vue'
import StoryPanel from './components/StoryPanel.vue'
import { useGameShell } from './composables/useGameShell'

const {
  mode,
  dialogStore,
  npcStore,
  executeAction,
  handleMenuAction,
  onLoadingComplete,
  formattedTime,
  game,
  combat,
  handleNavClick,
  inventory,
  locationName,
  logs,
  mapNodes,
  navItems,
  onCreationComplete,
  player,
  sidebarOpen,
  tab,
  weatherIcon,
  weatherName,
  useItem,
} = useGameShell()
</script>

<style scoped>
.game-root {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  font-family: var(--font-ui);
  background-image: radial-gradient(circle, rgba(44,110,168,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.g-main {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}
</style>

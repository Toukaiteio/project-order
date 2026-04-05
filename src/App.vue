<template>
  <div class="game-root">
    <CharacterCreation v-if="!game.started" @complete="onCreationComplete" />

    <template v-else>
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
import CharacterCreation from './views/CharacterCreation.vue'
import GameBottomNav from './components/GameBottomNav.vue'
import GameDialogHost from './components/GameDialogHost.vue'
import GameShellHeader from './components/GameShellHeader.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import StatusSidebar from './components/StatusSidebar.vue'
import StoryPanel from './components/StoryPanel.vue'
import { useGameShell } from './composables/useGameShell'

const {
  dialogStore,
  npcStore,
  executeAction,
  formattedTime,
  game,
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

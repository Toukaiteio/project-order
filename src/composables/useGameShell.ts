import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDialogStore } from '../stores/dialog'
import { useNPCStore } from '../stores/npcs'
import {
  type ActionChoice,
  type ActionsEntry,
  type InventoryItem,
  useGameStore,
} from '../stores/game'
import { usePlot } from './usePlot'
import {
  formatClockTime,
  LOCATION_NAMES,
  NAV_ITEMS,
  resolveWeatherIcon,
  WEATHER_NAMES,
} from '../constants/gameUi'
import type { TabId } from '../constants/gameUi'

export type GameMode = 'menu' | 'creation' | 'playing'

export function useGameShell() {
  const gameStore = useGameStore()
  const dialogStore = useDialogStore()
  const npcStore = useNPCStore()
  const { player, game, logs, inventory, mapNodes, combat } = storeToRefs(gameStore)
  const { triggerScene, handleAction, checkSceneExists } = usePlot()

  const mode = ref<GameMode>('menu')
  const tab = ref<TabId>('story')
  const sidebarOpen = ref(false)
  const selectedItem = ref<InventoryItem | null>(null)

  const formattedTime = computed(() => formatClockTime(game.value.time))
  const weatherName = computed(() => WEATHER_NAMES[game.value.weather] ?? '未知')
  const weatherIcon = computed(() => resolveWeatherIcon(game.value.weather))
  const locationName = computed(() => LOCATION_NAMES[game.value.location] ?? game.value.location)

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.sidebar) {
      sidebarOpen.value = true
      return
    }
    tab.value = item.id as TabId
  }

  const executeAction = (entry: ActionsEntry, choice: ActionChoice) => {
    gameStore.resolveAction(entry.id, choice.id, choice.label)
    gameStore.consumeTime(choice.timeCost)

    if (choice.id.startsWith('move_')) {
      const targetId = choice.id.replace('move_', '')
      gameStore.moveTo(targetId)

      // --- 1. 确定性剧情触发 (任务目标/交付) ---
      
      // Satoshi 任务: 寻找零件
      if (targetId === 'garbage_chute' && gameStore.flags.satoshi_quest_active && !gameStore.flags.has_satoshi_part) {
        triggerScene('quest_satoshi_find_part'); return
      }
      // Satoshi 任务: 交付零件
      if (targetId === 'cell_02' && gameStore.flags.has_satoshi_part && !gameStore.flags.satoshi_allied) {
        triggerScene('quest_satoshi_complete'); return
      }

      // --- 2. 概率性剧情触发 (偶遇/幻觉/支线开启) ---
      
      // 动态偶遇 NPC
      const npcsAtLocation = Object.values(npcStore.npcs).filter(
        n => n.location === targetId && n.state === 'Alive'
      )
      if (npcsAtLocation.length > 0 && Math.random() < 0.4) {
        const npc = npcsAtLocation[Math.floor(Math.random() * npcsAtLocation.length)]
        const sceneId = `encounter_${npc.id}_${targetId}`
        if (checkSceneExists(sceneId)) {
          triggerScene(sceneId); gameStore.saveGame(); return
        }
      }

      // 幻觉触发 (低理智)
      if (player.value.stats.sanity < 40 && Math.random() < 0.2) {
        const halls = ['encounter_hallucination_ghost_girl', 'encounter_hallucination_shadow_vendor'].filter(id => checkSceneExists(id))
        if (halls.length > 0) {
          triggerScene(halls[Math.floor(Math.random() * halls.length)]); return
        }
      }

      // 随机开启新支线
      if (Math.random() < 0.3) {
        if (targetId === 'cell_02' && !gameStore.flags.satoshi_quest_active) {
          triggerScene('quest_satoshi_start'); return
        }
        if (targetId === 'med_bay' && gameStore.game.day > 11 && !gameStore.flags.aris_quest_done) {
          triggerScene('quest_aris_plea'); gameStore.flags.aris_quest_done = true; return
        }
      }

      // --- 3. 默认探索场景 ---
      triggerScene(`explore_${targetId}`)
      gameStore.saveGame()
      return
    }

    handleAction(choice.id)
    gameStore.saveGame()
  }

  const handleCombatAction = (type: 'atk' | 'def') => {
    gameStore.processCombatTurn(type)
    gameStore.saveGame()
  }

  const handleMenuAction = (type: 'new' | 'continue' | 'settings') => {
    if (type === 'new') mode.value = 'creation'
    else if (type === 'continue') {
      if (gameStore.loadGame()) mode.value = 'playing'
    }
  }

  const onCreationComplete = (data: any) => {
    gameStore.startGame(data)
    mode.value = 'playing'
    triggerScene('awake')
  }

  return {
    mode,
    dialogStore,
    npcStore,
    game,
    combat,
    handleNavClick,
    handleMenuAction,
    handleCombatAction,
    inventory,
    locationName,
    logs,
    mapNodes,
    navItems: NAV_ITEMS,
    onCreationComplete,
    player,
    selectedItem,
    sidebarOpen,
    tab,
    weatherIcon,
    weatherName,
    formattedTime,
    executeAction,
    useItem: (id: string) => gameStore.useItem(id),
  }
}

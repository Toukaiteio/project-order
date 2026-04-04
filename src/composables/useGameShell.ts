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

export function useGameShell() {
  const gameStore = useGameStore()
  const dialogStore = useDialogStore()
  const npcStore = useNPCStore()
  const { player, game, logs, inventory, mapNodes } = storeToRefs(gameStore)
  const { triggerScene, handleAction, checkSceneExists } = usePlot()

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

      // 动态偶遇逻辑：检查当前区域有哪些 NPC
      const npcsAtLocation = Object.values(npcStore.npcs).filter(
        n => n.location === targetId && n.state === 'Alive'
      )

      // 40% 几率触发偶遇
      if (npcsAtLocation.length > 0 && Math.random() < 0.4) {
        const npc = npcsAtLocation[Math.floor(Math.random() * npcsAtLocation.length)]
        const sceneId = `encounter_${npc.id}_${targetId}`

        if (checkSceneExists(sceneId)) {
          triggerScene(sceneId)
        } else {
          triggerScene(`explore_${targetId}`)
        }
      } else {
        triggerScene(`explore_${targetId}`)
      }

      return
    }

    handleAction(choice.id)
  }

  const onCreationComplete = (data: any) => {
    if (gameStore && typeof gameStore.startGame === 'function') {
      gameStore.startGame(data)
      triggerScene('awake')
    } else {
      console.error('gameStore.startGame is not a function!', gameStore)
    }
  }

  return {
    dialogStore,
    npcStore,
    game,
    handleNavClick,
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
  }
}

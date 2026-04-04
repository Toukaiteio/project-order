import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDialogStore } from '../stores/dialog'
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
  const { player, game, logs, inventory, mapNodes } = storeToRefs(gameStore)
  const { triggerScene, handleAction } = usePlot()

  const tab = ref<TabId>('story')
  const sidebarOpen = ref(false)
  const selectedItem = ref<InventoryItem | null>(null)

  const formattedTime = computed(() => formatClockTime(game.value.time))
  const weatherName = computed(() => WEATHER_NAMES[game.value.weather] ?? '鏈煡')
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

      if (Math.random() < 0.3) {
        if (targetId === 'hall_main') triggerScene('encounter_elena_hall')
        else if (targetId === 'corridor_a') triggerScene('encounter_marcus_corridor')
        else triggerScene(`explore_${targetId}`)
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

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

export type GameMode = 'loading' | 'menu' | 'creation' | 'playing'

export function useGameShell() {
  const gameStore = useGameStore()
  const dialogStore = useDialogStore()
  const npcStore = useNPCStore()
  const { player, game, logs, inventory, mapNodes, combat } = storeToRefs(gameStore)
  const { triggerScene, handleAction, checkSceneExists, fixCurrentScene } = usePlot()

  const mode = ref<GameMode>('loading')
  const tab = ref<TabId>('story')
  const sidebarOpen = ref(false)
  const selectedItem = ref<InventoryItem | null>(null)

  const formattedTime = computed(() => formatClockTime(game.value.time))
  const weatherName = computed(() => WEATHER_NAMES[game.value.weather] ?? '未知')
  const weatherIcon = computed(() => resolveWeatherIcon())
  const locationName = computed(() => LOCATION_NAMES[game.value.location] ?? game.value.location)
  const equippedWeapon = computed(() => player.value.equippedWeapon)

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

    // --- 战斗行动（统一走 action 系统，不再用独立 emit） ---
    if (choice.id === '_combat_atk' || choice.id === '_combat_def') {
      const type = choice.id === '_combat_atk' ? 'atk' : 'def'
      const result = gameStore.processCombatTurn(type)
      if (result === 'win') {
        triggerScene('combat_victory')
      } else if (result === 'lose') {
        triggerScene('combat_defeat')
      } else {
        gameStore.addCombatActions()
      }
      gameStore.saveGame()
      return
    }

    if (choice.id.startsWith('move_')) {
      const targetId = choice.id.replace('move_', '')
      gameStore.moveTo(targetId)

      // --- 1. 确定性剧情与伙伴逻辑 ---
      
      // 检查探索度并触发伙伴登场
      const initialLocations = ['cell_01', 'corridor_a', 'hall_main', 'med_bay', 'mess_hall', 'garbage_chute', 'cell_02'];
      const exploredCount = gameStore.flags.exploredLocations.filter((l: string) => initialLocations.includes(l)).length;

      if (targetId === 'corridor_a' && exploredCount >= 6 && !gameStore.flags.companion_met && !gameStore.flags.grey_met) {
        triggerScene('grey_first_notice'); return;
      }

      // Satoshi 任务: 寻找零件
      if (targetId === 'garbage_chute' && gameStore.flags.satoshi_quest_active && !gameStore.flags.has_satoshi_part) {
        triggerScene('quest_satoshi_find_part'); return
      }
      // Satoshi 任务: 交付零件
      if (targetId === 'cell_02' && gameStore.flags.has_satoshi_part && !gameStore.flags.satoshi_allied) {
        triggerScene('quest_satoshi_complete'); return
      }
      // Sasha 支线: 吊坠
      if (
        targetId === 'garbage_chute' &&
        gameStore.flags.sasha_locket_active &&
        !gameStore.flags.has_sasha_locket
      ) {
        triggerScene('quest_sasha_locket_find'); return
      }
      if (
        targetId === 'mess_hall' &&
        gameStore.flags.has_sasha_locket &&
        !gameStore.flags.sasha_locket_returned
      ) {
        triggerScene('quest_sasha_locket_return'); return
      }
      if (
        targetId === 'mess_hall' &&
        gameStore.game.day >= 61 &&
        gameStore.flags.sasha_saved &&
        gameStore.flags.sasha_locket_returned &&
        !gameStore.flags.sasha_keepsake_scene
      ) {
        triggerScene('quest_sasha_keepsake_repaid'); return
      }
      if (
        targetId === 'mess_hall' &&
        gameStore.game.day >= 61 &&
        gameStore.flags.sasha_saved &&
        !gameStore.flags.sasha_locket_returned &&
        (gameStore.flags.sasha_locket_active || gameStore.flags.sasha_locket_refused || gameStore.flags.has_sasha_locket) &&
        !gameStore.flags.sasha_failure_seen
      ) {
        triggerScene('quest_sasha_memory_lost'); return
      }
      if (
        targetId === 'med_bay' &&
        gameStore.game.day >= 64 &&
        gameStore.flags.aris_saved &&
        gameStore.flags.aris_ration_given &&
        !gameStore.flags.aris_mercy_repaid
      ) {
        triggerScene('quest_aris_medicine_repaid'); return
      }
      if (
        targetId === 'med_bay' &&
        gameStore.game.day >= 64 &&
        gameStore.flags.aris_quest_done &&
        !gameStore.flags.aris_ration_given &&
        !gameStore.flags.aris_failure_seen
      ) {
        triggerScene('quest_aris_patient_lost'); return
      }
      if (
        targetId === 'cell_02' &&
        gameStore.game.day >= 84 &&
        gameStore.flags.satoshi_allied &&
        gameStore.flags.arc6_archive_fragments &&
        !gameStore.flags.arc6_satoshi_route_shared
      ) {
        triggerScene('quest_satoshi_route_repaid'); return
      }
      if (
        targetId === 'cell_02' &&
        gameStore.game.day >= 55 &&
        !gameStore.flags.satoshi_allied &&
        (gameStore.flags.satoshi_quest_active || gameStore.flags.satoshi_refused || gameStore.flags.satoshi_part_missed) &&
        !gameStore.flags.satoshi_failure_seen
      ) {
        triggerScene('quest_satoshi_signal_lost'); return
      }
      if (
        targetId === 'hall_main' &&
        gameStore.game.day >= 87 &&
        !gameStore.flags.elena_quest_complete &&
        (gameStore.flags.elena_brief_rejected || gameStore.flags.elena_task_declined || gameStore.flags.elena_quest_active) &&
        !gameStore.flags.elena_failure_seen
      ) {
        triggerScene('quest_elena_distance_set'); return
      }

      // --- Grey 的剧情弧线触发 ---
      if (gameStore.flags.companion_met && gameStore.game.day >= 7 && !gameStore.flags.grey_d7_done && targetId === 'corridor_a') {
        triggerScene('grey_day07_check'); return
      }
      if (gameStore.flags.grey_d7_done && gameStore.game.day >= 14 && !gameStore.flags.grey_d14_done && targetId === 'cell_01') {
        triggerScene('grey_day14_secret'); return
      }
      if (gameStore.flags.grey_d14_done && gameStore.game.day >= 45 && !gameStore.flags.grey_d45_done && targetId === 'hall_main') {
        triggerScene('grey_day45_warning'); return
      }
      if (gameStore.flags.grey_d45_done && gameStore.game.day >= 75 && !gameStore.flags.grey_d75_fate && targetId === 'hall_main') {
        gameStore.flags.grey_d75_fate = true; // 防止重复触发
        triggerScene('grey_day75_fate'); return
      }

      // --- Elena 的剧情弧线触发 ---
      if (gameStore.flags.elena_allied && gameStore.game.day === 20 && !gameStore.flags.elena_quest_active && targetId === 'hall_main') {
        triggerScene('elena_day20_brief'); return
      }
      if (gameStore.flags.elena_quest_active && !gameStore.flags.elena_data_collect_active && !gameStore.flags.elena_quest_complete && targetId === 'hall_main' && Math.random() < 0.3) {
        triggerScene('quest_elena_data_collect'); return
      }

      if (gameStore.flags.elena_data_collect_active && !gameStore.flags.elena_quest_complete) {
        if (targetId === 'med_bay' && !gameStore.flags.elena_data_med_bay) {
          gameStore.flags.elena_data_med_bay = true;
          gameStore.addLog('你在医疗站翻到一张被药渍浸湿的记录页。上面的日期和人数被人反复圈过。', 'warning');
        }
        if (targetId === 'corridor_a' && !gameStore.flags.elena_data_corridor) {
          gameStore.flags.elena_data_corridor = true;
          gameStore.addLog('你在走廊尽头听见两个人压低声音提到“回收顺序”。他们说完后同时闭了嘴。', 'warning');
        }
        if (targetId === 'hall_main' && !gameStore.flags.elena_data_hall) {
          gameStore.flags.elena_data_hall = true;
          gameStore.addLog('大厅守卫换岗时，有人把名单翻到背面匆匆记了一笔。你记住了那一下停顿。', 'warning');
        }

        if (
          gameStore.flags.elena_data_med_bay &&
          gameStore.flags.elena_data_corridor &&
          gameStore.flags.elena_data_hall &&
          targetId === 'hall_main'
        ) {
          triggerScene('quest_elena_data_complete'); return
        }
      }

      // --- 1.5. 日常事件触发（特定天数） ---
      if (gameStore.game.day === 4 && targetId === 'cell_01' && !gameStore.flags.daily_d04_done) {
        gameStore.flags.daily_d04_done = true;
        triggerScene('daily_d04_isolation'); return
      }
      if (gameStore.game.day === 6 && targetId === 'hall_main' && !gameStore.flags.daily_d06_done) {
        gameStore.flags.daily_d06_done = true;
        triggerScene('daily_d06_food_queue'); return
      }
      if (gameStore.game.day === 7 && targetId === 'cell_01' && !gameStore.flags.daily_d07_done) {
        gameStore.flags.daily_d07_done = true;
        triggerScene('daily_d07_nightmare'); return
      }
      if (gameStore.game.day === 8 && targetId === 'hall_main' && !gameStore.flags.daily_d08_done) {
        gameStore.flags.daily_d08_done = true;
        triggerScene('daily_d08_ration_cut'); return
      }
      if (gameStore.game.day === 9 && targetId === 'corridor_a' && !gameStore.flags.daily_d09_done) {
        gameStore.flags.daily_d09_done = true;
        triggerScene('daily_d09_wall_tap'); return
      }
      if (gameStore.game.day === 10 && targetId === 'corridor_a' && !gameStore.flags.daily_d10_done) {
        gameStore.flags.daily_d10_done = true;
        triggerScene('daily_d10_body_removal'); return
      }
      if (gameStore.game.day === 12 && targetId === 'mess_hall' && !gameStore.flags.daily_d12_done) {
        gameStore.flags.daily_d12_done = true;
        triggerScene('daily_d12_food_debt'); return
      }
      if (gameStore.game.day === 13 && targetId === 'hall_main' && !gameStore.flags.daily_d13_done) {
        gameStore.flags.daily_d13_done = true;
        triggerScene('daily_d13_white_coat'); return
      }
      if (gameStore.game.day === 14 && targetId === 'hall_main' && !gameStore.flags.daily_d14_done) {
        gameStore.flags.daily_d14_done = true;
        triggerScene('daily_d14_pre_vote_pressure'); return
      }

      // --- 2. 概率性剧情触发 (偶遇/幻觉/支线开启) ---

      // 注：Grey 初次偶遇已在探索度触发中处理，不再这里随机触发以避免重复

      // 囚犯打斗
      if (targetId === 'corridor_a' && Math.random() < 0.2) {
        triggerScene('encounter_prisoner_brawl'); gameStore.saveGame(); return
      }

      // Aris 秘密冷藏箱
      if (targetId === 'med_bay' && npcStore.npcs['aris'].trust > 40 && !gameStore.flags.aris_box_opened && Math.random() < 0.2) {
        triggerScene('encounter_aris_secret_box'); gameStore.saveGame(); return
      }

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

      if (player.value.stats.sanity < 40 && Math.random() < 0.2) {
        const halls = ['encounter_hallucination_ghost_girl', 'encounter_hallucination_shadow_vendor'].filter(id => checkSceneExists(id))
        if (halls.length > 0) {
          triggerScene(halls[Math.floor(Math.random() * halls.length)]); return
        }
      }

      if (Math.random() < 0.3) {
        if (targetId === 'cell_02' && !gameStore.flags.satoshi_quest_active) {
          triggerScene('quest_satoshi_start'); return
        }
        if (
          targetId === 'corridor_a' &&
          gameStore.game.day >= 5 &&
          !gameStore.flags.sasha_locket_active &&
          !gameStore.flags.sasha_locket_returned &&
          !gameStore.flags.has_sasha_locket
        ) {
          triggerScene('quest_sasha_locket_start'); return
        }
        if (targetId === 'med_bay' && gameStore.game.day > 11 && !gameStore.flags.aris_quest_done) {
          triggerScene('quest_aris_plea'); gameStore.flags.aris_quest_done = true; return
        }
      }

      triggerScene(`explore_${targetId}`)
      gameStore.saveGame()
      return
    }

    handleAction(choice.id)
    gameStore.saveGame()
  }

  const onLoadingComplete = () => {
    mode.value = 'menu'
  }

  const handleMenuAction = (type: 'new' | 'continue' | 'settings') => {
    if (type === 'new') mode.value = 'creation'
    else if (type === 'continue') {
      if (gameStore.loadGame()) {
        mode.value = 'playing';
        // 加载后的关键重绘：如果存档记录了场景，立即重刷该场景以生成按钮
        if (gameStore.game.currentSceneId) {
          triggerScene(gameStore.game.currentSceneId);
        }
      }
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
    onLoadingComplete,
    inventory,
    locationName,
    logs,
    mapNodes,
    navItems: NAV_ITEMS,
    onCreationComplete,
    player,
    equippedWeapon,
    selectedItem,
    sidebarOpen,
    tab,
    weatherIcon,
    weatherName,
    formattedTime,
    executeAction,
    fixCurrentScene,
    useItem: (id: string) => gameStore.useItem(id),
  }
}

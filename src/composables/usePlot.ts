import { ref, computed, watch } from 'vue';
import { useGameStore } from '../stores/game';
import { useDialogStore } from '../stores/dialog';
import { useNPCStore } from '../stores/npcs';
import { useScheduleStore } from '../stores/schedule';
import { day01Plots } from '../content/plots/arc1/day01';
import { day02Plots } from '../content/plots/arc1/day02';
import { day03Plots } from '../content/plots/arc1/day03';
import { day04Plots } from '../content/plots/arc1/day04';
import { day05Plots } from '../content/plots/arc1/day05';
import { day06Plots } from '../content/plots/arc1/day06';
import { day07Plots } from '../content/plots/arc1/day07';
import { day08Plots } from '../content/plots/arc1/day08';
import { day09Plots } from '../content/plots/arc1/day09';
import { day10Plots } from '../content/plots/arc1/day10';
import { day11Plots } from '../content/plots/arc1/day11';
import { day12Plots } from '../content/plots/arc1/day12';
import { day13Plots } from '../content/plots/arc1/day13';
import { day14Plots } from '../content/plots/arc1/day14';
import { day15Plots } from '../content/plots/arc1/day15';
import { day16Plots } from '../content/plots/arc2/day16';
import { day17Plots } from '../content/plots/arc2/day17';
import { day18Plots } from '../content/plots/arc2/day18';
import { day19Plots } from '../content/plots/arc2/day19';
import { day20Plots } from '../content/plots/arc2/day20';
import { day21Plots } from '../content/plots/arc2/day21';
import { day22Plots } from '../content/plots/arc2/day22';
import { day23Plots } from '../content/plots/arc2/day23';
import { day24Plots } from '../content/plots/arc2/day24';
import { day25Plots } from '../content/plots/arc2/day25';
import { day26Plots } from '../content/plots/arc2/day26';
import { day27Plots } from '../content/plots/arc2/day27';
import { day28Plots } from '../content/plots/arc2/day28';
import { day29Plots } from '../content/plots/arc2/day29';
import { day30Plots } from '../content/plots/arc2/day30';
import { day31Plots } from '../content/plots/arc3/day31';
import { day32Plots } from '../content/plots/arc3/day32';
import { day33Plots } from '../content/plots/arc3/day33';
import { day34Plots } from '../content/plots/arc3/day34';
import { day35Plots } from '../content/plots/arc3/day35';
import { day36Plots } from '../content/plots/arc3/day36';
import { day37Plots } from '../content/plots/arc3/day37';
import { day38Plots } from '../content/plots/arc3/day38';
import { day39Plots } from '../content/plots/arc3/day39';
import { day40Plots } from '../content/plots/arc3/day40';
import { day41Plots } from '../content/plots/arc3/day41';
import { day42Plots } from '../content/plots/arc3/day42';
import { day43Plots } from '../content/plots/arc3/day43';
import { day44Plots } from '../content/plots/arc3/day44';
import { day45Plots } from '../content/plots/arc3/day45';
import { day46Plots } from '../content/plots/arc4/day46';
import { day47Plots } from '../content/plots/arc4/day47';
import { day48Plots } from '../content/plots/arc4/day48';
import { day49Plots } from '../content/plots/arc4/day49';
import { day50Plots } from '../content/plots/arc4/day50';
import { day51Plots } from '../content/plots/arc4/day51';
import { day52Plots } from '../content/plots/arc4/day52';
import { day53Plots } from '../content/plots/arc4/day53';
import { day54Plots } from '../content/plots/arc4/day54';
import { day55Plots } from '../content/plots/arc4/day55';
import { day56Plots } from '../content/plots/arc4/day56';
import { day57Plots } from '../content/plots/arc4/day57';
import { day58Plots } from '../content/plots/arc4/day58';
import { day59Plots } from '../content/plots/arc4/day59';
import { day60Plots } from '../content/plots/arc4/day60';
import { day61Plots } from '../content/plots/arc5/day61';
import { day62Plots } from '../content/plots/arc5/day62';
import { day63Plots } from '../content/plots/arc5/day63';
import { day64Plots } from '../content/plots/arc5/day64';
import { day65Plots } from '../content/plots/arc5/day65';
import { day66Plots } from '../content/plots/arc5/day66';
import { day67Plots } from '../content/plots/arc5/day67';
import { day68Plots } from '../content/plots/arc5/day68';
import { day69Plots } from '../content/plots/arc5/day69';
import { day70Plots } from '../content/plots/arc5/day70';
import { day71Plots } from '../content/plots/arc5/day71';
import { day72Plots } from '../content/plots/arc5/day72';
import { day73Plots } from '../content/plots/arc5/day73';
import { day74Plots } from '../content/plots/arc5/day74';
import { day75Plots } from '../content/plots/arc5/day75';
import { day76Plots } from '../content/plots/arc6/day76';
import { day77Plots } from '../content/plots/arc6/day77';
import { day78Plots } from '../content/plots/arc6/day78';
import { day79Plots } from '../content/plots/arc6/day79';
import { day80Plots } from '../content/plots/arc6/day80';
import { day81Plots } from '../content/plots/arc6/day81';
import { day82Plots } from '../content/plots/arc6/day82';
import { day83Plots } from '../content/plots/arc6/day83';
import { day84Plots } from '../content/plots/arc6/day84';
import { day85Plots } from '../content/plots/arc6/day85';
import { day86Plots } from '../content/plots/arc6/day86';
import { day87Plots } from '../content/plots/arc6/day87';
import { day88Plots } from '../content/plots/arc6/day88';
import { day89Plots } from '../content/plots/arc6/day89';
import { day90Plots } from '../content/plots/arc6/day90';
import { companionPlots } from '../content/plots/shared/companion';
import { trainingPlots } from '../content/plots/shared/training';
import { npcInteractionPlots } from '../content/plots/shared/npc_interaction';
import { systemPlots } from '../content/plots/shared/system_actions';
import { sideQuests } from '../content/plots/shared/sidequests';
import { encounterPlots } from '../content/plots/shared/encounters';
import { locationExplorationPlots } from '../content/plots/shared/locations';
import type { PlotScene, PlotAction, PlotEffectContext } from '../types/plot';

const questioningPlots: Record<string, PlotScene> = {
  'ask_about_facility': {
    id: 'ask_about_facility',
    locationId: 'hall_main',
    type: 'story',
    text: '你拦住了一名行色匆匆的囚犯，试图询问这里到底是什么地方。',
    actions: [
      { id: 'ask_marcus_about', label: '询问 Marcus', condition: (ctx) => ctx.game.game.location === 'hall_main', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('Marcus 嗤笑一声：“这里？这里是‘秩序之眼’，朋友。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      { id: 'ask_sasha_about', label: '询问 Sasha', condition: (ctx) => ctx.game.game.location === 'mess_hall', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('Sasha 缩了缩脖子：“我不记得了……我只记得天空是红色的。”', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'back_to_explore', label: '放弃询问', timeCost: 0.1, variant: 'default',
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`
      }
    ]
  }
};

// 合并所有剧情脚本
const ALL_PLOTS: Record<string, PlotScene> = {
  ...day01Plots,
  ...day02Plots,
  ...day03Plots,
  ...day04Plots,
  ...day05Plots,
  ...day06Plots,
  ...day07Plots,
  ...day08Plots,
  ...day09Plots,
  ...day10Plots,
  ...day11Plots,
  ...day12Plots,
  ...day13Plots,
  ...day14Plots,
  ...day15Plots,
  ...day16Plots,
  ...day17Plots,
  ...day18Plots,
  ...day19Plots,
  ...day20Plots,
  ...day21Plots,
  ...day22Plots,
  ...day23Plots,
  ...day24Plots,
  ...day25Plots,
  ...day26Plots,
  ...day27Plots,
  ...day28Plots,
  ...day29Plots,
  ...day30Plots,
  ...day31Plots,
  ...day32Plots,
  ...day33Plots,
  ...day34Plots,
  ...day35Plots,
  ...day36Plots,
  ...day37Plots,
  ...day38Plots,
  ...day39Plots,
  ...day40Plots,
  ...day41Plots,
  ...day42Plots,
  ...day43Plots,
  ...day44Plots,
  ...day45Plots,
  ...day46Plots,
  ...day47Plots,
  ...day48Plots,
  ...day49Plots,
  ...day50Plots,
  ...day51Plots,
  ...day52Plots,
  ...day53Plots,
  ...day54Plots,
  ...day55Plots,
  ...day56Plots,
  ...day57Plots,
  ...day58Plots,
  ...day59Plots,
  ...day60Plots,
  ...day61Plots,
  ...day62Plots,
  ...day63Plots,
  ...day64Plots,
  ...day65Plots,
  ...day66Plots,
  ...day67Plots,
  ...day68Plots,
  ...day69Plots,
  ...day70Plots,
  ...day71Plots,
  ...day72Plots,
  ...day73Plots,
  ...day74Plots,
  ...day75Plots,
  ...day76Plots,
  ...day77Plots,
  ...day78Plots,
  ...day79Plots,
  ...day80Plots,
  ...day81Plots,
  ...day82Plots,
  ...day83Plots,
  ...day84Plots,
  ...day85Plots,
  ...day86Plots,
  ...day87Plots,
  ...day88Plots,
  ...day89Plots,
  ...day90Plots,
  ...companionPlots,
  ...trainingPlots,
  ...npcInteractionPlots,
  ...systemPlots,
  ...sideQuests,
  ...encounterPlots,
  ...locationExplorationPlots,
  ...questioningPlots,
};

export function usePlot() {
  const gameStore = useGameStore();
  const dialogStore = useDialogStore();
  const npcStore = useNPCStore();
  const scheduleStore = useScheduleStore();
  const currentSceneId = ref('awake');
  // 记录上一个场景，用于空行动保护机制
  const previousSceneId = ref('');
  // 存储当前场景所有有效行动（含动态注入），供 handleAction 查找
  const currentValidActions = ref<PlotAction[]>([]);

  const context: PlotEffectContext = {
    game: gameStore,
    dialog: dialogStore,
    npcs: npcStore,
    schedule: scheduleStore,
  };

  // 监听待处理剧情，实现跨天或事件自动触发
  watch(() => gameStore.flags.pendingPlotId, (newPlotId) => {
    if (newPlotId) {
      triggerScene(newPlotId as string);
      gameStore.flags.pendingPlotId = '';
    }
  });

  const currentScene = computed(() => ALL_PLOTS[currentSceneId.value]);

  const triggerScene = (sceneId: string) => {
    const scene = ALL_PLOTS[sceneId];
    if (!scene) return;

    // 清除末尾的未 resolve action entry（防止主线事件触发时出现多个菜单）
    const lastEntry = gameStore.logs[gameStore.logs.length - 1];
    if (lastEntry && lastEntry.type === 'actions' && !lastEntry.resolvedId) {
      gameStore.logs.pop();
    }

    previousSceneId.value = currentSceneId.value;
    currentSceneId.value = sceneId;

    // 添加叙事文本
    const text = typeof scene.text === 'function' ? scene.text(context) : scene.text;
    gameStore.addLog(text, scene.type);

    // 触发进入场景的回调
    if (scene.onEnter) scene.onEnter(context);

    // 更新可用行动
    const validActions: PlotAction[] = [...scene.actions.filter(a => !a.condition || a.condition(context))];

    // 注入原地休息逻辑 -> 统一指向 rest_menu
    if (scene.allowFieldRest) {
      validActions.push({
        id: 'field_rest_entry', label: '原地休息 (风险)', timeCost: 0.1, variant: 'danger',
        nextSceneId: 'rest_menu'
      });
    }

    // --- 动态 NPC 交互注入 ---
    if (sceneId !== 'npc_menu_general' && sceneId !== 'rest_menu') {
      const currentLoc = gameStore.game.location;
      const npcsHere = Object.values(npcStore.npcs).filter(n =>
        n.location === currentLoc && n.state === 'Alive' && n.met === true
      );

      npcsHere.forEach(npc => {
        if (!validActions.some(a => a.id === `interact_${npc.id}`)) {
          validActions.push({
            id: `interact_${npc.id}`,
            label: `与 ${npc.name} 互动`,
            timeCost: 0.1,
            variant: 'accent',
            effect: (ctx) => {
              ctx.game.flags.interacting_npc_id = npc.id;
            },
            nextSceneId: 'npc_menu_general'
          });
        }
      });
    }

    // --- 安全保护：若当前无任何行动，注入撤回上一步 ---
    if (validActions.length === 0 && previousSceneId.value && previousSceneId.value !== sceneId) {
      validActions.push({
        id: '_undo_last_action',
        label: '← 撤回上一步 [测试]',
        timeCost: 0,
        variant: 'default',
      });
    }

    // 缓存完整行动列表（含注入项），handleAction 从此查找
    currentValidActions.value = validActions;

    // 将动态标签解析为字符串后传给 addActions
    const actionChoices = validActions.map(a => ({
      ...a,
      label: typeof a.label === 'function' ? a.label(context) : a.label
    })) as any;
    gameStore.addActions(actionChoices);
  };

  const handleAction = (choiceId: string) => {
    // 撤回保护：回到上一个场景
    if (choiceId === '_undo_last_action') {
      if (previousSceneId.value) triggerScene(previousSceneId.value);
      return;
    }

    // 在完整行动列表（含注入项）中查找，修复动态注入行动无法执行的问题
    const action = currentValidActions.value.find(a => a.id === choiceId);
    if (!action) return;
    if (action.effect) action.effect(context);
    if (action.nextSceneId) {
      const targetId = typeof action.nextSceneId === 'function' ? action.nextSceneId(context) : action.nextSceneId;
      triggerScene(targetId);
    }
  };

  // 暴露验证用的方法
  const getAllSceneIds = () => Object.keys(ALL_PLOTS);

  const getSceneDetails = (sceneId: string) => {
    return ALL_PLOTS[sceneId];
  };

  const validateScene = (sceneId: string) => {
    const scene = ALL_PLOTS[sceneId];
    if (!scene) {
      return { exists: false, hasActions: false, actionCount: 0 };
    }
    return {
      exists: true,
      hasActions: scene.actions && scene.actions.length > 0,
      actionCount: scene.actions?.length || 0,
    };
  };

  return {
    currentSceneId,
    currentScene,
    triggerScene,
    handleAction,
    checkSceneExists: (id: string) => !!ALL_PLOTS[id],
    getAllSceneIds,
    getSceneDetails,
    validateScene,
  };
}

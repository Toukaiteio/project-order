import { ref, computed, watch } from 'vue';
import { useGameStore } from '../stores/game';
import { useDialogStore } from '../stores/dialog';
import { useNPCStore } from '../stores/npcs';
import { useScheduleStore } from '../stores/schedule';
import { day01Plots } from '../content/plots/arc1/day01';
import { day02Plots } from '../content/plots/arc1/day02';
import { day03Plots } from '../content/plots/arc1/day03';
import { day05Plots } from '../content/plots/arc1/day05';
import { day11Plots } from '../content/plots/arc1/day11';
import { day15Plots } from '../content/plots/arc1/day15';
import { day20Plots } from '../content/plots/arc2/day20';
import { day30Plots } from '../content/plots/arc2/day30';
import { day45Plots } from '../content/plots/arc3/day45';
import { day60Plots } from '../content/plots/arc4/day60';
import { day75Plots } from '../content/plots/arc5/day75';
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
  ...day05Plots,
  ...day11Plots,
  ...day15Plots,
  ...day20Plots,
  ...day30Plots,
  ...day45Plots,
  ...day60Plots,
  ...day75Plots,
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
    gameStore.addActions(validActions);
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

  return {
    currentSceneId,
    currentScene,
    triggerScene,
    handleAction,
    checkSceneExists: (id: string) => !!ALL_PLOTS[id],
  };
}

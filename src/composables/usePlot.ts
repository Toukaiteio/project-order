import { ref, computed, watch } from 'vue';
import { useGameStore } from '../stores/game';
import { useDialogStore } from '../stores/dialog';
import { useNPCStore } from '../stores/npcs';
import { useScheduleStore } from '../stores/schedule';
import { day01Plots } from '../content/plots/day01';
import { day05Plots } from '../content/plots/day05';
import { day11Plots } from '../content/plots/day11';
import { day15Plots } from '../content/plots/day15';
import { day20Plots } from '../content/plots/day20';
import { encounterPlots } from '../content/plots/encounters';
import { locationExplorationPlots } from '../content/plots/locations';
import type { PlotScene, PlotEffectContext } from '../types/plot';

// 合并所有剧情脚本
const ALL_PLOTS: Record<string, PlotScene> = {
  ...day01Plots,
  ...day05Plots,
  ...day11Plots,
  ...day15Plots,
  ...day20Plots,
  ...encounterPlots,
  ...locationExplorationPlots,
};

export function usePlot() {
  const gameStore = useGameStore();
  const dialogStore = useDialogStore();
  const npcStore = useNPCStore();
  const scheduleStore = useScheduleStore();
  const currentSceneId = ref('awake');

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

    currentSceneId.value = sceneId;

    // 添加叙事文本
    const text = typeof scene.text === 'function' ? scene.text(context) : scene.text;
    gameStore.addLog(text, scene.type);

    // 触发进入场景的回调
    if (scene.onEnter) scene.onEnter(context);

    // 更新可用行动
    const validActions = [...scene.actions.filter(a => !a.condition || a.condition(context))];
    
    // 如果场景允许原地休息，则注入一个特殊的“原地休息”行动
    if (scene.allowFieldRest) {
      validActions.push({
        id: 'field_rest',
        label: '原地休息 (风险)',
        timeCost: 1.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 5);
          
          const roll = Math.random();
          if (roll < 0.3) {
            ctx.game.addLog('你在不安中打了个盹。虽然还是很累，但神智清醒了一些。', 'info');
          } else if (roll < 0.6) {
            ctx.game.addLog('你刚闭上眼，就感到有人在翻动你的口袋！', 'warning');
            const lost = Math.min(ctx.game.game.money, 20);
            ctx.game.game.money -= lost;
            ctx.game.addLog(`你失去了 ${lost} 积分。`, 'danger');
          } else if (roll < 0.85) {
            ctx.game.player.stats.hp -= 10;
            ctx.game.addLog('某种冰冷的东西划过了你的手臂。当你惊醒时，只看到黑暗中一双逃离的脚步。', 'danger');
          } else {
            ctx.game.addLog('你陷入了可怕的噩梦。梦中，你看到自己正一点点变成设施墙壁上的污渍。', 'warning');
            ctx.game.player.stats.sanity -= 15;
          }
        }
      });
    }

    gameStore.addActions(validActions);
  };

  const handleAction = (choiceId: string) => {
    if (!currentScene.value) return;

    const action = currentScene.value.actions.find(a => a.id === choiceId);
    if (!action) return;

    // 执行效果
    if (action.effect) action.effect(context);

    // 剧情跳转
    if (action.nextSceneId) {
      triggerScene(action.nextSceneId);
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

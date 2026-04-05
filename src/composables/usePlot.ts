import { ref, computed, watch } from 'vue';
import { useGameStore } from '../stores/game';
import { useDialogStore } from '../stores/dialog';
import { useNPCStore } from '../stores/npcs';
import { useScheduleStore } from '../stores/schedule';
import { day01Plots } from '../content/plots/day01';
import { day05Plots } from '../content/plots/day05';
import { day11Plots } from '../content/plots/day11';
import { encounterPlots } from '../content/plots/encounters';
import { locationExplorationPlots } from '../content/plots/locations';
import type { PlotScene, PlotEffectContext } from '../types/plot';

// 合并所有剧情脚本
const ALL_PLOTS: Record<string, PlotScene> = {
  ...day01Plots,
  ...day05Plots,
  ...day11Plots,
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
    // 过滤出满足条件的行动
    const validActions = scene.actions.filter(a => !a.condition || a.condition(context));
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

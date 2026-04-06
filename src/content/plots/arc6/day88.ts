import type { PlotScene } from '../../../types/plot';

export const day88Plots: Record<string, PlotScene> = {
  'day88_door_test': {
    id: 'day88_door_test',
    locationId: 'corridor_a',
    type: 'warning',
    text: '最外层的门今天真的动了。不是完全打开，只是抬起了一道够光漏进来的缝。那缝短得像错觉，却足够让整层人安静到忘记呼吸。',
    actions: [
      {
        id: 'd88_watch_gap',
        label: '盯住那道缝',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_door_gap_seen = true;
          ctx.game.addLog('光只亮了一瞬，可已经够让你确认，外面真的不是另一层灯。', 'danger');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd88_watch_people',
        label: '看谁先往前动',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没盯门，只盯人。有人下意识往前迈了半步，又立刻缩了回去。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

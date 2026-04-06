import type { PlotScene } from '../../../types/plot';

export const day79Plots: Record<string, PlotScene> = {
  'day79_outer_gate_hum': {
    id: 'day79_outer_gate_hum',
    locationId: 'corridor_a',
    type: 'warning',
    text: '从今天开始，最外层通道会在固定时段传来低沉的机械轰鸣。那声音和反应堆不同，更像很久没动过的重门正在被一点点唤醒。',
    actions: [
      {
        id: 'd79_follow_hum',
        label: '往外层走一段',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_gate_hum_known = true;
          ctx.game.addLog('你没真的走到尽头，但已经足够判断那不是维修声，而是门轴在重新学着怎么开。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd79_do_not_chase',
        label: '别跟着声音走',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没去追那声音。可它接下来每晚都会自己找上你的耳朵。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

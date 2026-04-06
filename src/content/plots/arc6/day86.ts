import type { PlotScene } from '../../../types/plot';

export const day86Plots: Record<string, PlotScene> = {
  'day86_last_sorting': {
    id: 'day86_last_sorting',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅今天被最后整理了一次。不是清洁，而是分层。谁靠近屏幕、谁靠近门、谁只配站在边缘，突然都有了默认的位置。',
    actions: [
      {
        id: 'd86_refuse_slot',
        label: '别站进别人给的位置',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc6_slot_refused = true;
          ctx.game.player.stats.sanity -= 1;
          ctx.game.addLog('你故意站偏了一点。代价是所有人都更容易记住你。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd86_blend_in',
        label: '先站进去看清楚',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_slot_seen = true;
          ctx.game.addLog('你站进了他们默认给你的那格。暂时安全，但也像是在提前练习某种服从。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

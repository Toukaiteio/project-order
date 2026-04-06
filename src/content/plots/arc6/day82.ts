import type { PlotScene } from '../../../types/plot';

export const day82Plots: Record<string, PlotScene> = {
  'day82_sky_on_screen': {
    id: 'day82_sky_on_screen',
    locationId: 'hall_main',
    type: 'story',
    text: '所有屏幕今天都短暂切到了一段地表画面。不是实时的，更像库存素材。蓝得过分的天、风吹动的荒草，还有一条没有任何脚印的路。',
    actions: [
      {
        id: 'd82_stare_sky',
        label: '把那片天看完',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 1;
          ctx.game.addLog('你盯着那片天，反而更难判断它是真是假。到了现在，连希望都像是实验材料。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd82_watch_people',
        label: '看看谁先信了',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_sky_reactions = true;
          ctx.game.addLog('你没去看天空，而是看人群。总有人会先把一段录像当成出口。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

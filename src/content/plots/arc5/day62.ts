import type { PlotScene } from '../../../types/plot';

export const day62Plots: Record<string, PlotScene> = {
  'day62_spoils_list': {
    id: 'day62_spoils_list',
    locationId: 'hall_main',
    type: 'warning',
    text: '第二天，大厅屏幕上挂出一张新的分配表。不是补给，也不是配给，而是“清理后可再利用物资”。有人在看床位，有人在看工具，还有人直接在看谁留下的口粮。',
    actions: [
      {
        id: 'd62_read_spoils',
        label: '把表看完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_spoils_read = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把那张表从头看到尾，越看越明白，清洗从来不只是少掉一些人，也是在腾出一些东西。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd62_turn_away',
        label: '别盯着别人留下的东西看',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你很快移开了视线。可那张表已经看见了你，这就够了。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

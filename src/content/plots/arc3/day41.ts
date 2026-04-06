import type { PlotScene } from '../../../types/plot';

export const day41Plots: Record<string, PlotScene> = {
  'day41_names_on_wall': {
    id: 'day41_names_on_wall',
    locationId: 'corridor_a',
    type: 'story',
    text: '有人在走廊墙上重新开始刻名字了。不是怀念，也不是纪念，更像是在跟什么东西抢速度。你路过时看见一行刚刻好的字还没完工，最后一笔拉得很长，像手在发抖。',
    actions: [
      {
        id: 'd41_add_mark',
        label: '在旁边留一个记号',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你没写名字，只留了一道短短的刻痕。它小得几乎没人会注意，但你知道自己为什么非留不可。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd41_memorize_names',
        label: '把这些名字记下来',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_wall_names = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你一行行看过去，忽然发现其中几个名字和赛跑后消失的人对得上。有人在用最原始的办法留下证据。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

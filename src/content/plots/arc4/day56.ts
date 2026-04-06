import type { PlotScene } from '../../../types/plot';

export const day56Plots: Record<string, PlotScene> = {
  'day56_names_removed': {
    id: 'day56_names_removed',
    locationId: 'corridor_a',
    type: 'warning',
    text: '墙上的名字今天少了一整片。不是被盖住，也不是被划花，而是被整块磨平，像从来没刻上去过。旁边地上留着一层很细的白灰。',
    actions: [
      {
        id: 'd56_collect_dust',
        label: '捻一点灰在指尖',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('那层灰细得像骨粉。你立刻松手，却还是觉得指缝里沾着什么。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd56_compare_memory',
        label: '想想少掉的是谁',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_missing_names_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把记忆里的那面墙和现在比了一遍，发现被磨掉的，几乎都是最近几天最容易被叫到的人。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day78Plots: Record<string, PlotScene> = {
  'day78_archive_burn': {
    id: 'day78_archive_burn',
    locationId: 'cell_02',
    type: 'story',
    text: '终端室今天飘出了烧焦的塑料味。不是失火，而像有人在成批擦除什么。Satoshi 盯着屏幕上的删除进度条，脸色白得像灯管。',
    actions: [
      {
        id: 'd78_copy_fast',
        label: '能记多少先记多少',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc6_archive_fragments = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('你和 Satoshi 没法全抢下来，只来得及硬记住几组编号和一张被删了一半的结构图。', 'danger');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd78_step_back',
        label: '先别把自己搭进去',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你后退了半步。被烧掉的东西也许重要，可不是每一份重要都值得立刻拿命去换。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  }
};

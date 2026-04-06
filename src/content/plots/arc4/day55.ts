import type { PlotScene } from '../../../types/plot';

export const day55Plots: Record<string, PlotScene> = {
  'day55_last_safe_corner': {
    id: 'day55_last_safe_corner',
    locationId: 'cell_02',
    type: 'story',
    text: '连最乱的角落也开始有人固定看守了。Satoshi 的房间还亮着一点微绿的光，可那点光第一次显得不像秘密，更像最后一块还没被收走的边角。',
    onEnter: (ctx) => {
      if (ctx.game.flags.satoshi_allied) {
        ctx.game.addLog('Satoshi 把门先关到只剩一条缝，才让你进去。“他们开始记电了，”他说。', 'warning');
      }
    },
    actions: [
      {
        id: 'd55_check_backup',
        label: '问他还剩什么能用',
        timeCost: 0.75,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc4_satoshi_backup = true;
          ctx.game.addLog('Satoshi 从床板下面摸出一小包拆开的零件，像给你看一副已经快凑不齐的骨架。', 'info');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd55_leave_quickly',
        label: '别在这儿待太久',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你很快离开了。现在连停留时间，都开始像另一种会被记下来的东西。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  }
};

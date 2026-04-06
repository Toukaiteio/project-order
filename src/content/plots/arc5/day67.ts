import type { PlotScene } from '../../../types/plot';

export const day67Plots: Record<string, PlotScene> = {
  'day67_debtor_roll': {
    id: 'day67_debtor_roll',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅里新挂出了一张债务榜。不是积分，而是“占用资源未偿还者”。名字下面没有金额，只有一道更让人心里发紧的空栏，像在等谁亲自来填。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('你的视线扫过去时，忽然觉得这榜不是挂给所有人看的。', 'warning');
      }
    },
    actions: [
      {
        id: 'd67_read_debts',
        label: '站着把榜读完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_debt_board = true;
          ctx.game.addLog('上面不只是欠配给的人，还有欠命、欠位子、欠一次不该有的放过的人。这里终于把这些都算进去了。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd67_do_not_stop',
        label: '走过去，别站住',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没停。可那张榜已经足够让你今天之后看谁都像在看债主。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

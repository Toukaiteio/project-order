import type { PlotScene } from '../../../types/plot';

export const day84Plots: Record<string, PlotScene> = {
  'day84_terminal_map': {
    id: 'day84_terminal_map',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi把一张残缺的设施图拉到了屏幕上。最外层门禁、升降台、监控扇区和样本回收通道都只剩半边，但已经够让人看懂一件事：出口从来不只一扇。',
    actions: [
      {
        id: 'd84_memorize_map',
        label: '先把缺的那半边补在脑子里',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc6_terminal_map = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('你和 Satoshi 把残图拼来拼去，最后勉强看出一条不像给人走、却可能真的能走出去的边路。', 'danger');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd84_close_map',
        label: '知道有别的门就够了',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有把图看完。知道出口不止一扇，有时候已经足够危险。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  }
};

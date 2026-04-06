import type { PlotScene } from '../../../types/plot';

export const day65Plots: Record<string, PlotScene> = {
  'day65_terminal_archive': {
    id: 'day65_terminal_archive',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 把终端亮度调到最低，屏幕上多了一列新的归档目录。不是设施日志，而是“继承组候选行为样本”。他看到那几个字时，先骂了一句，才把位置让给你。',
    actions: [
      {
        id: 'd65_open_archive',
        label: '把目录看下去',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc5_archive_seen = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('目录里有站队、执行、节律、服从和资源保全。你越往下看，越觉得他们是在替某个人准备一场加冕。', 'danger');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd65_cut_power',
        label: '先把屏幕熄掉',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没让那份目录亮太久。可看过一眼的东西，通常灭得没有屏幕那么干净。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  }
};

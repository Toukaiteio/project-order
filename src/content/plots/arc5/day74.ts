import type { PlotScene } from '../../../types/plot';

export const day74Plots: Record<string, PlotScene> = {
  'day74_last_whispers': {
    id: 'day74_last_whispers',
    locationId: 'hall_main',
    type: 'warning',
    text: '到了第74天，连低语都变得有方向了。谁会被请去、谁只是陪站、谁明天可能根本看不到大厅，这些话开始在不同角落里长得越来越像。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬到明天，决定你是上桌、掀桌，还是活着离桌');
      if (ctx.game.flags.arc5_archive_seen) {
        ctx.game.addLog('你现在很难不把“继承组候选”那几个字和明天联系到一起。', 'warning');
      }
    },
    actions: [
      {
        id: 'd74_pick_side',
        label: '今晚先把立场想清楚',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_final_posture = true;
          ctx.game.addLog('你终于不再把明天当成一顿饭。想清楚这一点以后，很多选择忽然都硬了起来。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd74_keep_moving',
        label: '别停，别让人先抓到你',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你整晚都没在一个地方站太久。这样很累，但至少还像自己在选。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

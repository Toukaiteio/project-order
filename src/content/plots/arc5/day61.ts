import type { PlotScene } from '../../../types/plot';

export const day61Plots: Record<string, PlotScene> = {
  'day61_empty_tables': {
    id: 'day61_empty_tables',
    locationId: 'mess_hall',
    type: 'warning',
    text: '清洗后的第一顿饭，食堂空出了整排位置。没人去碰那些桌子，连平时最饿的人都绕开走，像怕把椅子拉响就会把昨天重新惊动一遍。',
    onEnter: (ctx) => {
      if (ctx.game.flags.sasha_saved) {
        ctx.game.addLog('Sasha 坐得比以前更靠里，吃东西时几乎不抬头，像怕被人再次记住。', 'warning');
      }
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 没来食堂。有人说他已经开始替活下来的人重新分轻重。', 'warning');
      }
    },
    actions: [
      {
        id: 'd61_count_absent',
        label: '把空位数完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_absences_counted = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没有急着坐下，先把空位一张张看过去。数字比广播里报的还难听。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd61_eat_fast',
        label: '吃完就走',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没在这地方多停。如今连多看一眼空位，都像在替谁补上一句迟到的告别。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

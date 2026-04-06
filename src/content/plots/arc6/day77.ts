import type { PlotScene } from '../../../types/plot';

export const day77Plots: Record<string, PlotScene> = {
  'day77_succession_notice': {
    id: 'day77_succession_notice',
    locationId: 'hall_main',
    type: 'warning',
    text: '广播第一次提到“继承阶段”。不是胜者，不是幸存者，而是继承。大厅里有几秒没人出声，因为这词比任何惩罚都更像宣布这地方会继续存在下去。',
    actions: [
      {
        id: 'd77_mark_word',
        label: '把这词记住',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_inheritance_named = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把“继承阶段”这几个字在心里压得很重。很多人到现在才意识到，终点可能只是另一道任命。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd77_watch_reaction',
        label: '先看谁抬头了',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没看屏幕，只去看人。有人害怕，有人发亮，最糟的是还有人真的开始期待。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day87Plots: Record<string, PlotScene> = {
  'day87_white_coats_return': {
    id: 'day87_white_coats_return',
    locationId: 'hall_main',
    type: 'warning',
    text: '很久没出现过的白衣人今天重新站到了玻璃后面。他们不说话，只在看板上记录。那种被重新当成样本端详的感觉，比执行队更让人恶心。',
    onEnter: (ctx) => {
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 抬头盯着那排白衣人，像终于看见了自己一直想找到的源头。', 'warning');
      }
    },
    actions: [
      {
        id: 'd87_count_white_coats',
        label: '数清有几个人在看',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_observers_counted = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把玻璃后的人影数了两遍。比你想的少，也比你希望的多。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd87_look_down',
        label: '别和他们对视',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你低下头，却还是知道他们在看。很多时候，羞耻根本不需要对视。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

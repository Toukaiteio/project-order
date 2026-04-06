import type { PlotScene } from '../../../types/plot';

export const day68Plots: Record<string, PlotScene> = {
  'day68_false_pardon': {
    id: 'day68_false_pardon',
    locationId: 'hall_main',
    type: 'story',
    text: '广播今天难得地用了温和语气，说部分表现稳定者将得到“长期留用评估”。大厅里甚至有人小声鼓掌。可那句子听上去越温和，越像绞索被包了层布。',
    actions: [
      {
        id: 'd68_mark_phrase',
        label: '记住这句话的说法',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_pardon_phrase = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把“长期留用”四个字在心里默念了一遍。那不是活路，更像一种被留下来继续用的资格。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd68_look_at_crowd',
        label: '看看是谁信了',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有抬头看屏幕，只去看人群。相信这种话的人，表情总是很像同一种祈祷。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

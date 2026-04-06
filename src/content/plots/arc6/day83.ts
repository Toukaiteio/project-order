import type { PlotScene } from '../../../types/plot';

export const day83Plots: Record<string, PlotScene> = {
  'day83_food_for_names': {
    id: 'day83_food_for_names',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂今天开始拿额外口粮换名单。不是公开收买，只是有人在角落里低声问：“你知道谁被叫过吗？”食物越像食物的时候，越容易让人开口。',
    actions: [
      {
        id: 'd83_refuse_trade',
        label: '别拿名字换吃的',
        timeCost: 0.25,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_kept_silence = true;
          ctx.game.addLog('你什么都没说。空着的胃会疼，可有些话一旦换出去，就再也收不回来了。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd83_trade_hint',
        label: '只递出去半句',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.game.hunger = Math.min(100, ctx.game.game.hunger + 8);
          ctx.game.flags.arc6_names_traded = true;
          ctx.game.addLog('你只给了半句不够致命的话，换来一小块更像样的吃食。可回头时，还是觉得有人少了一点。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

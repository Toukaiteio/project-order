import type { PlotScene } from '../../../types/plot';

export const day66Plots: Record<string, PlotScene> = {
  'day66_ration_festival': {
    id: 'day66_ration_festival',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今天的配给比前几天突然多了一点。不是很多，但足够让人群里出现一种危险的轻松。有人笑了，有人甚至开始说“是不是终于熬过去了”。',
    onEnter: (ctx) => {
      ctx.game.addLog('你知道，这种时候突然多出来的东西，通常都不是好消息。', 'warning');
    },
    actions: [
      {
        id: 'd66_take_extra',
        label: '先把多出来的拿稳',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.game.hunger = Math.min(100, ctx.game.game.hunger + 10);
          ctx.game.addLog('你把多出来的那点东西先吃进了肚子里。暖意很短，可比空着要诚实。', 'info');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd66_watch_smiles',
        label: '看看是谁先笑出来',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_false_relief = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没急着动手，而是看谁最先松了那口气。往往这种时候，最先放松的人也最先会被收走。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

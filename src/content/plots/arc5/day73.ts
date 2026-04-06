import type { PlotScene } from '../../../types/plot';

export const day73Plots: Record<string, PlotScene> = {
  'day73_cutlery_count': {
    id: 'day73_cutlery_count',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今晚食堂提前把勺叉都收走了一批。留下的人只能拿着手里的那份发愣，因为谁都知道，明天有些人会突然吃上更像样的东西。',
    actions: [
      {
        id: 'd73_hide_utensil',
        label: '顺手留下一把',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 13);
          if (check.success) {
            ctx.game.flags.arc5_hidden_utensil = true;
            ctx.game.addLog('你把那点金属悄悄别进袖口。它未必有用，但在这种时候，能藏住一件东西本身就像还没被掏空。', 'warning');
          } else {
            ctx.game.player.stats.hp -= 6;
            ctx.game.addLog('你动作慢了一拍，指节立刻挨了一下。对方没多说，只把那把叉从你手边抽走。', 'danger');
          }
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd73_let_them_take',
        label: '看着他们收走',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你什么都没做。可那些被收走的碰撞声还是让你想到明天会有一张怎样的桌子。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

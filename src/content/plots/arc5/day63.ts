import type { PlotScene } from '../../../types/plot';

export const day63Plots: Record<string, PlotScene> = {
  'day63_marcus_invitation': {
    id: 'day63_marcus_invitation',
    locationId: 'hall_main',
    type: 'story',
    text: 'Marcus 这次没让跟班传话，而是亲自走到你面前。他把警棍搭在肩上，像在谈一件再自然不过的事：“人少了，桌子也该重新排一排。”',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed || ctx.game.flags.joined_marcus) {
        ctx.game.addLog('他看你的眼神不像在拉拢，更像在确认一件早该兑现的事。', 'warning');
      }
    },
    actions: [
      {
        id: 'd63_hear_marcus_out',
        label: '先听他说完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_marcus_offer = true;
          ctx.npcs.interact('marcus', 6, 6);
          ctx.game.addLog('Marcus 没提忠诚，只提位置、份额和谁能活着坐到最后。越是这样，越像真正的威胁。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd63_leave_marcus',
        label: '别在这里接他的话',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有当场表态。Marcus 也没拦你，只是那种不着急的样子更让人不舒服。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

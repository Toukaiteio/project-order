import type { PlotScene } from '../../../types/plot';

export const day32Plots: Record<string, PlotScene> = {
  'day32_winner_tax': {
    id: 'day32_winner_tax',
    locationId: 'hall_main',
    type: 'warning',
    text: '大屏幕今天公布了赛跑后的“优先配给名单”。活下来的人并没有得到奖励，反而被要求上交一部分口粮和额度，理由是“有能力者应承担更多贡献”。大厅里的骂声不大，但每一句都像蘸着血。',
    actions: [
      {
        id: 'd32_pay_tax',
        label: '把东西交出去',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          if (ctx.game.game.money >= 10) ctx.game.game.money -= 10;
          ctx.game.addLog('你把该交的东西递了出去。窗口后的人甚至没看你，只是把数字往下划了一笔。', 'warning');
          if (ctx.game.flags.arc3_marcus_owed) {
            ctx.game.addLog('Marcus 的人站在不远处看着，像是在确认你还记得自己欠过谁。', 'warning');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd32_hide_tax',
        label: '少交一点试试看',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 13);
          if (check.success) {
            ctx.game.flags.arc3_tax_hidden = true;
            if (ctx.game.flags.arc3_marcus_owed) ctx.npcs.interact('marcus', -4, -2);
            ctx.game.addLog('你趁着前面那人争吵的空当把一部分留了下来。轮到你离开时，后背已经湿透了。', 'info');
          } else {
            ctx.game.player.stats.hp -= 10;
            ctx.game.addLog('你刚想抽手，窗口里的电棍已经伸了出来。那一下打得你半边身子都麻了。', 'danger');
          }
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

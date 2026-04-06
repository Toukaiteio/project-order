import type { PlotScene } from '../../../types/plot';

export const day43Plots: Record<string, PlotScene> = {
  'day43_final_shortage': {
    id: 'day43_final_shortage',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今天的配给窗口只开了一半。队伍还没走完，窗口后的人就已经把挡板拉下，留下几十个人站在原地，像一群刚被集体抽空的影子。没人冲上去，因为每个人都看到了旁边那排已经充电完毕的电棍。',
    onEnter: (ctx) => {
      ctx.game.addLog('这已经不是短缺，而是在提前让一部分人学会习惯没有。', 'danger');
      if (ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 从帘子后面递出一个眼神，像是在数今天到底还会倒下几个。', 'warning');
      }
      if (ctx.game.flags.arc3_sasha_saved && ctx.game.game.hunger <= 35) {
        ctx.game.addLog('Sasha 悄悄把一小块掰碎的东西塞进你掌心，动作快得像怕自己下一秒就会后悔。', 'info');
        ctx.game.game.hunger = Math.min(100, ctx.game.game.hunger + 8);
      }
    },
    actions: [
      {
        id: 'd43_share_bite',
        label: '掰一点给旁边的人',
        timeCost: 0.5,
        variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          const ration = ctx.game.inventory.find((i: any) => i.id === 'ration');
          if (ration) {
            ration.quantity -= 1;
            if (ration.quantity <= 0) {
              const idx = ctx.game.inventory.findIndex((i: any) => i.id === 'ration');
              if (idx >= 0) ctx.game.inventory.splice(idx, 1);
            }
          }
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 2);
          ctx.game.addLog('你掰了一小块递过去。那人接住时没有道谢，只是很快地塞进嘴里，像怕自己下一秒就反悔。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd43_guard_yours',
        label: '把自己的东西收紧',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你把口粮护在怀里。旁边的人看了你一眼，又把目光慢慢移开。那一眼让你之后很久都吃不下去。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day17Plots: Record<string, PlotScene> = {
  'day17_thinner_bowls': {
    id: 'day17_thinner_bowls',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂今天比平时更安静。分发窗口后的人把碗一只只推出来，里面的糊状物稀得几乎能照见灯影。有人端着碗站了很久，像是不愿承认今天就只有这些。',
    onEnter: (ctx) => {
      ctx.game.addLog('前面的人回头看了一眼你手里的空托盘，那眼神像在估量什么。', 'danger');
    },
    actions: [
      {
        id: 'd17_guard_bowl',
        label: '端上碗就走',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你把碗护在胸前穿过人群。有人撞了你一下，但没把手伸得更深。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd17_trade_spoonful',
        label: '舀一点给旁边的人',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.npcs.interact('sasha', 4, 2);
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('对方接过去时没说谢，只是把碗抱得更紧。你自己的那份很快就见底了。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd17_count_empty_bowls',
        label: '先看清楚谁没有领到',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你记住了几只被推回窗口的空碗。今天没领到的人，明天多半还会站在这里。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

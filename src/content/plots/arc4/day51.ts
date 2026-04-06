import type { PlotScene } from '../../../types/plot';

export const day51Plots: Record<string, PlotScene> = {
  'day51_friend_or_witness': {
    id: 'day51_friend_or_witness',
    locationId: 'hall_main',
    type: 'story',
    text: '从今天开始，帮人和害人之间的距离忽然变得很短。你给谁递一句提醒、替谁挡一下视线、把谁的名字记在心里，都可能在之后被当成证词。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 走过你身边时，像随口一样说了句：“到时候，别站错边。”', 'warning');
      }
      if (ctx.game.flags.elena_allied) {
        ctx.game.addLog('Elena 抬笔在本子上停了一瞬，像是在等你自己决定要不要被她记进去。', 'warning');
      }
    },
    actions: [
      {
        id: 'd51_choose_witness',
        label: '先把该记的人记住',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_names_to_keep = true;
          ctx.game.addLog('你没有急着说话，只先把那几张今天不能丢掉的脸记进脑子里。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd51_avoid_eye_contact',
        label: '谁也别看太久',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你把视线压得很低。这样也许安全一点，可也像是在提前练习装作不认识任何人。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

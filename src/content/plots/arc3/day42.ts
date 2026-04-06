import type { PlotScene } from '../../../types/plot';

export const day42Plots: Record<string, PlotScene> = {
  'day42_reactor_hum': {
    id: 'day42_reactor_hum',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天连最迟钝的人都听见了那股声音。不是广播，不是风，也不是脚步，而是从地底深处一路爬上来的低鸣。它时强时弱，却一整天都没停过，像某种巨大的心脏已经开始供血不足。',
    actions: [
      {
        id: 'd42_follow_hum',
        label: '沿着声音走一段',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc3_reactor_direction = true;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你越往深处走，那股低鸣就越像在身体里共振。走到一半时，你已经分不清自己是听见了它，还是被它听见了。', 'danger');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd42_cover_ears',
        label: '别去细听',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你不想再让那声音钻进脑子里，可它还是会顺着地板和墙体一点点爬上来。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

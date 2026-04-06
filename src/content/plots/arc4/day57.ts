import type { PlotScene } from '../../../types/plot';

export const day57Plots: Record<string, PlotScene> = {
  'day57_route_rehearsal': {
    id: 'day57_route_rehearsal',
    locationId: 'hall_main',
    type: 'warning',
    text: '执行队今天没有抓人，只是在各区之间来回走了几遍。门开几秒、关几秒，哪边先堵、哪边好封，像是在演练一次还没开始的搬运。',
    onEnter: (ctx) => {
      ctx.game.addLog('没有人会把这称作预演，可每个人都看得出来它就是。', 'danger');
    },
    actions: [
      {
        id: 'd57_count_steps',
        label: '记他们走哪条线',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_purge_route_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你数着靴子声和门锁声，把这套路线记进脑子里。真正开始时，它们大概不会有太大区别。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd57_stay_out_of_view',
        label: '别让他们记住你的脸',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你始终站在看不清全脸的地方。这样很好，可也意味着你今晚什么都带不走。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

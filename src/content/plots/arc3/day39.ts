import type { PlotScene } from '../../../types/plot';

export const day39Plots: Record<string, PlotScene> = {
  'day39_quarantine_order': {
    id: 'day39_quarantine_order',
    locationId: 'hall_main',
    type: 'warning',
    text: '广播突然要求部分区域进入“静默隔离”。名单滚过屏幕时，许多人第一反应不是害怕，而是赶紧去确认自己还在不在公共区。门一扇扇锁上后，整座设施像被切成了好几块。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('有人从后面碰了你一下，把你往生活区那条线推了半步。你没回头，也知道那是谁的人。', 'warning');
      }
      if (ctx.game.flags.elena_allied) {
        ctx.game.addLog('Elena 远远朝你抬了抬下巴，示意你别站到最亮的地方去。', 'info');
      }
    },
    actions: [
      {
        id: 'd39_find_grey_gap',
        label: '去找监视盲点',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_blindspots_found = true;
          ctx.game.addLog('你沿着 Grey 以前提过的路线走了一遍，果然找到两处摄像头看不到的夹角。那地方很小，却让你久违地喘了口气。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd39_obey_line',
        label: '跟着人群进线内',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你跟着人群往划线内走，像一块被拨进格子里的石头。没人推你，可你还是觉得自己被挪了一下。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

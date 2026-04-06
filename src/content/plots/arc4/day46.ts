import type { PlotScene } from '../../../types/plot';

export const day46Plots: Record<string, PlotScene> = {
  'day46_after_blackout': {
    id: 'day46_after_blackout',
    locationId: 'hall_main',
    type: 'warning',
    text: '能源表决后的第二天，灯是亮着的，可每个人都像还没从黑暗里出来。大厅被重新划了线，谁该站哪边、谁能靠近哪张桌子，忽然都有人开始管。',
    onEnter: (ctx) => {
      if (ctx.game.flags.energy_allocation === 'order') {
        ctx.game.addLog('Marcus 的人开始在过道边站岗，像是这地方本来就该归他们管。', 'warning');
      }
      if (ctx.game.flags.energy_allocation === 'knowledge') {
        ctx.game.addLog('终端室门口多了两层锁。Satoshi 抬头看了你一眼，像在估算这点电还能换几天时间。', 'warning');
      }
      if (ctx.game.flags.energy_allocation === 'mercy') {
        ctx.game.addLog('医疗站外的人更多了。Aris 说话时已经不再抬头，像怕一抬头就要看到新的请求。', 'warning');
      }
    },
    actions: [
      {
        id: 'd46_watch_lines',
        label: '先看谁在画线',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_control_map = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没去争位置，只把谁在发话、谁在记名字先记了下来。到了现在，线从来不是画给地上的。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd46_keep_head_low',
        label: '先把自己缩进去',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你站到了最不显眼的地方。视线少了些，可那种被挑剩下的感觉并没有跟着少。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

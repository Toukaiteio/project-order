import type { PlotScene } from '../../../types/plot';

export const day24Plots: Record<string, PlotScene> = {
  'day24_corridor_shakedown': {
    id: 'day24_corridor_shakedown',
    locationId: 'corridor_a',
    type: 'warning',
    text: '夜里，走廊被临时拉起了铁栅。守卫和囚犯混在一起，一间间搜过去，专挑那些看起来还能挤出点东西的人下手。轮到你这边时，铁门外已经有人开始哭了。',
    actions: [
      {
        id: 'd24_hide_ration',
        label: '先把口粮藏起来',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.day15_food_hidden = true;
          ctx.game.flags.arc2_cache_kept = true;
          ctx.game.addLog('你把最要紧的东西分散塞进几处不起眼的角落。搜到你这里时，他们只找到了一堆不值钱的破烂。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd24_bribe_searchers',
        label: '递过去一点积分',
        timeCost: 0.5,
        variant: 'default',
        condition: (ctx) => ctx.game.game.money >= 15,
        effect: (ctx) => {
          ctx.game.game.money -= 15;
          ctx.game.flags.arc2_bribed_searchers = true;
          ctx.game.addLog('门外的人掂了掂你递过去的东西，什么也没说，敲了两下门框就走了。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd24_take_hit',
        label: '硬顶着让他们翻',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 12;
          ctx.game.player.stats.sanity -= 4;
          ctx.game.addLog('他们翻得很仔细，最后顺手给了你一脚，像是在提醒谁才有资格决定你还能留下什么。', 'danger');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  }
};

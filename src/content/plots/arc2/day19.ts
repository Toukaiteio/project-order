import type { PlotScene } from '../../../types/plot';

export const day19Plots: Record<string, PlotScene> = {
  'day19_preselection': {
    id: 'day19_preselection',
    locationId: 'corridor_a',
    type: 'warning',
    text: '走廊尽头临时立起了一道金属框。所有经过的人都要从那里慢慢走过去，守卫站在旁边看人抬腿、转肩、换气，像是在挑拣什么。轮到你时，后面的人群已经完全安静下来。',
    onEnter: (ctx) => {
      ctx.game.addLog('没有人说这是为了什么。可每个人都知道，今天被多看两眼，不会是好事。', 'danger');
    },
    actions: [
      {
        id: 'd19_walk_steady',
        label: '照常走过去',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有快，也没有慢。守卫的笔尖在纸上停了一下，才继续往下写。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd19_watch_others',
        label: '先站在一边看几轮',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.race_watchers_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你发现他们盯得最久的，不是最弱的人，而是那些还能跑、却已经快撑不住的人。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd19_fake_limp',
        label: '把步子放得更沉一点',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你装得不算明显，但从金属框下走过去时，还是觉得有一道视线停在你的膝盖上。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

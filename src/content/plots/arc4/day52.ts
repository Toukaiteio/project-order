import type { PlotScene } from '../../../types/plot';

export const day52Plots: Record<string, PlotScene> = {
  'day52_smoke_test': {
    id: 'day52_smoke_test',
    locationId: 'corridor_a',
    type: 'warning',
    text: '一段走廊今天突然被放了烟。不是火警，更像一次试验。守卫站在外面看着人群往哪边退、谁先被呛倒、谁知道去哪里找缝。',
    actions: [
      {
        id: 'd52_follow_gaps',
        label: '顺着缝隙摸出去',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_smoke_route = true;
          ctx.game.player.stats.dexterity += 1;
          ctx.game.addLog('你没往亮处挤，而是贴着墙和人群之间的空隙摸了出去。有人注意到了你的路。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd52_help_stumbler',
        label: '拽住旁边快倒的人',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 4;
          ctx.game.player.stats.sanity += 1;
          ctx.game.addLog('你把那人拖到了能喘气的地方，自己也跟着吸了几口更呛的烟。守卫看见了，但什么都没说。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

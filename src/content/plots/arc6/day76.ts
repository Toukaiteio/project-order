import type { PlotScene } from '../../../types/plot';

export const day76Plots: Record<string, PlotScene> = {
  'day76_blood_on_tiles': {
    id: 'day76_blood_on_tiles',
    locationId: 'hall_main',
    type: 'warning',
    text: '昨晚的血已经被拖过一遍，可地砖缝里还留着颜色。长桌撤掉以后，大厅显得更空，像是有人故意把热气和人味一起清掉了。',
    onEnter: (ctx) => {
      if (ctx.game.flags.marcus_defeated) {
        ctx.game.addLog('没有了 Marcus，空出来的不是安静，而是一种谁都想先踩进去的缺口。', 'warning');
      }
      if (ctx.game.flags.joined_marcus) {
        ctx.game.addLog('昨晚坐上那张桌子的人，今天都比别人更像被看着。', 'warning');
      }
    },
    actions: [
      {
        id: 'd76_trace_blood',
        label: '顺着痕迹看完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_blood_memory = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把拖痕一路看到门边，忽然明白这里总是先把结果擦掉，再让人接受过程。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd76_walk_over',
        label: '直接踩过去',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你没有绕开。鞋底沾到的那点黏滞感，之后很久都没散。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

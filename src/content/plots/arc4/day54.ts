import type { PlotScene } from '../../../types/plot';

export const day54Plots: Record<string, PlotScene> = {
  'day54_hidden_census': {
    id: 'day54_hidden_census',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天没有正式点名，可每一个区域都像在被重新数人。守卫不再问名字，只看脸、看腿、看谁跟谁坐在一起。',
    actions: [
      {
        id: 'd54_change_pattern',
        label: '今天换个坐法和路线',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_pattern_broken = true;
          ctx.game.addLog('你故意把今天走得和往常不一样。这样也许会更显眼，但至少不会显得太好算。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd54_stay_habitual',
        label: '照旧，别露慌',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你一切照旧。省事，可也像主动把自己交给别人总结成一张更完整的表。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

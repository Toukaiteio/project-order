import type { PlotScene } from '../../../types/plot';

export const day48Plots: Record<string, PlotScene> = {
  'day48_tagged_beds': {
    id: 'day48_tagged_beds',
    locationId: 'cell_01',
    type: 'warning',
    text: '一早回来时，你看见几间床位边缘被人做了记号。不是编号，也不是检查印章，更像是临时留下的取件标识。被记上的人今天都说得比平时更轻。',
    actions: [
      {
        id: 'd48_scrape_mark',
        label: '把记号刮掉',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc4_marks_scraped = true;
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你把边缘那点痕迹慢慢刮花，可你心里清楚，真正记住这些床位的从来不是漆。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd48_check_neighbors',
        label: '看看谁的床被碰过',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_marked_beds_known = true;
          ctx.game.addLog('你沿着床位看过去，忽然发现那些被做了记号的人，大多在最近几次名单里都排在后段。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  }
};

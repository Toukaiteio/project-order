import type { PlotScene } from '../../../types/plot';

export const day72Plots: Record<string, PlotScene> = {
  'day72_seating_rehearsal': {
    id: 'day72_seating_rehearsal',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅被搬进了一张长桌，但很快又被抬走了。没人解释，可所有人都看见了桌上大致留了几套餐具，哪边椅子高一点，哪边背后更靠近出口。',
    actions: [
      {
        id: 'd72_count_seats',
        label: '把座位数清楚',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_seat_count = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把位置数得很慢，最后只得到一个让人更不舒服的答案：那张桌子根本不是给大多数人准备的。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd72_watch_carriers',
        label: '看是谁在搬桌子',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc5_carriers_seen = true;
          ctx.game.addLog('你没看桌子，只看抬桌的人。真正重要的东西，通常总是先经过最沉默的手。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

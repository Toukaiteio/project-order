import type { PlotScene } from '../../../types/plot';

export const day47Plots: Record<string, PlotScene> = {
  'day47_hunt_notice': {
    id: 'day47_hunt_notice',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天的大屏幕只滚动一件事：资源贡献率将开始周审，连续落后者会被转入“再评估名单”。没人解释那是什么意思，因为已经不需要解释了。',
    onEnter: (ctx) => {
      ctx.game.addLog('大厅里安静得只剩翻纸声。你知道，从今天开始，很多人会被迫先盯住别人。', 'danger');
    },
    actions: [
      {
        id: 'd47_remember_faces',
        label: '记住谁先开始看人',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_watchers_marked = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('名单滚动时，有几张脸亮得比屏幕还快。你把那些反应先记下了。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd47_leave_before_end',
        label: '别把名单看完',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你在最后几页滚出来前先离开了。可没看到，不代表那几页上不会有你认识的人。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

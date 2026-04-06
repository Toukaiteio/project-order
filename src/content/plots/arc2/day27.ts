import type { PlotScene } from '../../../types/plot';

export const day27Plots: Record<string, PlotScene> = {
  'day27_screening_notice': {
    id: 'day27_screening_notice',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天的大屏幕没有播配给，而是反复播放一段新通知：第30天前，所有幸存者必须接受体能筛查。字迹闪烁得厉害，最后只剩下一行更大的红字：掉队者会被回收。',
    onEnter: (ctx) => {
      ctx.game.addLog('大厅里没人说话，但每个人都在看别人的腿、肩膀和脸色。', 'danger');
    },
    actions: [
      {
        id: 'd27_show_strength',
        label: '当场跑两圈给人看',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc2_ran_public = true;
          ctx.game.player.stats.hp -= 6;
          ctx.game.addLog('你强行让自己跑得很稳。有人因此移开了视线，也有人因此更认真地记住了你。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd27_leave_early',
        label: '趁大家盯着屏幕先离开',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc2_avoided_attention = true;
          ctx.game.addLog('你悄悄离开了大厅。少露一次脸，不代表危险就少一分，但至少今天没人能当场把你点出来。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

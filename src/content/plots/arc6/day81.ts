import type { PlotScene } from '../../../types/plot';

export const day81Plots: Record<string, PlotScene> = {
  'day81_selection_interviews': {
    id: 'day81_selection_interviews',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天开始有人被单独叫走，时间不长，回来后却都比去之前更安静。没有人说里面问了什么，可每个人都开始修正自己的站姿、语气和眼神。',
    actions: [
      {
        id: 'd81_watch_returns',
        label: '盯着回来的人看',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_interviews_seen = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你看见他们回来后先摸喉咙、再摸衣角，像是刚被要求把自己重新穿好。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd81_rehearse_self',
        label: '想一遍如果叫到自己',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc6_self_script = true;
          ctx.game.addLog('你在心里把可能的问题过了一遍。越往下想，越像在替别人写一份合格样本说明。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

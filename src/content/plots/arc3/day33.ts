import type { PlotScene } from '../../../types/plot';

export const day33Plots: Record<string, PlotScene> = {
  'day33_power_flicker': {
    id: 'day33_power_flicker',
    locationId: 'hall_main',
    type: 'story',
    text: '从今天开始，灯开始不规律地闪。不是之前那种局部接触不良，而像是整栋设施都在某种更深处喘不过气。每次熄灯的那几秒，所有人都会同时安静下来。',
    onEnter: (ctx) => {
      ctx.game.addLog('你第一次认真听见了墙体深处传来的低沉震动，像有什么巨大的东西正在勉强运转。', 'warning');
    },
    actions: [
      {
        id: 'd33_count_flicker',
        label: '站着听完一轮闪灭',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_power_pattern = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把灯灭与亮起之间的间隔默默记了下来。它不是随机的，像是谁在用电力给整座设施分层呼吸。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd33_move_on',
        label: '别站在这儿发呆',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你强迫自己继续走路，可身体还是会在每次熄灯时下意识绷紧。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

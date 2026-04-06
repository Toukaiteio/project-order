import type { PlotScene } from '../../../types/plot';

export const day37Plots: Record<string, PlotScene> = {
  'day37_false_sun': {
    id: 'day37_false_sun',
    locationId: 'hall_main',
    type: 'story',
    text: '为了安抚情绪，设施今天把顶部整片照明调成了近似日光的暖白色。很多人抬头看了很久，像是真的在确认那是不是太阳。可这种温柔只持续了不到半小时，随后灯光又重新冷了下去。',
    actions: [
      {
        id: 'd37_stare_false_sun',
        label: '站着把它看完',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你盯着那片假太阳，心里反而更空。有人在你旁边轻声哭了出来。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd37_leave_light',
        label: '趁亮着先走',
        timeCost: 0.25,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('你没有浪费这点亮光。走廊在这种光线下显得异常陌生，像是另一个你从没见过的地方。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

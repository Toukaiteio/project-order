import type { PlotScene } from '../../../types/plot';

export const day38Plots: Record<string, PlotScene> = {
  'day38_air_thin': {
    id: 'day38_air_thin',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天的空气明显更薄。你一开口就觉得嗓子发干，走快一点胸口就有点刺痛。起初大家还在互相怀疑是不是自己太累，直到连广播里的女声都比平时更轻，才没人再装作没发现预。',
    actions: [
      {
        id: 'd38_breathe_shallow',
        label: '压着呼吸慢下来',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_air_control = true;
          ctx.game.addLog('你试着把每一次呼吸都放浅一点。动作难看，但胸口那股针扎似的疼总算轻了些。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd38_push_through',
        label: '假装一切正常',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 6;
          ctx.game.addLog('你硬撑着不肯慢下来，直到眼前发黑了一瞬，才意识到身体并不打算配合你的嘴硬。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

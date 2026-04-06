import type { PlotScene } from '../../../types/plot';

export const day69Plots: Record<string, PlotScene> = {
  'day69_inner_circle': {
    id: 'day69_inner_circle',
    locationId: 'hall_main',
    type: 'warning',
    text: 'Marcus 的人开始明显地分圈。站得近的人能先听到消息，站得远的人只能先看到结果。圈子不大，却像一块正在慢慢收紧的金属箍。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc5_marcus_offer || ctx.game.flags.joined_marcus) {
        ctx.game.addLog('有人特意给你留了半步的位置。留得不多，却足够让旁边的人都看见。', 'warning');
      }
    },
    actions: [
      {
        id: 'd69_step_in',
        label: '先站进去试一试',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc5_inner_circle_seen = true;
          ctx.npcs.interact('marcus', 8, 6);
          ctx.game.addLog('你往前站了半步，立刻感到几道视线一起压过来。圈子里从来不缺位置，缺的是代价。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd69_stay_edge',
        label: '待在外圈看着',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_outer_ring = true;
          ctx.game.addLog('你没有往里站。站在边缘虽然难受，但至少还能看清谁在把别人往里推。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

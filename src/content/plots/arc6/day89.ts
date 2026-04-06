import type { PlotScene } from '../../../types/plot';

export const day89Plots: Record<string, PlotScene> = {
  'day89_final_night': {
    id: 'day89_final_night',
    locationId: 'hall_main',
    type: 'warning',
    text: '第89天的夜里，设施第一次像真正快结束了。没有额外广播，没有突然点名，连巡逻都少了一轮。可正因为这样，整个夜晚都像在被谁憋着最后一口气。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬过最后一夜，准备迎接第90天');
      if (ctx.game.flags.grey_d45_done) {
        ctx.game.addLog('Grey 留下的坐标和今晚的安静叠在一起，让人很难不去想它是不是终于要有用了。', 'warning');
      }
      if (ctx.game.flags.termination_protocol_draft || ctx.game.inventory.some((i: any) => i.id === 'termination_protocol_draft')) {
        ctx.game.addLog('那份终止协议像一块压在胸口的冷铁。你知道明天不只是“出去”那么简单。', 'warning');
      }
    },
    actions: [
      {
        id: 'd89_choose_truth',
        label: '今晚把知道的事串起来',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_truth_faced = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你第一次不再把这些线索分开看。实验、继承、门、样本和幸存，全都被你硬拉成了一条线。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd89_hold_breath',
        label: '什么都别想，先活到明早',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你强迫自己不去想门外。可越不想，越像整个设施都在替你想。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

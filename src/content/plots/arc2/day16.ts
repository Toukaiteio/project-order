import type { PlotScene } from '../../../types/plot';

export const day16Plots: Record<string, PlotScene> = {
  'day16_vote_aftertaste': {
    id: 'day16_vote_aftertaste',
    locationId: 'hall_main',
    type: 'warning',
    text: (ctx) => {
      if (ctx.game.flags.voted_marcus) {
        return '投票后的第二天，大厅里安静得反常。昨晚被带走的那个人的铺位已经空了，Marcus 的人却比平时更多地站在灯下。你一走近，他们的视线就短促地停在你脸上，然后挪开。';
      }
      if (ctx.game.flags.voted_elena) {
        return '大厅的告示板前挤着一圈人。Elena 的名字还挂在上面，只是旁边多了一列新添的备注。她站得不远，像没看见任何人朝她指过去的手。';
      }
      return '昨晚那场投票像是把什么东西彻底做实了。大厅里的人说话都更轻，挪动脚步时也会先看一眼四周。被点过名的人留下来的空位还没有补上。';
    },
    onEnter: (ctx) => {
      ctx.game.addLog('没有人提起昨晚被带走的是谁。像是只要不说出口，那张脸就可以快一点从这里消失。', 'warning');
    },
    actions: [
      {
        id: 'd16_keep_head_down',
        label: '低着头从人群里穿过去',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有停下。可等你走出那片灯光时，背上的那点发紧感还在。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd16_watch_board',
        label: '在告示板前多站一会儿',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('新贴上去的纸页里多了几项手写更正。名字后面的空格比昨天多，字却更少。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

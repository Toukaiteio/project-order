import type { PlotScene } from '../../../types/plot';

export const day58Plots: Record<string, PlotScene> = {
  'day58_lock_test': {
    id: 'day58_lock_test',
    locationId: 'cell_01',
    type: 'warning',
    text: '半夜，整排门锁突然一起落了一次，又很快弹开。没人出来骂，也没人拍门，因为所有人都知道这不是故障，是在确认哪一扇门还关得住人。',
    actions: [
      {
        id: 'd58_test_door',
        label: '摸一把门缝和锁舌',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_door_timing = true;
          ctx.game.addLog('你在黑里摸到锁舌回弹的节奏。它快得不近人情，但还是有一点点能被记住的迟滞。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd58_wait_in_dark',
        label: '一动不动等过去',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你没有靠近门。可那一下落锁声还是让你的胃跟着缩了一下。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  }
};

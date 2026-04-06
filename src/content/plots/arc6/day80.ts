import type { PlotScene } from '../../../types/plot';

export const day80Plots: Record<string, PlotScene> = {
  'day80_last_medicine': {
    id: 'day80_last_medicine',
    locationId: 'med_bay',
    type: 'story',
    text: 'Aris把剩下的药分成了更小的几堆。不是为了公平，而是因为剩到今天，已经没人敢假装还够。每一份都像从明天硬抠出来的。',
    onEnter: (ctx) => {
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 的眼睛红得厉害，却还是在把瓶子排得整整齐齐。像只要顺序还在，人就还没散。', 'warning');
      }
    },
    actions: [
      {
        id: 'd80_take_aris_advice',
        label: '听他说该留给谁',
        timeCost: 0.75,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.aris_saved === true,
        effect: (ctx) => {
          ctx.game.flags.arc6_aris_priorities = true;
          ctx.npcs.interact('aris', 8, 8);
          ctx.game.addLog('Aris 没再讲仁慈，只讲谁还能走、谁能不能撑到门开。你第一次听他这样说话。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd80_leave_medicine',
        label: '别在这里分心',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有插手。如今每一份药都带着脸，碰一下就像碰到某个人的明天。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  }
};

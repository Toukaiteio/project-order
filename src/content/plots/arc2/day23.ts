import type { PlotScene } from '../../../types/plot';

export const day23Plots: Record<string, PlotScene> = {
  'day23_infirmary_overflow': {
    id: 'day23_infirmary_overflow',
    locationId: 'med_bay',
    type: 'story',
    text: '医疗站外排起了长队。有人扶着墙，有人坐在地上，还有人只是木然地捂着肚子。帘子后面不断传出呕吐和咳嗽声，空气里全是消毒水也盖不住的酸腐味。',
    onEnter: (ctx) => {
      ctx.game.addLog('Aris 的桌上堆着空瓶子。你忽然意识到，这地方最先不够用的从来不是床位。', 'warning');
    },
    actions: [
      {
        id: 'd23_help_aris',
        label: '帮 Aris 压住场面',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.npcs.interact('aris', 12, 12);
          ctx.game.flags.arc2_aris_helped = true;
          ctx.game.addLog('Aris 没空道谢，只在你转身时低声说了一句："跑之前别空腹。"他像是在提醒，也像是在自言自语。', 'info');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd23_watch_symptoms',
        label: '站在一边观察',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc2_body_limit_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你注意到倒下去的人并不都是伤得最重的。更多是那些空着肚子硬撑的人。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  }
};

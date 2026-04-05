import type { PlotScene } from '../../types/plot';

export const systemPlots: Record<string, PlotScene> = {
  'rest_menu': {
    id: 'rest_menu',
    locationId: 'any',
    type: 'story',
    text: '你需要休息多久？在这里睡觉并不安全，但你的身体已经发出了警告。',
    actions: [
      { id: 'rest_2h', label: '短睡 (2小时)', timeCost: 2.0, variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 10);
          ctx.game.addLog('你进行了一次短促的睡眠，稍微恢复了精力。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}` as any
      },
      { id: 'rest_4h', label: '深度睡眠 (4小时)', timeCost: 4.0, variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 25);
          ctx.game.addLog('你沉沉地睡了4个小时，感觉好多了。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}` as any
      },
      { id: 'rest_8h', label: '长效修整 (8小时)', timeCost: 8.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 60);
          ctx.game.player.stats.hp = Math.min(ctx.game.player.stats.maxHp, ctx.game.player.stats.hp + 10);
          ctx.game.addLog('这是一场奢侈的睡眠。你的理智和体力都得到了显著恢复。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}` as any
      },
      { id: 'rest_cancel', label: '还是算了', timeCost: 0.1, variant: 'default',
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}` as any
      }
    ]
  }
};

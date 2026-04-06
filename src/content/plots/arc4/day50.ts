import type { PlotScene } from '../../../types/plot';

export const day50Plots: Record<string, PlotScene> = {
  'day50_supply_frisk': {
    id: 'day50_supply_frisk',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今天发配给前，每个人都被要求张开手、掀开衣角、把口袋翻出来。检查的人不多，但看得很仔细，像在挑谁还藏得起一点明天。',
    onEnter: (ctx) => {
      ctx.game.addLog('队伍比平时安静得多。有人连吞咽都显得小心，像怕把什么声音露出来。', 'warning');
    },
    actions: [
      {
        id: 'd50_empty_pockets',
        label: '把手全摊开',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你什么都没藏。检查你的人看得久了一点，像是在怀疑这份坦白是不是装出来的。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd50_hide_better',
        label: '先挪掉最要紧的东西',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 14);
          if (check.success) {
            ctx.game.flags.arc4_cache_secured = true;
            ctx.game.addLog('你在排队前就把最要紧的那点东西分开塞好了。轮到你时，他们只翻出一些不值一提的零碎。', 'info');
          } else {
            ctx.game.player.stats.hp -= 8;
            ctx.game.addLog('你还没来得及收好，手背就被电棍末端敲了一下。那人没多说，只把视线在你身上停得更久。', 'danger');
          }
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day28Plots: Record<string, PlotScene> = {
  'day28_qualifier_run': {
    id: 'day28_qualifier_run',
    locationId: 'corridor_a',
    type: 'story',
    text: '几名守卫临时清空了半条走廊，让幸存者挨个跑过去。不是正式游戏，更像是在提前挑出谁会在第30天拖后腿。跑到尽头的人大多弯下腰咳嗽，很少有人能装得若无其事。',
    actions: [
      {
        id: 'd28_run_clean',
        label: '跟着他们跑完',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(Math.max(ctx.game.player.stats.strength, ctx.game.player.stats.dexterity), 14);
          if (check.success) {
            ctx.game.flags.race_confidence = true;
            ctx.game.addLog('你没有冲得太猛，只让自己看起来足够稳。守卫在表上勾了一笔，没再多看你。', 'info');
          } else {
            ctx.game.player.stats.hp -= 10;
            ctx.game.addLog('你跑到最后一段时脚下发软，几乎当场跪下去。那几个守卫看你的眼神，像是在提前给你编号。', 'danger');
          }
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd28_fake_limp',
        label: '故意装得更虚弱些',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc2_fake_weak = true;
          ctx.game.addLog('你把呼吸放乱，步子也拖得更沉。这样做能不能避开视线，你自己都不确定。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

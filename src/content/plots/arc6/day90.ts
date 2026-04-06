import type { PlotScene } from '../../../types/plot';

export const day90Plots: Record<string, PlotScene> = {
  'grand_finale': {
    id: 'grand_finale',
    locationId: 'hall_main',
    type: 'warning',
    text: '第90天。“秩序之眼”实验结束。通往地表的巨大钢铁闸门缓缓升起，刺眼的强光射入了大厅。',
    onEnter: (ctx) => {
      ctx.game.addLog('这是最后的审判。你的属性、理智以及做过的所有选择将决定你的终局。', 'danger');
    },
    actions: [
      {
        id: 'step_into_light',
        label: '走向出口 (判定结局)',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          const stats = ctx.game.player.stats;
          const flags = ctx.game.flags;

          // 优先级顺序：vessel > order > elena > true_mobius > marcus_slayer > salvation > lone_wolf
          if (stats.sanity <= 0) {
            ctx.game.flags.finale_ending = 'end_vessel';
          } else if (flags.joined_marcus) {
            ctx.game.flags.finale_ending = 'end_order';
          } else if (flags.elena_allied && stats.intelligence >= 55) {
            ctx.game.flags.finale_ending = 'end_elena';
          } else if (stats.intelligence >= 60 && stats.sanity < 30 && flags.satoshi_allied) {
            ctx.game.flags.finale_ending = 'end_true_mobius';
          } else if (flags.marcus_defeated) {
            ctx.game.flags.finale_ending = 'end_marcus_slayer';
          } else if (flags.sasha_saved && flags.aris_saved && stats.intelligence >= 50) {
            ctx.game.flags.finale_ending = 'end_salvation';
          } else {
            ctx.game.flags.finale_ending = 'end_lone_wolf';
          }
        },
        nextSceneId: 'finale_resolution'
      }
    ]
  },
  'finale_resolution': {
    id: 'finale_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      const end = ctx.game.flags.finale_ending;
      if (end === 'end_vessel') {
        return '【结局 06: 容器】你的心智已完全崩塌。门外的白衣人将你抬上了担架，你的身体将作为下一个实验体的培养皿。';
      }
      if (end === 'end_order') {
        return '【结局 05: 新秩序】你走出了闸门，成为了”秩序之眼”的一名底层管理者。你活了下来，但你的双手沾满了同伴的鲜血。';
      }
      if (end === 'end_elena') {
        return '【结局 04: 数据的继承者】Elena 带走了她收集的全部实验档案。在黑暗的档案室里，你成为了唯一的见证人。这些数据，现在掌握在你们手中。\n”秩序之眼已关闭。但下一只眼睛，”她说，”已经睁开了。”';
      }
      if (end === 'end_true_mobius') {
        return '【真结局: 莫比乌斯环】极高的智力和濒临崩溃的理智让你看到了世界的真实——闸门之外，是一个更大的、布满摄像头的穹顶。这只是第一层筛选。\n你抬起头。天幕上的”眼睛”，正在俯视你。';
      }
      if (end === 'end_marcus_slayer') {
        return '【结局 03: 弑王者】你亲手打倒了秩序的象征。走向出口时，你的步伐比所有人都沉重。\n你活了下来。但在活下来的过程中，你也成为了某种怪物。';
      }
      if (end === 'end_salvation') {
        return '【结局 02: 薪火】你带着幸存的伙伴们走出了地狱。你们的相互扶持证明了人类基因中仍有未被抹除的闪光点。\n地表上有风。第一次，你们呼吸到了不是机器循环过的空气。';
      }
      return '【结局 01: 自由的幽灵】你独自一人踏入了荒芜的地表世界。你活下来了，但留给你的只有永恒的孤独。\n也许，这就是自由的代价。';
    },
    actions: [
      {
        id: 'game_over',
        label: '【实验结束】',
        timeCost: 0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('感谢游玩 PROJECT ORDER。', 'info');
        }
      }
    ]
  }
};

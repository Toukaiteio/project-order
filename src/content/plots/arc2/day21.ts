import type { PlotScene } from '../../../types/plot';

export const day21Plots: Record<string, PlotScene> = {
  'day21_ration_audit': {
    id: 'day21_ration_audit',
    locationId: 'hall_main',
    type: 'warning',
    text: '配给站前立起了一块新屏幕，开始逐个显示每个人近五天的领取记录。每报出一个编号，周围就会有几个人下意识地抬头看一眼。轮到你时，空气安静得很不自然。',
    onEnter: (ctx) => {
      ctx.game.addLog('原来他们不只是发放口粮，也在统计谁快撑不住了。', 'danger');
    },
    actions: [
      {
        id: 'd21_keep_face',
        label: '站着别动',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc2_audit_seen = true;
          ctx.game.addLog('你没有露出任何反应。但你知道，从今天开始，别人会记得你的名字是出现在这块屏幕上的。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd21_mark_watchers',
        label: '记住谁在看你',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc2_audit_seen = true;
          ctx.game.flags.race_watchers_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没有看屏幕，而是在看人。比起名单本身，谁在名单亮起时露出兴趣更值得记住。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

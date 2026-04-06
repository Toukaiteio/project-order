import type { PlotScene } from '../../../types/plot';

export const day31Plots: Record<string, PlotScene> = {
  'day31_recovery_triage': {
    id: 'day31_recovery_triage',
    locationId: 'med_bay',
    type: 'warning',
    text: '赛跑后的第二天，医疗站门口躺满了人。有人腿在抖，有人咳得弯下腰去，更多的人只是安静地盯着天花板。Aris 的袖口沾着没洗干净的血，连说话都像在压着火气。',
    onEnter: (ctx) => {
      ctx.game.addLog('终点线把人分出了先后，也把后遗症一并留了下来。', 'warning');
      if (ctx.game.flags.arc3_sasha_saved) {
        ctx.game.addLog('Sasha 站在门边，手背上还留着擦伤。她没敢看你，只是在你经过时往旁边让了一步。', 'info');
      }
      if (ctx.game.flags.arc3_marcus_paid_once) {
        ctx.game.addLog('有人替你活下来的消息已经传开了。几道目光落在你身上时，像在盘算这笔人情什么时候收。', 'warning');
      }
    },
    actions: [
      {
        id: 'd31_help_triage',
        label: '替他扶住下一个人',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.npcs.interact('aris', 10, 10);
          ctx.game.flags.arc3_aris_debt = true;
          ctx.game.addLog('Aris 没抬头，只说了句：“把还能站的放后面，先救快断气的。”你照做以后才发现，自己竟已经开始习惯这种排序。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd31_search_for_name',
        label: '在人堆里找熟人的脸',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 4;
          ctx.game.addLog('你一张张看过去，幸好没有看到最不想看到的人。但这份侥幸本身也让你心里发冷。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  }
};

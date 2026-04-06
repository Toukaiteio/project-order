import type { PlotScene } from '../../../types/plot';

export const day44Plots: Record<string, PlotScene> = {
  'day44_vote_warning': {
    id: 'day44_vote_warning',
    locationId: 'hall_main',
    type: 'warning',
    text: '傍晚时，所有屏幕同时亮起。上面没有解释，没有倒计时，只滚动着一行不断重复的字：明日进行能源分配表决，请各扇区提前准备。大厅里先是死寂，随后才有一阵很轻很乱的低语慢慢散开。',
    onEnter: (ctx) => {
      ctx.game.setObjective('在明天之前，决定你打算让谁先活');
      ctx.game.addLog('你忽然明白，之前那些缩减、熄灯和封锁从来不是偶发故障，而是在把所有人推到这一刻。', 'danger');
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 今晚没有来找你。正因为他没来，才更像在等你自己把账送上门。', 'warning');
      }
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 把那份文件按在臂弯里，看你的时候像已经在提前记录你明天会站在哪边。', 'warning');
      }
    },
    actions: [
      {
        id: 'd44_find_allies',
        label: '今晚先去见该见的人',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_final_alignment = true;
          ctx.game.addLog('你没有停在屏幕前，而是立刻转身去找人。真到了明天，很多决定就不会再有时间慢慢想。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd44_stay_screen',
        label: '站着把那行字看完',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('那行字一遍遍滚过去，你却总觉得自己每次看到的都和上一遍不太一样。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

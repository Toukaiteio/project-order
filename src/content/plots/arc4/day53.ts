import type { PlotScene } from '../../../types/plot';

export const day53Plots: Record<string, PlotScene> = {
  'day53_quiet_transfer': {
    id: 'day53_quiet_transfer',
    locationId: 'med_bay',
    type: 'warning',
    text: '医疗站今晚少了两张脸，多了三份空表。没有人问去哪了，Aris 也没有解释，只是一张张把表翻过去，像是在把人从纸上先处理掉。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 在你靠近时停了一下，低声说：“从现在开始，空床比病人更危险。”', 'warning');
      }
    },
    actions: [
      {
        id: 'd53_read_forms',
        label: '看清那些空表',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_blank_forms = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('那些表上没有病名，只有编号、时间和转运栏。你忽然明白，很多人是在死之前先被归类。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd53_leave_aris_work',
        label: '别在这时候逼他开口',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你什么都没问。Aris 也什么都没留你。如今沉默已经成了这里最常见的保护方式。', 'info');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  }
};

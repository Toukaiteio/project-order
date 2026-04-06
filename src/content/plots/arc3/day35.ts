import type { PlotScene } from '../../../types/plot';

export const day35Plots: Record<string, PlotScene> = {
  'day35_terminal_whisper': {
    id: 'day35_terminal_whisper',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 把终端音量调到了几乎听不见的程度，绿色波纹在破旧屏幕上轻轻抖动。他把耳机递给你时，手指一直在抖，像是刚听到了不该听的内容。',
    actions: [
      {
        id: 'd35_listen_static',
        label: '把耳机戴上',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc3_terminal_audio = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('噪音里夹着一句断断续续的话：“非关键扇区可进入间歇供电……优先保留样本通道。” Satoshi 低声骂了一句，然后把电源拔掉了。', 'danger');
          if (ctx.game.flags.elena_quest_complete) {
            ctx.game.addLog('你忽然明白 Elena 为什么执意要那份数据。终端里说的“样本通道”，和她文件里的阈值不是两回事。', 'warning');
          }
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd35_refuse_audio',
        label: '别再听了',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你让他把耳机收起来。不是因为不想知道，而是你开始怀疑知道和活下去到底哪边更贵。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day49Plots: Record<string, PlotScene> = {
  'day49_whisper_network': {
    id: 'day49_whisper_network',
    locationId: 'corridor_a',
    type: 'story',
    text: '走廊里开始有人专门低声报消息。不是帮人，是换债。谁昨晚被叫走、谁今天没领到配给、谁和执行队说过话，这些名字在墙边和拐角一层层传开。',
    onEnter: (ctx) => {
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 递给你半页撕下来的纸，只写着几个名字和时间。她一句解释都没有。', 'info');
      }
    },
    actions: [
      {
        id: 'd49_listen_network',
        label: '站着把消息听全',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_whisper_network = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没插话，只把这些碎消息在脑子里拼成了一张更糟的图。有人已经开始为清洗提前点名。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd49_trade_own_info',
        label: '拿一点自己的见闻换',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc4_owed_whisper = true;
          ctx.game.addLog('你递出去一条不算致命的消息，换回来另一条更重要的。这里的嘴，已经越来越像另一种市场。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

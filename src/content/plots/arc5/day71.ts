import type { PlotScene } from '../../../types/plot';

export const day71Plots: Record<string, PlotScene> = {
  'day71_broker_last_prices': {
    id: 'day71_broker_last_prices',
    locationId: 'warehouse_back',
    type: 'story',
    text: '掮客今天把价牌都翻了一面。不是涨价，而是不再写价格，只写“最后一批”“只换不卖”“有命再来”。他看见你时笑了一下，像早就知道这地方快没生意可做了。',
    actions: [
      {
        id: 'd71_ask_broker_why',
        label: '问他在怕什么',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_broker_warning = true;
          ctx.game.addLog('掮客把烟灰弹进空罐头里，只说了一句：“不是我怕，是有些桌子开始只给固定的人留座。”转他说。', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      {
        id: 'd71_buy_silence',
        label: '什么都别问，先换东西',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          if (ctx.game.game.money >= 15) {
            ctx.game.game.money -= 15;
            ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '硬得像石头，但能续命。', icon: 'package', quantity: 1, category: 'consumable' });
            ctx.game.addLog('你没追问，只先把能拿到手的东西拿了。现在会先闭嘴的人，通常也更能活。', 'info');
          } else {
            ctx.game.addLog('你摸了摸空掉的口袋，最后还是什么都没换到。', 'warning');
          }
        },
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  }
};

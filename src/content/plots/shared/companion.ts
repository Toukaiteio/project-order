import type { PlotScene } from '../../../types/plot';

export const companionPlots: Record<string, PlotScene> = {
  'companion_intro': {
    id: 'companion_intro',
    locationId: 'cell_01',
    type: 'story',
    text: '当你拖着疲惫的身躯回到牢房时，惊讶地发现阴影里坐着一个人。他裹着一件宽大的灰色连帽衫，抬头看了你一眼，眼神清澈而深邃。“你终于回来了。我观察你很久了，你是这段时间里唯一一个还没疯掉的人。”',
    onEnter: (ctx) => {
      ctx.game.flags.companion_met = true;
      ctx.game.setObjective('听听这个陌生人想说什么');
    },
    actions: [
      { id: 'ask_identity', label: '询问他的身份', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('“叫我‘灰’(Grey)就好。在这个地方，名字只是个代号。我是来帮你的，或者说……互相帮衬。”', 'info');
        },
        nextSceneId: 'companion_talk_01'
      }
    ]
  },
  'companion_talk_01': {
    id: 'companion_talk_01',
    locationId: 'cell_01',
    type: 'story',
    text: '“听着，接下来的 90 天会比你想象的更残酷。不仅仅是饥饿，还有那些白大褂在进行的‘筛选’。”灰压低了声音，“我会教你如何在墙缝里生存。如果你愿意相信我，就从锻炼你的体魄开始。”',
    actions: [
      { id: 'accept_companion', label: '选择相信他', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          // 此时才真正出现在地图上并标记为已见过
          ctx.npcs.npcs['grey'].location = 'cell_01';
          ctx.npcs.npcs['grey'].met = true;
          ctx.game.addLog('灰露出了一个淡淡的微笑。“明智的选择。我会经常在这一带转悠，有麻烦可以找我。”', 'info');
          ctx.game.setObjective('利用牢房设施锻炼，活到下一次淘汰');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  // --- 交易 NPC: 掮客 (The Broker) ---
  'shop_broker': {
    id: 'shop_broker',
    locationId: 'warehouse_back',
    type: 'story',
    text: '掮客坐在一堆板箱上，吸着一支不知名的土烟。“只要你有积分，或者等值的玩意儿，我这儿什么都有。既然是新面孔，我给你开个‘友情价’。”',
    actions: [
      { id: 'buy_ration', label: (ctx) => `购买口粮 (成本: ${ctx.game.flags.broker_discount ? 15 : 20} 积分)`, timeCost: 0.25, variant: 'default',
        condition: (ctx) => ctx.game.game.money >= (ctx.game.flags.broker_discount ? 15 : 20),
        effect: (ctx) => {
          const price = ctx.game.flags.broker_discount ? 15 : 20;
          ctx.game.game.money -= price;
          ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '虽然贵，但能救命。', icon: 'package', quantity: 1, category: 'consumable' });
          ctx.game.addLog('交易完成。', 'info');
        },
        nextSceneId: 'shop_broker'
      },
      { id: 'buy_bandage', label: (ctx) => `购买绷带 (成本: ${ctx.game.flags.broker_discount ? 25 : 35} 积分)`, timeCost: 0.25, variant: 'default',
        condition: (ctx) => ctx.game.game.money >= (ctx.game.flags.broker_discount ? 25 : 35),
        effect: (ctx) => {
          const price = ctx.game.flags.broker_discount ? 25 : 35;
          ctx.game.game.money -= price;
          ctx.game.inventory.push({ id: 'bandage', name: '简陋绷带', description: '回复 20 点生命值。', icon: 'plus', quantity: 1, category: 'consumable' });
          ctx.game.addLog('交易完成。', 'info');
        },
        nextSceneId: 'shop_broker'
      },
      { id: 'leave_shop', label: '离开商店', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_warehouse_back' }
    ]
  }
};

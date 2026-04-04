import type { PlotScene } from '../../types/plot';

export const encounterPlots: Record<string, PlotScene> = {
  'encounter_elena_hall': {
    id: 'encounter_elena_hall',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      const npc = ctx.npcs.npcs['elena'];
      return `在大厅的阴影角落里，你看到了 ${npc.name}。她正聚精会神地盯着走廊尽头的感应头，手里快速记着什么。察觉到你的靠近，她冷淡地收起了笔记本。`;
    },
    actions: [
      { 
        id: 'elena_ask_plan', label: '询问她在做什么', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.npcs.interact('elena', 5, 2);
          ctx.game.addLog('“我在计算死亡的概率，”她面无表情地回答，“顺便看看谁会是下一个被送进‘回收槽’的倒霉蛋。”', 'story');
        },
        nextSceneId: 'explore_hall' // 回到通用探索
      },
      { 
        id: 'elena_offer_help', label: '提供协作', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 6,
        effect: (ctx) => {
          ctx.npcs.interact('elena', 15, 10);
          ctx.game.flags.elena_allied = true;
          ctx.game.addLog('她审视了你一会儿。“你的眼神还没死透。也许我们能达成某种共识。”', 'info');
        },
        nextSceneId: 'explore_hall'
      }
    ]
  },
  'encounter_marcus_corridor': {
    id: 'encounter_marcus_corridor',
    locationId: 'corridor_a',
    type: 'warning',
    text: 'Marcus T. 魁梧的身影挡住了去路。他正在擦拭一根沉重的金属警棍，周围的空气似乎都凝固了。',
    actions: [
      { 
        id: 'marcus_pay_toll', label: '交出一些配给额度 (支付钱财)', timeCost: 0.25, variant: 'default',
        condition: (ctx) => ctx.game.game.money >= 10,
        effect: (ctx) => {
          ctx.game.game.money -= 10;
          ctx.npcs.interact('marcus', 10, 5);
          ctx.game.addLog('他接过额度卡，露出了一个令人不安的笑容。“聪明人的选择。现在，路是你的了。”', 'info');
        },
        nextSceneId: 'explore_corridor'
      },
      { 
        id: 'marcus_confront', label: '强行通过', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.npcs.interact('marcus', -20, 0);
          ctx.game.player.stats.hp -= 15;
          ctx.game.addLog('他没有说话，直接给了你一棍。剧痛从腹部蔓延，你只能狼狈地退后。', 'warning');
        },
        nextSceneId: 'explore_corridor'
      }
    ]
  }
  // ... 更多偶遇可在此持续添加
};

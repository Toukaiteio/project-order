import type { PlotScene } from '../../types/plot';

export const encounterPlots: Record<string, PlotScene> = {
  // --- Elena V. Encounters ---
  'encounter_elena_hall_main': {
    id: 'encounter_elena_hall_main',
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
        nextSceneId: 'explore_hall_main' 
      },
      { 
        id: 'elena_offer_help', label: '提供协作', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 6,
        effect: (ctx) => {
          ctx.npcs.interact('elena', 15, 10);
          ctx.game.flags.elena_allied = true;
          ctx.game.addLog('她审视了你一会儿。“你的眼神还没死透。也许我们能达成某种共识。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  // --- Marcus T. Encounters ---
  'encounter_marcus_corridor_a': {
    id: 'encounter_marcus_corridor_a',
    locationId: 'corridor_a',
    type: 'warning',
    text: 'Marcus T. 魁梧的身影挡住了去路。他正在擦拭一根沉重的金属警棍，周围的空气似乎都凝固了。',
    actions: [
      { 
        id: 'marcus_pay_toll', label: '交出一些积分 (10点)', timeCost: 0.25, variant: 'default',
        condition: (ctx) => ctx.game.game.money >= 10,
        effect: (ctx) => {
          ctx.game.game.money -= 10;
          ctx.npcs.interact('marcus', 10, 5);
          ctx.game.addLog('他接过额度卡，露出了一个令人不安的笑容。“聪明人的选择。现在，路是你的了。”', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      },
      { 
        id: 'marcus_confront', label: '强行通过', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.npcs.interact('marcus', -20, 0);
          ctx.game.player.stats.hp -= 15;
          ctx.game.addLog('他没有说话，直接给了你一棍。剧痛从腹部蔓延，你只能狼狈地退后。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  // --- Dr. Aris Encounters ---
  'encounter_aris_med_bay': {
    id: 'encounter_aris_med_bay',
    locationId: 'med_bay',
    type: 'story',
    text: 'Dr. Aris 正在整理一堆散乱的药剂瓶。看到你进来，他显得有些手忙脚乱，下意识地遮住了身后的一个冷藏箱。',
    actions: [
      {
        id: 'aris_ask_meds', label: '请求一些止痛药', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          if (ctx.npcs.npcs['aris'].trust > 40) {
            ctx.game.addLog('他犹豫了一下，飞快地塞给你一个小瓶子。“拿走，别让守卫看见。”', 'info');
            ctx.game.inventory.push({
              id: 'painkillers', name: '止痛药', description: '虽然快过期了，但能缓解疼痛。', icon: 'pill', quantity: 1, category: 'consumable'
            });
          } else {
            ctx.game.addLog('“规则不允许我私自发放物资，”他躲闪着你的目光，“请离开这里。”', 'info');
            ctx.npcs.interact('aris', 2, 5);
          }
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },

  // --- Hallucination NPCs (Low Sanity Only) ---
  'encounter_hallucination_ghost_girl': {
    id: 'encounter_hallucination_ghost_girl',
    locationId: 'corridor_a',
    type: 'story',
    text: '走廊的尽头站着一个穿着白色裙子的小女孩。她背对着你，正在低声哭泣。在这冰冷的金属设施里，这显得极其突兀。',
    actions: [
      {
        id: 'ghost_girl_approach', label: '走过去安慰她', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('当你触碰到她的肩膀时，她转过头——那是一张没有任何五官的脸。她发出了刺耳的尖叫。', 'warning');
          ctx.game.player.stats.sanity -= 20;
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'ghost_girl_ignore', label: '闭上眼睛快步走过', timeCost: 0.25, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你强迫自己不去听那哭声。当你睁开眼时，女孩已经不见了。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  'encounter_hallucination_shadow_vendor': {
    id: 'encounter_hallucination_shadow_vendor',
    locationId: 'warehouse_back',
    type: 'story',
    text: '阴影中坐着一个披着大衣的男人。他向你招手，展示着一叠花绿绿的额度卡。“想要吗？只需要你的一点点……灵魂。”',
    actions: [
      {
        id: 'shadow_vendor_deal', label: '同意交易 (失去 10 生命值)', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 10;
          ctx.game.game.money += 30;
          ctx.game.addLog('你感到身体一阵空虚，但口袋里确实多了几张沉甸甸的额度卡。男人发出了干瘪的笑声。', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      {
        id: 'shadow_vendor_refuse', label: '拒绝这诡异的交易', timeCost: 0.25, variant: 'default',
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  }
};

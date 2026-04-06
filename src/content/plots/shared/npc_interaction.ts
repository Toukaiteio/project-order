import type { PlotScene } from '../../../types/plot';

export const npcInteractionPlots: Record<string, PlotScene> = {
  'npc_menu_general': {
    id: 'npc_menu_general',
    locationId: 'any',
    type: 'story',
    repeatable: true,
    text: (ctx) => {
      const npcId = ctx.game.flags.interacting_npc_id;
      if (!npcId) return '你面前空无一人。';
      const npc = ctx.npcs.npcs[npcId];
      if (!npc) return '目标已消失。';
      return `你正面对着 ${npc.name} (${npc.roleLabel})。其眼神中透露出 ${npc.trust > 50 ? '一丝信任' : '深深的戒备'}。你想做什么？`;
    },
    onEnter: (ctx) => {
      if (!ctx.game.flags.tutorial_npc_done) {
        ctx.game.flags.tutorial_npc_done = true;
        ctx.game.addLog('你很快发现，这里的人记仇也记恩，只是他们很少会把这两样直接写在脸上。', 'info');
      }
    },
    actions: [
      { id: 'npc_talk', label: '进行交谈', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          const npcId = ctx.game.flags.interacting_npc_id;
          const npc = ctx.npcs.npcs[npcId];
          ctx.game.addLog(`你尝试与 ${npc.name} 攀谈。`, 'info');
          // 基础反馈
          if (npcId === 'satoshi') {
            ctx.game.addLog('“我在忙……那些电路不会自己修好。”他头也不抬地嘟囔着。', 'story');
          } else if (npcId === 'sasha') {
            ctx.game.addLog('“谢……谢谢你找我说话，”她局促不安地揉着衣角。', 'story');
          } else if (npcId === 'grey') {
            ctx.game.addLog('“生存需要耐心，朋友。多看看周围。”灰淡淡地回应。', 'story');
          }
          ctx.npcs.interact(npcId, 2, 1);
        },
        nextSceneId: 'npc_menu_general'
      },
      { id: 'npc_trade', label: '进行交易', timeCost: 0.25, variant: 'accent',
        condition: (ctx) => ctx.game.flags.interacting_npc_id === 'broker',
        nextSceneId: 'shop_broker'
      },
      { id: 'npc_steal', label: '趁对方不注意伸手', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          const npcId = ctx.game.flags.interacting_npc_id;
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 15);
          if (check.success) {
            ctx.game.game.money += 15;
            ctx.npcs.interact(npcId, -10, -20);
            ctx.game.addLog('你得手了！你偷偷顺走了对方的一点积分。', 'info');
          } else {
            ctx.game.player.stats.hp -= 10;
            ctx.npcs.interact(npcId, -30, -40);
            ctx.game.addLog('偷窃失败！你被对方狠狠地推了一把。', 'danger');
          }
        },
        nextSceneId: 'npc_menu_general'
      },
      { id: 'npc_attack', label: '发动攻击', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          const npcId = ctx.game.flags.interacting_npc_id;
          const npc = ctx.npcs.npcs[npcId];
          ctx.game.addLog(`你突然对 ${npc.name} 发动了攻击。周围的人纷纷后退，冷漠地注视着这一切。`, 'danger');
          ctx.npcs.interact(npcId, -30, -40);
          ctx.game.enterCombat(npc.name, 80, 10);
        },
        // 无 nextSceneId：战斗行动由 enterCombat 内部注入，接管后续流程
      },
      { id: 'npc_leave', label: '离开', timeCost: 0.1, variant: 'default',
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
        defaultNextSceneId: 'explore_hall_main'
      }
    ]
  }
};

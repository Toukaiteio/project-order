import type { PlotScene } from '../../../types/plot';

export const trainingPlots: Record<string, PlotScene> = {
  // --- 力量锻炼小游戏 ---
  'train_strength_game': {
    id: 'train_strength_game',
    locationId: 'cell_01',
    type: 'story',
    text: '你撑在冰冷的地板上，汗水滴在铁锈缝隙里。你已经完成了基础组，感到肌肉正在灼烧。你想再挑战一组极限吗？(训练会显著消耗理智与体力)',
    actions: [
      { 
        id: 'strength_push_limits', label: '挑战极限 (力量检定)', timeCost: 1.0, variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 8; // 增加理智消耗
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 12);
          ctx.game.addLog(`（力量检定：${check.roll} + ${ctx.game.player.stats.strength} = ${check.total} / 难度 12）`, 'info');
          if (check.success) {
            const bonus = check.roll >= 18 ? 3 : 2;
            ctx.game.player.stats.strength += bonus;
            ctx.game.player.stats.hp -= 8;
            ctx.game.addLog(`突破成功！你的力量大幅提升了 ${bonus} 点。`, 'info');
          } else {
            ctx.game.player.stats.hp -= 15;
            ctx.game.addLog('你用力过猛导致肌肉拉伤，感到剧痛。', 'danger');
          }
        },
        nextSceneId: 'explore_cell_01'
      },
      { 
        id: 'strength_normal', label: '稳扎稳打', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.strength += 1;
          ctx.game.player.stats.hp -= 3;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你完成了标准的训练量，感到身体更结实了。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  // --- 敏捷锻炼小游戏 ---
  'train_dexterity_game': {
    id: 'train_dexterity_game',
    locationId: 'cell_01',
    type: 'story',
    text: '铁片在空中晃动。你需要全神贯注，在它交叠的一瞬间将其抓住。高度集中注意力会让你感到疲惫。',
    actions: [
      { 
        id: 'dexterity_focus', label: '瞬间抓取 (敏捷检定)', timeCost: 1.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 5;
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 14);
          ctx.game.addLog(`（敏捷检定：${check.roll} + ${ctx.game.player.stats.dexterity} = ${check.total} / 难度 14）`, 'info');
          if (check.success) {
            const gain = check.roll >= 19 ? 3 : 1;
            ctx.game.player.stats.dexterity += gain;
            ctx.game.addLog(gain > 1 ? `完美抓取！敏捷显著提升了 ${gain} 点。` : '成功抓住了，你的动作变快了。', 'info');
          } else {
            ctx.game.addLog('你慢了一拍，铁片划过了你的手指。', 'warning');
            ctx.game.player.stats.hp -= 2;
          }
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  // --- 智力锻炼小游戏 ---
  'train_intelligence_game': {
    id: 'train_intelligence_game',
    locationId: 'cell_01',
    type: 'story',
    text: '这道逻辑残题极其复杂，似乎涉及某种高等概率论。强行解题可能会导致剧烈的偏头痛。',
    actions: [
      { 
        id: 'intelligence_solve', label: '深度解析 (智力检定)', timeCost: 1.5, variant: 'accent',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.intelligence, 15);
          ctx.game.addLog(`（智力检定：${check.roll} + ${ctx.game.player.stats.intelligence} = ${check.total} / 难度 15）`, 'info');
          if (check.success) {
            const gain = check.roll >= 18 ? 3 : 1;
            ctx.game.player.stats.intelligence += gain;
            // 判定优秀（roll点高）减少理智损失
            const sanLoss = check.roll >= 15 ? 5 : 15;
            ctx.game.player.stats.sanity -= sanLoss;
            ctx.game.addLog(`逻辑闭环！智力提升 ${gain}。${sanLoss <= 5 ? '你游刃有余地解决了它。' : ''}`, 'info');
          } else {
            ctx.game.player.stats.sanity -= 20; // 失败损失更多
            ctx.game.addLog('你陷入了思维死循环，感到精神恍惚。', 'danger');
          }
        },
        nextSceneId: 'explore_cell_01'
      },
      { id: 'intelligence_giveup', label: '暂时放弃', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_cell_01' }
    ]
  }
};

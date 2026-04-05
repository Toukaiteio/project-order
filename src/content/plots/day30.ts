import type { PlotScene } from '../../types/plot';

export const day30Plots: Record<string, PlotScene> = {
  'game_02_death_race': {
    id: 'game_02_death_race',
    locationId: 'hall_main',
    type: 'warning',
    text: '“欢迎来到第30天。今天的游戏：死亡赛跑。规则很简单，在设施的回廊里全速奔跑，最后三名到达的人将被‘回收’。”',
    actions: [
      { 
        id: 'race_sprint', label: '全力爆发 (力量检定)', timeCost: 2.0, variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 55);
          ctx.game.addLog(`（力量 ${ctx.game.player.stats.strength} + 骰出 ${check.roll} = ${check.total} / 难度 55）`, 'info');
          if (check.success) {
            ctx.game.flags.race_win = true;
            ctx.game.addLog('你凭借强悍的体能冲在了最前面！', 'info');
          } else {
            ctx.game.flags.race_win = false;
            ctx.game.addLog('你的肌肉在哀鸣，速度慢了下来……', 'warning');
          }
        },
        nextSceneId: 'race_resolution'
      },
      { 
        id: 'race_agile', label: '寻找捷径 (敏捷检定)', timeCost: 2.0, variant: 'accent',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 60);
          ctx.game.addLog(`（敏捷 ${ctx.game.player.stats.dexterity} + 骰出 ${check.roll} = ${check.total} / 难度 60）`, 'info');
          if (check.success) {
            ctx.game.flags.race_win = true;
            ctx.game.addLog('你灵活地翻过障碍物，从窄道完成了超车。', 'info');
          } else {
            ctx.game.flags.race_win = false;
            ctx.game.addLog('你试图翻墙时脚滑了一下，重重摔在地上。', 'warning');
          }
        },
        nextSceneId: 'race_resolution'
      }
    ]
  },
  'race_resolution': {
    id: 'race_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => ctx.game.flags.race_win ? '你冲过了终点线。你活下来了。' : '你跌入了最后三名，一个黑影突然撞开了你身后的竞争者。',
    actions: [
      { id: 'continue', label: '继续', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      if (ctx.game.flags.race_win) {
        ctx.game.player.stats.hp -= 10;
        ctx.game.game.money += 30;
      } else {
        if (ctx.npcs.npcs['sasha'].favorability > 40) {
          ctx.game.addLog('是 Sasha P.！她在关键时刻帮你绊倒了对手。你勉强捡回一条命。', 'info');
          ctx.game.player.stats.hp -= 30;
        } else {
          ctx.game.addLog('你遭到了垫底的警告电击，生命值大幅下降。', 'danger');
          ctx.game.player.stats.hp -= 60;
        }
      }
    }
  }
};

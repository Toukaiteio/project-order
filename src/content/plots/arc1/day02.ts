import type { PlotScene } from '../../../types/plot';

export const day02Plots: Record<string, PlotScene> = {
  'daily_inspection': {
    id: 'daily_inspection',
    locationId: 'cell_01',
    type: 'warning',
    text: '刺耳的警笛声在清晨响起。沉重的脚步声停在门外，“突击检查！所有人站在床边，双手抱头！”两名全副武装的卫兵冲进房间，开始粗暴地翻找。',
    onEnter: (ctx) => {
      ctx.game.setObjective('在检查中存活');
      if (!ctx.game.flags.tutorial_checks_done) {
        ctx.game.flags.tutorial_checks_done = true;
        ctx.game.addLog('【提示：属性检定】系统会根据你的属性和随机骰子结果判定行动是否成功。骰子结果（1-20）加上属性值需要达到或超过难度值。这次的难度是 10。', 'info');
      }
    },
    actions: [
      { 
        id: 'hide_items', label: '尝试藏匿违禁品 (敏捷检定)', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 10);
          ctx.game.addLog(`（敏捷检定：${ctx.game.player.stats.dexterity} + ${check.roll} = ${check.total} / 难度 10）`, 'info');
          if (check.success) {
            ctx.game.addLog('你巧妙地利用床板缝隙藏住了纸条。卫兵一无所获，骂骂咧咧地离开了。', 'info');
            ctx.game.player.stats.intelligence += 1;
          } else {
            ctx.game.addLog('卫兵发现了你藏匿的东西！他狠狠给了你一托。', 'danger');
            ctx.game.player.stats.hp -= 20;
            // 移除特定道具
            ctx.game.inventory = ctx.game.inventory.filter((i: any) => i.id !== 'crumpled_note' && i.id !== 'electronic_part');
          }
        },
        nextSceneId: 'explore_cell_01'
      },
      { 
        id: 'cooperate_inspection', label: '顺从检查', timeCost: 0.25, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你老老实实地配合。卫兵把你推到墙角，虽然免遭毒打，但你的自尊心隐隐作痛。', 'warning');
          ctx.game.player.stats.sanity -= 5;
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  }
};

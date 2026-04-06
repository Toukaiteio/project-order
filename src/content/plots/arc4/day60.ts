import type { PlotScene } from '../../../types/plot';

export const day60Plots: Record<string, PlotScene> = {
  'the_great_purge_start': {
    id: 'the_great_purge_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '“第60天。清洗程序启动。检测到资源贡献率不达标者共计 4 名。执行队已出发。”广播声在大厅回荡，伴随着沉重的靴子踏地声。',
    onEnter: (ctx) => {
      ctx.game.addLog('你看到执行队正带着武器走向各个区域。你需要做出选择：躲起来保全自己，还是冒险营救你的盟友。', 'danger');
    },
    actions: [
      {
        id: 'save_sasha',
        label: '营救 Sasha (废料处理区)',
        condition: (ctx) => ctx.npcs.npcs['sasha'].favorability > 30,
        timeCost: 2.0,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 65);
          ctx.game.addLog(`（敏捷检定：${ctx.game.player.stats.dexterity} + ${check.roll} = ${check.total} / 难度 65）`, 'info');
          if (check.success) {
            ctx.game.flags.sasha_saved = true;
            ctx.game.addLog('你从执行队的手中救下了瑟缩在管道里的 Sasha。', 'info');
          } else {
            ctx.game.player.stats.hp -= 40;
            ctx.game.addLog('你被执行队的流弹击中，只能眼睁睁地看着 Sasha 被强行带走。', 'danger');
            ctx.npcs.npcs['sasha'].state = 'Dead';
          }
        },
        nextSceneId: 'purge_resolution'
      },
      {
        id: 'save_aris',
        label: '营救 Aris (医疗站)',
        condition: (ctx) => ctx.npcs.npcs['aris'].trust > 30,
        timeCost: 2.0,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.intelligence, 60);
          ctx.game.addLog(`（智力检定：${ctx.game.player.stats.intelligence} + ${check.roll} = ${check.total} / 难度 60）`, 'info');
          if (check.success) {
            ctx.game.flags.aris_saved = true;
            ctx.game.addLog('你利用权限后门暂时锁死了医疗站的电子门，掩护 Aris 躲进了暗格。', 'info');
          } else {
            ctx.game.player.stats.hp -= 20;
            ctx.game.addLog('你的黑客手段失败了。执行队破门而入，Aris 的眼神中充满了绝望。', 'danger');
            ctx.npcs.npcs['aris'].state = 'Dead';
          }
        },
        nextSceneId: 'purge_resolution'
      },
      {
        id: 'hide_self',
        label: '闭门不出 (保全自己)',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你躲在牢房深处，捂住耳朵不去听外面的惨叫声。', 'warning');
          ctx.game.player.stats.sanity -= 20;
          // 随机死一个好感度不是最高的 NPC
          const targets = ['sasha', 'aris', 'satoshi'].filter(id => ctx.npcs.npcs[id].state === 'Alive');
          if (targets.length > 0) {
            const victim = targets[Math.floor(Math.random() * targets.length)];
            ctx.npcs.npcs[victim].state = 'Dead';
            ctx.game.addLog(`第二天，你再也没见过 ${ctx.npcs.npcs[victim].name}。`, 'danger');
          }
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },
  'purge_resolution': {
    id: 'purge_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: '杀戮的喧嚣逐渐远去。空气中弥漫着刺鼻的火药味和血腥气。幸存者的人数再次减少，设施变得更加空旷和死寂。',
    actions: [
      { id: 'continue', label: '继续呼吸', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ]
  }
};

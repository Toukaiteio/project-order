import type { PlotScene } from '../../../types/plot';

export const day60Plots: Record<string, PlotScene> = {
  'the_great_purge_start': {
    id: 'the_great_purge_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '“第60天。清洗程序启动。检测到资源贡献率不达标者共计 24 名。执行队已出发。”广播声在大厅回荡，伴随着沉重的靴子踏地声。今天终于没有人再假装听不懂。',
    onEnter: (ctx) => {
      ctx.game.addLog('你看见执行队正带着武器走向各个区域。真正可怕的不是他们终于来了，而是很多人昨晚就已经知道他们会走哪条路。', 'danger');
      if (ctx.game.flags.arc4_purge_route_known) {
        ctx.game.addLog('你记得他们预演过的路线。那一点点提前知道的顺序，现在终于要派上用场。', 'warning');
      }
      if (ctx.game.flags.grey_d45_done) {
        ctx.game.addLog('Grey 当初留给你的那张纸，忽然在脑子里变得比任何一句话都清楚。', 'warning');
      }
    },
    actions: [
      {
        id: 'save_sasha',
        label: '去找 Sasha',
        condition: (ctx) => ctx.npcs.npcs['sasha'].state === 'Alive' && ctx.npcs.npcs['sasha'].favorability > 20,
        timeCost: 2.0,
        variant: 'danger',
        effect: (ctx) => {
          const bonus = (ctx.game.flags.arc4_smoke_route ? 4 : 0)
            + (ctx.game.flags.arc4_door_timing ? 3 : 0)
            + (ctx.game.flags.arc3_sasha_saved ? 4 : 0)
            + (ctx.game.flags.sasha_locket_returned ? 3 : 0);
          const penalty = ctx.game.flags.arc6_sasha_distance ? 4 : 0;
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity + bonus - penalty, 62);
          if (check.success) {
            ctx.game.flags.sasha_saved = true;
            ctx.npcs.npcs['sasha'].state = 'Alive';
            ctx.game.addLog('你在废料区后侧的管道边找到了缩成一团的 Sasha，把她从执行队即将合拢的缺口里拖了出去。', 'info');
            if (ctx.game.flags.sasha_locket_returned) {
              ctx.game.addLog('她死死攥着胸前那枚早就坏掉的吊坠，跑起来时却第一次没有掉队。', 'warning');
            }
          } else {
            ctx.game.player.stats.hp -= 35;
            ctx.npcs.npcs['sasha'].state = 'Dead';
            ctx.game.addLog('你只差一点。执行队的灯先扫到了你们，Sasha 被硬生生从你手边拖走时，连哭声都来不及完整。', 'danger');
          }
        },
        nextSceneId: 'purge_resolution'
      },
      {
        id: 'save_aris',
        label: '去找 Aris',
        condition: (ctx) => ctx.npcs.npcs['aris'].state === 'Alive' && ctx.npcs.npcs['aris'].trust > 30,
        timeCost: 2.0,
        variant: 'danger',
        effect: (ctx) => {
          const bonus = (ctx.game.flags.arc4_blank_forms ? 4 : 0)
            + (ctx.game.flags.arc4_control_map ? 3 : 0)
            + (ctx.game.flags.arc3_aris_debt ? 4 : 0)
            + (ctx.game.flags.arc4_satoshi_backup ? 2 : 0)
            + (ctx.game.flags.aris_ration_given ? 3 : 0);
          const penalty = ctx.game.flags.arc6_aris_regret ? 4 : 0;
          const check = ctx.game.rollCheck(ctx.game.player.stats.intelligence + bonus - penalty, 60);
          if (check.success) {
            ctx.game.flags.aris_saved = true;
            ctx.npcs.npcs['aris'].state = 'Alive';
            ctx.game.addLog('你利用提前摸到的门锁节奏和一条备用通路，替 Aris 把医疗站后间短暂关成了死角。等执行队冲进去时，里面已经空了。', 'info');
            if (ctx.game.flags.aris_ration_given) {
              ctx.game.addLog('Aris 临走前把那份你很久前递出去的口粮账，轻轻拍回了你肩上。谁都没再提谢字。', 'warning');
            }
          } else {
            ctx.game.player.stats.hp -= 20;
            ctx.npcs.npcs['aris'].state = 'Dead';
            ctx.game.addLog('你慢了一步。执行队撞开门时，Aris 只来得及回头看你一眼，那一眼里的疲惫比绝望还重。', 'danger');
          }
        },
        nextSceneId: 'purge_resolution'
      },
      {
        id: 'hide_self',
        label: '先把自己藏起来',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有出去。门外的脚步声、撞门声、短促的喊叫声一层层压过来，像在替你把这个决定坐实。', 'warning');
          ctx.game.player.stats.sanity -= 20;
          const targets = ['sasha', 'aris', 'satoshi'].filter((id) => ctx.npcs.npcs[id].state === 'Alive');
          if (targets.length > 0) {
            const victim = targets[Math.floor(Math.random() * targets.length)];
            ctx.npcs.npcs[victim].state = 'Dead';
            ctx.game.addLog(`第二天，你再也没见过 ${ctx.npcs.npcs[victim].name}。`, 'danger');
          }
        },
        nextSceneId: 'purge_resolution'
      }
    ]
  },
  'purge_resolution': {
    id: 'purge_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      const saved: string[] = [];
      if (ctx.game.flags.sasha_saved) saved.push('Sasha');
      if (ctx.game.flags.aris_saved) saved.push('Aris');
      if (saved.length === 2) {
        return '靴声终于远了下去，可大厅比之前更空。你护住了两个人，可也因此更清楚地看见，还有更多人连名字都没能留下。';
      }
      if (saved.length === 1) {
        return `清洗过去了，可空气里还挂着火药和血腥味。你至少把 ${saved[0]} 留了下来，可这个“至少”轻得像一句借口。`;
      }
      return '杀戮的喧嚣终于远去。空气里弥漫着刺鼻的火药味和血腥气，设施再次空了一层，连回声都变得更薄。';
    },
    onEnter: (ctx) => {
      if (ctx.game.flags.sasha_saved) {
        ctx.npcs.interact('sasha', 20, 15);
        ctx.game.addLog('Sasha 还在发抖，却还是把手死死攥着，像终于确认自己没被带走。', 'info');
      }
      if (ctx.game.flags.aris_saved) {
        ctx.npcs.interact('aris', 15, 12);
        ctx.game.addLog('Aris 靠着墙喘气，袖口上的血已经干了。他看着你，像是第一次允许自己把一点重量交给别人。', 'info');
      }
      if (!ctx.game.flags.sasha_saved && !ctx.game.flags.aris_saved) {
        ctx.game.addLog('你活下来了，但这一次，“活下来”本身没给你留下任何可以抓住的东西。', 'warning');
      }
    },
    actions: [
      { id: 'continue', label: '继续呼吸', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ]
  }
};

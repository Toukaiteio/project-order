import type { PlotScene } from '../../types/plot';

export const day20Plots: Record<string, PlotScene> = {
  'aftermath_reaction': {
    id: 'aftermath_reaction',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      if (ctx.game.flags.voted_marcus) {
        return '你在走廊里遇到了 Marcus T.。他的脸色比平时更加阴沉，两个跟班不怀好意地挡住了你的去路。';
      }
      if (ctx.game.flags.voted_elena) {
        return 'Elena V. 正在整理她的记录。看到你走近，她甚至没有抬头，只是冷冷地说：“有些人的数据正在变得无关紧要。”';
      }
      return '大厅里弥漫着一种诡异的安静。第15天的投票之后，幸存者们明显分成了几个小团体，而你似乎处于中心之外。';
    },
    actions: [
      { 
        id: 'confront_consequences', 
        label: '直面后果', 
        timeCost: 1.0, 
        variant: 'accent',
        nextSceneId: 'day20_branch_decision'
      }
    ]
  },
  'day20_branch_decision': {
    id: 'day20_branch_decision',
    locationId: 'hall_main',
    type: 'story',
    text: '你意识到，保持中立的日子已经结束了。你需要在这个逐渐崩塌的秩序中找到自己的立足点。',
    actions: [
      {
        id: 'seek_marcus_mercy',
        label: '向 Marcus 示好 (需要 20 积分)',
        condition: (ctx) => ctx.game.game.money >= 20,
        timeCost: 1.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.game.money -= 20;
          ctx.npcs.interact('marcus', 15, 5);
          ctx.game.addLog('Marcus 接过了积分，冷哼一声：“算你识相。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'seek_elena_truth',
        label: '向 Elena 提供情报',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 45,
        timeCost: 1.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.npcs.interact('elena', 20, 10);
          ctx.game.addLog('Elena 对你分析出的规律表现出了兴趣。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'stay_independent',
        label: '继续独行',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 5;
          ctx.game.addLog('孤独感像毒药一样侵蚀着你，但你依然选择相信自己。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

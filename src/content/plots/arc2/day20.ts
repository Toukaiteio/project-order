import type { PlotScene } from '../../../types/plot';

export const day20Plots: Record<string, PlotScene> = {
  'aftermath_reaction': {
    id: 'aftermath_reaction',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      if (ctx.game.flags.voted_marcus) {
        return '投票后的第五天，你在走廊里再次遇到了 Marcus T.。他的脸色比平时更加阴沉，两个跟班不怀好意地挡住了你的去路。';
      }
      if (ctx.game.flags.voted_elena) {
        return 'Elena V. 正在整理她的记录。看到你走近，她甚至没有抬头，只是冷冷地说：”有些人的数据正在变得无关紧要。”';
      }
      return '大厅里弥漫着一种诡异的安静。第15天的投票之后，幸存者们明显分成了几个小团体，而你似乎处于中心之外。';
    },
    onEnter: (ctx) => {
      ctx.game.addLog('投票没有让气氛平静下来，反而像是替之后的很多事开了头。', 'warning');
    },
    actions: [
      {
        id: 'confront_consequences',
        label: '走过去把话说清楚',
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
    text: '你意识到，保持中立的日子已经结束了。投票只是第一次站队，接下来每一天都会有人逼你把位置站得更明白。',
    actions: [
      {
        id: 'seek_marcus_mercy',
        label: '先向 Marcus 低头',
        condition: (ctx) => ctx.game.game.money >= 20,
        timeCost: 1.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.game.money -= 20;
          ctx.game.flags.joined_marcus = true;
          ctx.npcs.interact('marcus', 15, 5);
          ctx.game.addLog('Marcus 接过你递过去的积分，冷哼了一声：”至少你知道先活哪边。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'seek_elena_truth',
        label: '去找 Elena 交换情报',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 45,
        timeCost: 1.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.elena_allied = true;
          ctx.npcs.interact('elena', 20, 10);
          ctx.game.addLog('Elena 听完后才终于抬头。”很好，”她说，”至少你不是靠嗓门活到现在的。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'stay_independent',
        label: '谁也不靠',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc2_lone_mark = true;
          ctx.game.player.stats.sanity -= 5;
          ctx.game.addLog('你转身离开时，能感觉到几道目光一起落在你背上。谁也不靠，通常也意味着谁都不会替你说话。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

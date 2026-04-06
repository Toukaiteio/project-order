import type { PlotScene } from '../../../types/plot';

export const day15Plots: Record<string, PlotScene> = {
  'faction_split_vote': {
    id: 'faction_split_vote',
    locationId: 'hall_main',
    type: 'warning',
    text: (ctx) => {
      const isCrazy = ctx.game.player.stats.sanity < 30;
      if (isCrazy) {
        return '大厅里挤满了人，但他们的脸看起来像是融化的蜡。广播里的声音变得沙哑且带有重音：“杀掉……投票……选出那个多余的影子……”';
      }
      return '设施大厅被红色的警示灯照亮。广播中冷冰冰地宣布：“资源缺口已达 15%。根据《平衡法案》，幸存者需选出一名‘非贡献者’移出居住区。”';
    },
    onEnter: (ctx) => {
      ctx.game.addLog('气氛压抑到了极点。每个人都在用怀疑的目光打量着周围的人。', 'warning');
      if (ctx.game.flags.day15_formula_known) {
        ctx.game.addLog('你已经看过那套贡献排序的规则，因此比别人更清楚这场表决背后到底在计算什么。', 'info');
      }
      if (ctx.game.game.hunger <= 25) {
        ctx.game.addLog('空腹让你的耐性被磨得很薄。你知道，今天任何一个冲动都可能把你送上台面。', 'danger');
      }
    },
    actions: [
      { id: 'vote_marcus', label: '投票给 Marcus T.', timeCost: 1.0, variant: 'danger', nextSceneId: 'vote_result_marcus' },
      { id: 'vote_elena', label: '投票给 Elena V.', timeCost: 1.0, variant: 'danger', nextSceneId: 'vote_result_elena' },
      { id: 'vote_abstain', label: '绕开表决程序', timeCost: 1.0, variant: 'accent', condition: (ctx) => ctx.game.player.stats.intelligence >= (ctx.game.flags.day15_formula_known ? 32 : 40), nextSceneId: 'vote_result_abstain' },
      { id: 'vote_buy_time', label: '悄悄递过去一点东西', timeCost: 1.0, variant: 'accent', condition: (ctx) => ctx.game.game.money >= 20 && ctx.game.inventory.some((i: any) => i.id === 'ration'), nextSceneId: 'vote_result_bribe' },
      { id: 'hallucination_self', label: '把票投向自己', timeCost: 1.0, variant: 'danger', condition: (ctx) => ctx.game.player.stats.sanity < 20, nextSceneId: 'vote_result_insane' }
    ]
  },
  'vote_result_marcus': {
    id: 'vote_result_marcus',
    locationId: 'hall_main',
    type: 'story',
    text: '你投给了 Marcus。由于他在工业地带的势力，你的票并未能动摇他，但他记住了你的背叛。最终，一名瘦弱的无名者被带走了。',
    actions: [
      { id: 'continue', label: '活过这一天', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.flags.voted_marcus = true;
      ctx.npcs.interact('marcus', -40, -20);
      ctx.game.addLog('Marcus 向你露出了一个冰冷的笑容。', 'warning');
    }
  },
  'vote_result_elena': {
    id: 'vote_result_elena',
    locationId: 'hall_main',
    type: 'story',
    text: '你投给了 Elena。她似乎早有预料，展示了一份记录证明她对设施运行的不可或缺性。你的投票像是一场拙劣的表演。',
    actions: [
      { id: 'continue', label: '活过这一天', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.flags.voted_elena = true;
      ctx.npcs.interact('elena', -30, -10);
      ctx.game.addLog('Elena 并没有生气，只是在她的笔记本上重重地写下了你的名字。', 'info');
    }
  },
  'vote_result_abstain': {
    id: 'vote_result_abstain',
    locationId: 'hall_main',
    type: 'story',
    text: '你利用繁琐的程序漏洞成功弃权。管理方对此感到意外，但也只能作罢。你避开了这场直接冲突，但在他人眼中，你变得更加深不可测。',
    actions: [
      { id: 'continue', label: '活过这一天', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.player.stats.intelligence += 2;
      ctx.game.addLog('你感到有几道目光在暗中观察你。', 'info');
    }
  },
  'vote_result_bribe': {
    id: 'vote_result_bribe',
    locationId: 'hall_main',
    type: 'story',
    text: '你悄悄把一份口粮和一笔积分递给了负责记录的人。对方没有多看你，只是把你的编号往后挪了一行。你没有赢，只是暂时不那么显眼了。',
    actions: [
      { id: 'continue', label: '先活过这轮再说', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      const rationIndex = ctx.game.inventory.findIndex((i: any) => i.id === 'ration');
      if (rationIndex >= 0) ctx.game.inventory.splice(rationIndex, 1);
      ctx.game.game.money -= 20;
      ctx.game.player.stats.sanity -= 4;
      ctx.game.addLog('对方把那份口粮收走时，连眼皮都没抬一下。你忽然觉得这一幕像是早就发生过无数次。', 'warning');
    }
  },
  'vote_result_insane': {
    id: 'vote_result_insane',
    locationId: 'hall_main',
    type: 'warning',
    text: '你尖叫着投给了自己。周围的人像看怪物一样看着你。这种近乎自杀的行为让管理方感到有趣，他们决定留着你观察更久。',
    actions: [
      { id: 'continue', label: '混乱……也是一种秩序', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.player.stats.sanity -= 10;
      ctx.game.addLog('你感觉到一种扭曲的快感。', 'warning');
    }
  }
};

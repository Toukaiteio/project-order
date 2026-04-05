import type { PlotScene } from '../../types/plot';

export const day75Plots: Record<string, PlotScene> = {
  'the_last_supper_start': {
    id: 'the_last_supper_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅里摆放着一张长桌，上面竟破天荒地放着真正的新鲜食物。Marcus T. 坐在首位，手里把玩着那根警棍。“过来坐，朋友。在一切结束之前，我们得聊聊关于‘继承权’的问题。”',
    onEnter: (ctx) => {
      ctx.game.addLog('空气中弥漫着一种最后的疯狂。你知道，这顿午餐之后，只有一方能站着离开。', 'warning');
    },
    actions: [
      {
        id: 'confront_marcus', label: '拒绝这虚伪的提议', timeCost: 1.0, variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('“看来你选择了最难的那条路。”Marcus 站了起来，发出了格格的笑声。', 'danger');
          ctx.game.enterCombat('Marcus T. (秩序领袖)', 150, 15);
        },
        nextSceneId: 'marcus_battle_loop'
      },
      {
        id: 'join_marcus', label: '低头顺从', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.npcs.npcs['marcus'].favorability > 50,
        effect: (ctx) => {
          ctx.game.flags.joined_marcus = true;
          ctx.game.addLog('你坐在了他的右手边。你背叛了所有信任你的人，换取了活到最后一天的资格。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'marcus_battle_loop': {
    id: 'marcus_battle_loop',
    locationId: 'hall_main',
    type: 'warning',
    text: (ctx) => {
      if (!ctx.game.combat.active) {
        return '战斗结束了。大厅里重新恢复了死寂。';
      }
      return `战斗进行中：${ctx.game.combat.enemyName} 正冷冷地盯着你。`;
    },
    actions: [
      // 这里的具体战斗动作已经在 StoryPanel 中通过 combatAction 处理
      // 此场景仅作为战斗时的背景容器
      { 
        id: 'finish_battle', label: '战斗已结束', timeCost: 0.1, variant: 'default',
        condition: (ctx) => !ctx.game.combat.active,
        nextSceneId: 'marcus_battle_win'
      }
    ]
  },
  'marcus_battle_win': {
    id: 'marcus_battle_win',
    locationId: 'hall_main',
    type: 'story',
    text: 'Marcus 沉重的身体轰然倒地。他眼中的狂热逐渐熄灭。“咳……秩序……不会……消失……”他最后呢喃道。',
    actions: [
      { id: 'continue', label: '结束了', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.flags.marcus_defeated = true;
      ctx.npcs.npcs['marcus'].state = 'Dead';
      ctx.game.game.money += 200;
    }
  }
};

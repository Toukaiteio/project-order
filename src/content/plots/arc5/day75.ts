import type { PlotScene } from '../../../types/plot';

export const day75Plots: Record<string, PlotScene> = {
  'the_last_supper_start': {
    id: 'the_last_supper_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅中央真的摆上了一张长桌。桌上是久违的新鲜食物，热气薄得像幻觉。Marcus 坐在首位，手里把玩着那根警棍，像在把玩一支已经写好结局的笔。“过来坐，”他说，“在一切结束前，我们得聊聊谁有资格继承这里。”',
    onEnter: (ctx) => {
      ctx.game.addLog('空气里弥漫着最后阶段才会有的那种平静。越平静，越像已经替血准备好了地方。', 'warning');
      if (ctx.game.flags.arc5_seat_count) {
        ctx.game.addLog('你记得那张桌子预留过多少把椅子。现在摆出来的，比昨天还少。', 'warning');
      }
      if (ctx.game.flags.arc5_marcus_offer || ctx.game.flags.joined_marcus) {
        ctx.game.addLog('Marcus 看你的眼神不像在招呼客人，更像在叫一道迟到了太久的答案。', 'warning');
      }
    },
    actions: [
      {
        id: 'confront_marcus',
        label: '当场掀掉这场戏',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('“看来你还是选了最难看的那条路。”Marcus 站了起来，笑声里已经没有半点招待的意思。', 'danger');
          ctx.game.enterCombat('Marcus T. (秩序领袖)', 150, 15);
        },
        nextSceneId: 'marcus_battle_loop'
      },
      {
        id: 'join_marcus',
        label: '坐到他右手边',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.npcs.npcs['marcus'].favorability > 50,
        effect: (ctx) => {
          ctx.game.flags.joined_marcus = true;
          ctx.game.addLog('你坐了下去。椅子很稳，桌上的东西也真的能吃，可你很清楚这不是款待，只是盖章。', 'info');
          if (ctx.game.flags.sasha_saved) {
            ctx.game.addLog('Sasha 没出声，只是在角落里把头压得更低。', 'warning');
          }
          if (ctx.game.flags.aris_saved) {
            ctx.game.addLog('Aris 看了你一眼，像是在确认自己该不该继续把你算在“还能信的人”里面。', 'warning');
          }
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
        return '战斗结束了。长桌还在，热气却已经散干净了。';
      }
      return `战斗进行中：${ctx.game.combat.enemyName} 正死死盯着你。`;
    },
    actions: [
      {
        id: 'finish_battle_ready',
        label: '查看战斗结果',
        timeCost: 0.1,
        variant: 'accent',
        condition: (ctx) => !ctx.game.combat.active,
        nextSceneId: 'marcus_battle_win'
      },
      {
        id: 'fighting_marcus_dummy',
        label: '生死由命...',
        timeCost: 0,
        variant: 'danger',
        isFallback: true,
        condition: (ctx) => ctx.game.combat.active,
        nextSceneId: 'marcus_battle_loop'
      }
    ]
  },
  'marcus_battle_win': {
    id: 'marcus_battle_win',
    locationId: 'hall_main',
    type: 'story',
    text: 'Marcus 沉重的身体终于倒了下去。那根警棍从他手里滚落，撞在桌脚上，发出一声比喊叫更像结尾的轻响。“秩序……”他最后只剩下这一点气音，随后整个人一起熄了。',
    actions: [
      { id: 'continue', label: '让桌上的热气自己冷下去', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.flags.marcus_defeated = true;
      ctx.npcs.npcs['marcus'].state = 'Dead';
      ctx.game.game.money += 200;
      if (ctx.game.flags.arc5_hidden_utensil) {
        ctx.game.addLog('你忽然想起袖口里还藏着那点冷金属。和倒下的 Marcus 比起来，它轻得近乎荒唐。', 'warning');
      }
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 没有靠近尸体，只是先去看还活着的人。', 'info');
      }
      if (ctx.game.flags.satoshi_allied) {
        ctx.game.addLog('Satoshi 看着熄掉的大屏，像在等待某个比欢呼更重要的信号出现。', 'warning');
      }
    }
  }
};

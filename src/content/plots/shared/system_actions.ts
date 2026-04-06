import type { PlotScene } from '../../../types/plot';

export const systemPlots: Record<string, PlotScene> = {
  'rest_menu': {
    id: 'rest_menu',
    locationId: 'any',
    type: 'story',
    text: '你需要休息多久？在这里睡觉并不安全，但你的身体已经发出了警告。',
    actions: [
      { id: 'rest_2h', label: '短睡 (2小时)', timeCost: 2.0, variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 10);
          ctx.game.addLog('你进行了一次短促的睡眠，稍微恢复了精力。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`
      },
      { id: 'rest_4h', label: '深度睡眠 (4小时)', timeCost: 4.0, variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 25);
          ctx.game.addLog('你沉沉地睡了4个小时，感觉好多了。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`
      },
      { id: 'rest_8h', label: '长效修整 (8小时)', timeCost: 8.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 60);
          ctx.game.player.stats.hp = Math.min(ctx.game.player.stats.maxHp, ctx.game.player.stats.hp + 10);
          ctx.game.addLog('这是一场奢侈的睡眠。你的理智和体力都得到了显著恢复。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`
      },
      { id: 'rest_cancel', label: '还是算了', timeCost: 0.1, variant: 'default',
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`
      }
    ]
  },

  'combat_victory': {
    id: 'combat_victory',
    locationId: 'any',
    type: 'story',
    text: (ctx) => {
      const npcId = ctx.game.flags.interacting_npc_id as string;
      const npcName = npcId && ctx.npcs.npcs[npcId] ? ctx.npcs.npcs[npcId].name : '对方';
      return `${npcName} 跌落在地，大口喘息，已无力再战。你站在他们上方，肾上腺素还在沸腾——现在，决定权在你手中。`;
    },
    actions: [
      {
        id: 'cv_kill',
        label: '彻底解决',
        timeCost: 0,
        variant: 'danger',
        effect: (ctx) => {
          const npcId = ctx.game.flags.interacting_npc_id as string;
          const npc = ctx.npcs.npcs[npcId];
          if (!npc) return;

          const npcName = npc.name;
          npc.state = 'Dead';
          npc.location = '';

          // 目击者（同地点已认识的 NPC）好感大幅下滑
          const loc = ctx.game.game.location;
          Object.values(ctx.npcs.npcs).forEach((n: any) => {
            if (n.id !== npcId && n.location === loc && n.state === 'Alive' && n.met) {
              ctx.npcs.interact(n.id, -25, -30);
              ctx.game.addLog(`${n.name} 目睹了这一切，用恐惧与厌恶的眼神看着你。`, 'warning');
            }
          });

          ctx.game.player.stats.sanity = Math.max(0, ctx.game.player.stats.sanity - 12);
          ctx.game.addLog(
            `你做出了最终的决定。${npcName} 再也不会是任何人的威胁了。` +
            `\n（SAN -12。${npcName} 永久死亡，所有认识他/她的 NPC 对你的态度将持续恶化。）`,
            'danger'
          );
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
      },
      {
        id: 'cv_spare',
        label: '放他一条生路',
        timeCost: 0,
        variant: 'accent',
        effect: (ctx) => {
          const npcId = ctx.game.flags.interacting_npc_id as string;
          const npc = ctx.npcs.npcs[npcId];
          if (!npc) return;

          // 存活但关系彻底破裂，标记仇恨以便后续剧情使用
          ctx.npcs.interact(npcId, -45, -55);
          ctx.game.flags[`${npcId}_holds_grudge`] = true;

          ctx.game.addLog(
            `你收手了。${npc.name} 用混杂着仇恨与惊愕的眼神盯着你，` +
            `颤抖着撑起身体，踉跄消失在走廊深处。\n` +
            `（${npc.name} 存活，但与你的关系已跌至谷底，日后可能以某种方式报复。）`,
            'story'
          );
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
      },
    ],
  },

  'combat_defeat': {
    id: 'combat_defeat',
    locationId: 'any',
    type: 'warning',
    text: '黑暗彻底吞没了意识。不知过了多久，你在冰冷的地板上缓缓睁开眼睛。你还活着——只是勉强。',
    onEnter: (ctx) => {
      const recoveredHp = Math.max(1, Math.floor(ctx.game.player.stats.maxHp * 0.1));
      ctx.game.player.stats.hp = recoveredHp;
      ctx.game.player.stats.sanity = Math.max(0, ctx.game.player.stats.sanity - 20);
      ctx.game.addLog(`（你在昏迷中侥幸活下来。HP 回到 ${recoveredHp}，战败的屈辱与恐惧令 SAN -20）`, 'warning');
    },
    actions: [
      { id: 'cd_recover', label: '挣扎起身', timeCost: 1.0, variant: 'default',
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`
      }
    ]
  }
};

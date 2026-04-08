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
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
        defaultNextSceneId: 'explore_cell_01'
      },
      { id: 'rest_4h', label: '深度睡眠 (4小时)', timeCost: 4.0, variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 25);
          ctx.game.addLog('你沉沉地睡了4个小时，感觉好多了。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
        defaultNextSceneId: 'explore_cell_01'
      },
      { id: 'rest_8h', label: '长效修整 (8小时)', timeCost: 8.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 60);
          ctx.game.player.stats.hp = Math.min(ctx.game.player.stats.maxHp, ctx.game.player.stats.hp + 10);
          ctx.game.addLog('这是一场奢侈的睡眠。你的理智和体力都得到了显著恢复。', 'info');
        },
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
        defaultNextSceneId: 'explore_cell_01'
      },
      { id: 'rest_cancel', label: '还是算了', timeCost: 0.1, variant: 'default',
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
        defaultNextSceneId: 'explore_cell_01'
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
        defaultNextSceneId: 'explore_hall_main',
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
        defaultNextSceneId: 'explore_hall_main',
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
        nextSceneId: (ctx) => `explore_${ctx.game.game.location}`,
        defaultNextSceneId: 'explore_cell_01'
      }
    ]
  },

  'system_manage_plants': {
    id: 'system_manage_plants',
    locationId: 'cell_01',
    type: 'info',
    text: '你蹲在那些简陋的“花盆”前。在这个没有阳光的地方，每一片绿叶都显得如此珍贵。',
    actions: (ctx: any) => {
      const actions: any[] = [];
      ctx.game.plants.forEach((p: any, idx: number) => {
        // 浇水动作
        if (p.lastWateredDay !== ctx.game.game.day) {
          actions.push({
            id: `water_${idx}`, label: `给 ${p.name} 浇水`, timeCost: 0.1, variant: 'accent',
            effect: (ctx: any) => ctx.game.waterPlant(idx),
            nextSceneId: 'system_manage_plants'
          });
        }
        // 收获动作
        if (p.stage === 3) {
          actions.push({
            id: `harvest_${idx}`, label: `收获 ${p.name}`, timeCost: 0.5, variant: 'accent',
            effect: (ctx: any) => ctx.game.harvestPlant(idx),
            nextSceneId: 'system_manage_plants'
          });
        }
      });
      actions.push({ id: 'back_cell_p', label: '返回牢房', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_cell_01' });
      return actions;
    }
  },

  'system_start_planting': {
    id: 'system_start_planting',
    locationId: 'cell_01',
    type: 'info',
    text: '你手里攥着种子。该把希望种在哪里？',
    actions: (ctx: any) => {
      const actions: any[] = [];
      const seeds = ctx.game.inventory.filter((i: any) => i.id.endsWith('_seeds'));
      seeds.forEach((s: any) => {
        actions.push({
          id: `plant_${s.id}`, label: `播种 ${s.name}`, timeCost: 0.5, variant: 'accent',
          effect: (ctx: any) => ctx.game.plantSeed(s.id),
          nextSceneId: 'explore_cell_01'
        });
      });
      actions.push({ id: 'back_cell_s', label: '取消', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_cell_01' });
      return actions;
    }
  },

  'system_manage_storage': {
    id: 'system_manage_storage',
    locationId: 'cell_01',
    type: 'info',
    text: (ctx: any) => {
      let t = '你的秘密储物槽。只有你（和某些运气好的小偷）知道它的存在。';
      if (ctx.game.storage.length === 0) t += '\n目前是空的。';
      else {
        t += '\n\n当前存放：';
        ctx.game.storage.forEach((i: any) => t += `\n- ${i.name} x${i.quantity}`);
      }
      return t;
    },
    actions: (ctx: any) => {
      const actions: any[] = [];
      // 存入动作
      const storable = ctx.game.inventory.filter((i: any) => i.category !== 'key' && i.id !== 'iron_pipe');
      if (storable.length > 0) {
        actions.push({
          id: 'store_item_entry', label: '存入物品...', timeCost: 0.25, variant: 'accent',
          nextSceneId: 'system_storage_put'
        });
      }
      // 取出动作
      if (ctx.game.storage.length > 0) {
        actions.push({
          id: 'retrieve_item_entry', label: '取出物品...', timeCost: 0.25, variant: 'accent',
          nextSceneId: 'system_storage_get'
        });
      }
      actions.push({ id: 'back_cell_st', label: '返回', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_cell_01' });
      return actions;
    }
  },

  'system_storage_put': {
    id: 'system_storage_put',
    locationId: 'cell_01',
    type: 'info',
    text: '要把什么藏起来？',
    actions: (ctx: any) => {
      const actions: any[] = [];
      const storable = ctx.game.inventory.filter((i: any) => i.category !== 'key' && i.id !== 'iron_pipe');
      storable.forEach((i: any) => {
        actions.push({
          id: `put_${i.id}`, label: `存入 ${i.name}`, timeCost: 0.1, variant: 'default',
          effect: (ctx: any) => ctx.game.storeToBox(i.id),
          nextSceneId: 'system_manage_storage'
        });
      });
      actions.push({ id: 'back_st_p', label: '取消', timeCost: 0.1, variant: 'default', nextSceneId: 'system_manage_storage' });
      return actions;
    }
  },

  'system_storage_get': {
    id: 'system_storage_get',
    locationId: 'cell_01',
    type: 'info',
    text: '要拿回什么？',
    actions: (ctx: any) => {
      const actions: any[] = [];
      ctx.game.storage.forEach((i: any) => {
        actions.push({
          id: `get_${i.id}`, label: `取出 ${i.name}`, timeCost: 0.1, variant: 'default',
          effect: (ctx: any) => ctx.game.retrieveFromBox(i.id),
          nextSceneId: 'system_manage_storage'
        });
      });
      actions.push({ id: 'back_st_g', label: '取消', timeCost: 0.1, variant: 'default', nextSceneId: 'system_manage_storage' });
      return actions;
    }
  }
};

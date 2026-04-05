import type { PlotScene } from '../../types/plot';

export const locationExplorationPlots: Record<string, PlotScene> = {
  'explore_cell_01': {
    id: 'explore_cell_01',
    locationId: 'cell_01',
    type: 'info',
    text: '你的私人牢房。虽然破旧，但你在这里收集了一些简陋的“设施”：床边的引体向上杆、一叠写满逻辑题的废纸，以及一块可以用来练习反应的悬挂铁片。',
    actions: [
      { id: 'search_bed', label: '搜寻床铺', timeCost: 0.5, variant: 'default', nextSceneId: 'found_note', condition: (ctx) => !ctx.game.flags.found_crumpled_note },
      
      // 锻炼设施 -> 跳转到小游戏
      { id: 'train_strength', label: '进行力量训练', timeCost: 0.5, variant: 'default', nextSceneId: 'train_strength_game' },
      { id: 'train_dexterity', label: '练习反应抓取', timeCost: 0.5, variant: 'default', nextSceneId: 'train_dexterity_game' },
      { id: 'train_intelligence', label: '钻研逻辑难题', timeCost: 0.5, variant: 'default', nextSceneId: 'train_intelligence_game' },

      { id: 'rest', label: '稍作休息', timeCost: 1.0, variant: 'default', 
        effect: (ctx) => { 
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 15); 
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.addLog('安静的休息让你的理智恢复了一些。', 'info'); 
        },
        nextSceneId: 'explore_cell_01'
      },
      { id: 'move_corridor_a', label: '前往走廊', timeCost: 0.25, variant: 'accent', nextSceneId: 'explore_corridor_a' },
    ]
  },
  'explore_corridor_a': {
    id: 'explore_corridor_a',
    locationId: 'corridor_a',
    type: 'info',
    allowFieldRest: true,
    text: '走廊 Alpha。灯光忽明忽暗。',
    actions: [
      { id: 'move_hall_main', label: '前往设施大厅', timeCost: 0.25, variant: 'accent', nextSceneId: 'explore_hall_main' },
      { id: 'move_cell_01', label: '返回牢房', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_cell_01' },
      { id: 'move_cell_02', label: '窥视相邻牢房', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_cell_02' },
      { id: 'ask_about_facility_corridor', label: '询问路过的囚犯', timeCost: 0.5, variant: 'default',
        effect: (ctx) => { ctx.game.addLog('“这里是地狱，伙计。”', 'warning'); },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'explore_hall_main': {
    id: 'explore_hall_main',
    locationId: 'hall_main',
    type: 'story',
    allowFieldRest: true,
    text: '设施大厅。中心枢纽。',
    actions: [
      { id: 'move_corridor_a', label: '返回走廊 Alpha', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' },
      { id: 'move_med_bay', label: '前往医疗站', timeCost: 0.5, variant: 'accent', nextSceneId: 'explore_med_bay' },
      { id: 'move_mess_hall', label: '前往公共食堂', timeCost: 0.5, variant: 'accent', nextSceneId: 'explore_mess_hall' },
      { id: 'move_warehouse_back', label: '潜入秘密仓库', timeCost: 0.75, variant: 'danger', nextSceneId: 'explore_warehouse_back' },
      { id: 'get_ration_daily', label: '领取每日配给', timeCost: 0.5, variant: 'accent', 
        condition: (ctx) => !ctx.game.flags[`ration_taken_day_${ctx.game.game.day}`],
        effect: (ctx) => {
          ctx.game.flags[`ration_taken_day_${ctx.game.game.day}`] = true;
          ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '虽然难吃，但能救命。', icon: 'package', quantity: 1, category: 'consumable' });
          ctx.game.addLog('你排队领到了口粮。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      { id: 'ask_about_facility_hall', label: '寻找 NPC 询问情报', timeCost: 0.5, variant: 'accent', nextSceneId: 'ask_about_facility' },
    ]
  },
  'explore_med_bay': {
    id: 'explore_med_bay',
    locationId: 'med_bay',
    type: 'info',
    text: '医疗站。',
    actions: [
      { id: 'move_hall_main', label: '返回大厅', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' },
      { id: 'search_meds', label: '翻找医疗垃圾', timeCost: 1.0, variant: 'danger', 
        effect: (ctx) => {
          if (Math.random() < 0.2) {
            ctx.game.addLog('你找到了一支肾上腺素。', 'info');
            ctx.game.inventory.push({ id: 'adrenaline', name: '肾上腺素', description: '提升爆发力。', icon: 'zap', quantity: 1, category: 'consumable' });
          } else { ctx.game.addLog('一无所获。', 'info'); }
        },
        nextSceneId: 'explore_med_bay'
      },
      { id: 'observe_records', label: '偷看手术记录', timeCost: 0.5, variant: 'accent', 
        condition: (ctx) => ctx.game.player.stats.intelligence >= 7,
        effect: (ctx) => {
          ctx.game.addLog(`你飞快地翻阅了几页记录。上面提到“实验体 ${ctx.game.player.name}”的脑波活动出现了异常波动。`, 'story');
          ctx.game.player.stats.intelligence += 1;
        },
        nextSceneId: 'explore_med_bay'
      },
    ]
  },
  'explore_mess_hall': {
    id: 'explore_mess_hall',
    locationId: 'mess_hall',
    type: 'story',
    allowFieldRest: true,
    text: '公共食堂。',
    actions: [
      { id: 'move_hall_main', label: '返回大厅', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' },
      { id: 'move_garbage_chute', label: '前往废料处理区', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_garbage_chute' },
      { id: 'eavesdrop', label: '窃听', timeCost: 0.75, variant: 'accent', 
        effect: (ctx) => { ctx.game.addLog('你听到了一些传闻。', 'info'); },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'ask_about_facility_mess', label: '打听设施的情况', timeCost: 0.5, variant: 'accent', nextSceneId: 'ask_about_facility' },
    ]
  },
  'explore_garbage_chute': {
    id: 'explore_garbage_chute',
    locationId: 'garbage_chute',
    type: 'warning',
    text: '废料处理区。',
    actions: [
      { id: 'move_mess_hall', label: '返回食堂', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_mess_hall' },
      { id: 'stare_drain', label: '凝视排水口', timeCost: 1.0, variant: 'danger',
        condition: (ctx) => ctx.game.player.stats.sanity < 20,
        effect: (ctx) => {
          ctx.game.addLog('你看到排水口里有一只巨大的眼睛正在回望着你。', 'warning');
          ctx.game.player.stats.intelligence += 2;
          ctx.game.player.stats.sanity -= 10;
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },
  'explore_warehouse_back': {
    id: 'explore_warehouse_back',
    locationId: 'warehouse_back',
    type: 'warning',
    text: '秘密仓库。',
    actions: [
      { id: 'move_hall_main', label: '返回大厅', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' },
    ]
  },
  'explore_cell_02': {
    id: 'explore_cell_02',
    locationId: 'cell_02',
    type: 'info',
    text: '另一间牢房。',
    actions: [
      { id: 'move_corridor_a', label: '返回走廊', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' },
    ]
  }
};

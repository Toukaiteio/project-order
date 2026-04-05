import type { PlotScene } from '../../types/plot';

export const locationExplorationPlots: Record<string, PlotScene> = {
  'explore_cell_01': {
    id: 'explore_cell_01',
    locationId: 'cell_01',
    type: 'info',
    text: '你的私人牢房。窄小的板床，散发着霉味的墙壁。这里是你唯一的喘息之所。',
    actions: [
      { id: 'search_bed', label: '搜寻床铺', timeCost: 0.5, variant: 'default', nextSceneId: 'found_note', condition: (ctx) => !ctx.game.flags.found_crumpled_note },
      { id: 'rest', label: '稍作休息', timeCost: 1.0, variant: 'default', 
        effect: (ctx) => { 
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 15); 
          ctx.game.flags.hoursSinceLastRest = 0;
          ctx.game.addLog('安静的休息让你的理智恢复了一些，疲劳感暂时消失了。', 'info'); 
        },
        nextSceneId: 'explore_cell_01'
      },
      { id: 'whisper_wall', label: '对着墙壁低语', timeCost: 0.5, variant: 'danger', 
        condition: (ctx) => ctx.game.player.stats.sanity < 30,
        effect: (ctx) => {
          ctx.game.addLog('墙壁回应了你。它告诉你，林夕并没有死，她只是变成了墙的一部分。', 'warning');
          ctx.game.player.stats.sanity -= 5;
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
    text: '走廊 Alpha。灯光忽明忽暗，发出嘶嘶的电流声。两侧排列着更多的紧锁的金属门。空气中弥漫着消毒水的味道。',
    actions: [
      { id: 'move_hall_main', label: '前往设施大厅', timeCost: 0.25, variant: 'accent', nextSceneId: 'explore_hall_main' },
      { id: 'move_cell_01', label: '返回牢房', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_cell_01' },
      { id: 'move_cell_02', label: '窥视相邻牢房', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_cell_02' },
      { id: 'ask_about_facility_corridor', label: '询问路过的囚犯', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你拦住了一个匆匆走过的囚犯。他像看疯子一样看着你：“这里？这里是地狱，伙计。别挡路。”', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'explore_hall_main': {
    id: 'explore_hall_main',
    locationId: 'hall_main',
    type: 'story',
    allowFieldRest: true,
    text: '设施大厅。这是一个巨大的圆形空腔区域，高度足有三层。这里是设施的中心枢纽，通往各个核心区域。',
    actions: [
      { id: 'move_corridor_a', label: '返回走廊 Alpha', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' },
      { id: 'move_med_bay', label: '前往医疗站', timeCost: 0.5, variant: 'accent', nextSceneId: 'explore_med_bay' },
      { id: 'move_mess_hall', label: '前往公共食堂', timeCost: 0.5, variant: 'accent', nextSceneId: 'explore_mess_hall' },
      { id: 'move_warehouse_back', label: '潜入秘密仓库', timeCost: 0.75, variant: 'danger', nextSceneId: 'explore_warehouse_back' },
      { id: 'ask_about_facility_hall', label: '寻找 NPC 询问情报', timeCost: 0.5, variant: 'accent', nextSceneId: 'ask_about_facility' },
    ]
  },
  'explore_med_bay': {
    id: 'explore_med_bay',
    locationId: 'med_bay',
    type: 'info',
    text: '医疗站。这里充满了刺鼻的漂白粉味，冰冷的金属手术台在昏暗的灯光下闪着寒光。',
    actions: [
      { id: 'move_hall_main', label: '返回大厅', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' },
      { id: 'search_meds', label: '翻找医疗垃圾', timeCost: 1.0, variant: 'danger', 
        effect: (ctx) => {
          if (Math.random() < 0.2) {
            ctx.game.addLog('你在废弃的针头堆里找到了一支尚未使用的肾上腺素。', 'info');
            ctx.game.inventory.push({ id: 'adrenaline', name: '肾上腺素', description: '能在短时间内大幅提升爆发力。', icon: 'zap', quantity: 1, category: 'consumable' });
          } else {
            ctx.game.addLog('除了带血的棉球，你一无所获。', 'info');
            ctx.game.player.stats.hp -= 2; // 被划伤
          }
        },
        nextSceneId: 'explore_med_bay'
      },
      { id: 'observe_records', label: '偷看手术记录', timeCost: 0.5, variant: 'accent', 
        condition: (ctx) => ctx.game.player.stats.intelligence >= 7,
        nextSceneId: 'explore_med_bay'
      },
    ]
  },
  'explore_mess_hall': {
    id: 'explore_mess_hall',
    locationId: 'mess_hall',
    type: 'story',
    allowFieldRest: true,
    text: '公共食堂。空气中弥漫着廉价合成蛋白的味道。',
    actions: [
      { id: 'move_hall_main', label: '返回大厅', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' },
      { id: 'move_garbage_chute', label: '前往废料处理区', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_garbage_chute' },
      { id: 'eavesdrop', label: '窃听他人的谈话', timeCost: 0.75, variant: 'accent', 
        effect: (ctx) => {
          ctx.game.addLog('你听到有人在低声谈论第15天的投票，似乎有几个扇区的人达成了某种私下交易。', 'info');
          ctx.game.player.stats.intelligence += 1;
        },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'ask_about_facility_mess', label: '打听设施的情况', timeCost: 0.5, variant: 'accent', nextSceneId: 'ask_about_facility' },
    ]
  },

  'explore_warehouse_back': {
    id: 'explore_warehouse_back',
    locationId: 'warehouse_back',
    type: 'warning',
    text: '秘密仓库。这里是仓库深处的隐蔽角落，堆放着沉重的木箱。',
    actions: [
      { id: 'move_hall_main', label: '返回大厅', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' },
    ]
  },
  'explore_garbage_chute': {
    id: 'explore_garbage_chute',
    locationId: 'garbage_chute',
    type: 'warning',
    text: '废料处理区。巨大的粉碎机发出低沉的轰鸣，这里堆满了废弃的实验器材。',
    actions: [
      { id: 'move_mess_hall', label: '返回食堂', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_mess_hall' },
      { id: 'stare_drain', label: '凝视排水口', timeCost: 1.0, variant: 'danger',
        condition: (ctx) => ctx.game.player.stats.sanity < 20,
        effect: (ctx) => {
          ctx.game.addLog('你看到排水口里有一只巨大的眼睛正在回望着你。那不是人类的眼睛。', 'warning');
          ctx.game.player.stats.intelligence += 2;
          ctx.game.player.stats.sanity -= 10;
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },
  'explore_cell_02': {
    id: 'explore_cell_02',
    locationId: 'cell_02',
    type: 'info',
    text: '这是另一间牢房，门是虚掩着的。里面空无一人，但床铺被整理得很整齐。',
    actions: [
      { id: 'move_corridor_a', label: '返回走廊', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' },
    ]
  }
};

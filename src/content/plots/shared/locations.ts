import type { PlotScene } from '../../../types/plot';

export const locationExplorationPlots: Record<string, PlotScene> = {
  'explore_cell_01': {
    id: 'explore_cell_01',
    locationId: 'cell_01',
    type: 'info',
    text: '你的私人牢房。虽然破旧，但你在这里收集了一些简陋的”设施”：床边的引体向上杆、一叠写满逻辑题的废纸，以及一块可以用来练习反应的悬挂铁片。墙上有个名字被你一遍遍地描过，直到石灰开始剥落——“林...夕...”。窗口的铁栅外是黑暗，你无法判断外面是白天还是黑夜。床垫已经凹陷，塑料布发出刺鼻的气味。这个3x3 米的铁盒子，已经成为你仅有的私人领地。',
    actions: [
      { id: 'search_bed', label: '搜寻床铺', timeCost: 0.5, variant: 'default', nextSceneId: 'found_note', condition: (ctx) => !ctx.game.flags.found_crumpled_note },
      
      // 锻炼设施 -> 跳转到小游戏
      {
        id: 'train_strength', label: '做一轮力量训练', timeCost: 0.5, variant: 'default', nextSceneId: 'train_strength_game',
        effect: (ctx) => {
          if (!ctx.game.flags.first_training_hint) {
            ctx.game.flags.first_training_hint = true;
            ctx.game.addLog('灰以前说过一句话：在这里，身体和脑子只要有一边先垮掉，另一边也撑不了太久。', 'info');
          }
        }
      },
      { id: 'train_dexterity', label: '练一会儿手上的反应', timeCost: 0.5, variant: 'default', nextSceneId: 'train_dexterity_game' },
      { id: 'train_intelligence', label: '继续啃那道残题', timeCost: 0.5, variant: 'default', nextSceneId: 'train_intelligence_game' },

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
    text: '走廊 Alpha 是通往中枢设施的必经之地。灯管里有一根快要熄灭，以大约三秒一次的频率闪烁。时间长了，你会开始在心里给它计数——这是你目前拥有的最精确的时钟。墙上有人用指甲刻了什么，你每次路过都试图多辨认一个字。地板上有干涸的液体痕迹，也许是血，也许是别的什么。走廊的每个角落都有摄像头，但奇怪的是，其中几个镜头的方向已经被人为地调整过。',
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
    text: '设施大厅是整个机构的展示橱窗。摄像头覆盖了每一个角落，照明故意设计得过于明亮，让阴影无处藏身。领取配给的队伍每天排成同样的形状，像是某种仪式，而且窗口会在傍晚准时关闭。广播系统悬挂在天花板上，偶尔会发出刺耳的反馈音。你在这里说的每一句话，都被人听到了。大厅中央有一块被日常的摩擦磨光的地板，那是囚犯们走过最频繁的轨迹——每个人都试图跟随同样的路线，如同被编程一样。',
    actions: [
      { id: 'move_corridor_a', label: '返回走廊 Alpha', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' },
      { id: 'move_med_bay', label: '前往医疗站', timeCost: 0.5, variant: 'accent', nextSceneId: 'explore_med_bay' },
      { id: 'move_mess_hall', label: '前往公共食堂', timeCost: 0.5, variant: 'accent', nextSceneId: 'explore_mess_hall' },
      { id: 'move_warehouse_back', label: '潜入秘密仓库', timeCost: 0.75, variant: 'danger', nextSceneId: 'explore_warehouse_back' },
      { id: 'get_ration_daily', label: '领取每日配给', timeCost: 0.5, variant: 'accent', 
        condition: (ctx) => !ctx.game.flags[`ration_taken_day_${ctx.game.game.day}`] && ctx.game.game.time < 18,
        effect: (ctx) => {
          ctx.game.flags[`ration_taken_day_${ctx.game.game.day}`] = true;
          ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '虽然难吃，但能救命。', icon: 'package', quantity: 1, category: 'consumable' });
          ctx.game.addLog('你赶在配给窗口关闭前领到了口粮。队伍后面传来几声压低的咒骂。', 'info');
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
    text: '医疗站弥漫着消毒水的气味，强烈到令人头疼。Dr. Aris 永远在写东西，不知道在记录什么。你问他他只是抬起眼镜看你一秒，然后继续低下头。医疗站的帘子是半透明的，你有时会看到帘子后面的轮廓，不知道那是等待治疗的人还是其他什么。冷藏箱发出有规律的嗡鸣声，像是某种节奏的倒数。手术灯被关闭很久了，只留下暗淡的备用照明。空气中还有另一种气味，微弱但不容忽视——死亡的气味。',
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
    text: '食堂的噪声有一种奇特的功能：它让你感觉安全，尽管你知道这只是幻觉。这里的对话从不涉及过去，每个人都只谈论今天和明天，最多到下周。Sasha 通常一个人坐在角落，把口粮分成极小的份，细嚼慢咽，像是在计算每一口的价值。食堂的长桌是金属的，刻满了名字和符号——有些被划掉了。地面总是粘腻的，没人知道那是什么。供应口的格栅后面，能看到操作间的一角，但那里的人从来不出来。',
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
    text: '废料区的风总是朝一个方向吹，带着金属和腐烂食物的混合气味。排水沟里积着不知道来源的深色液体。粉碎机在缓慢转动，发出沉闷的齿轮音。Satoshi 在这里找到了他的第一块电路板。你注意到废料里有一些东西被刻意销毁过——芯片、记录本、衣物标签——这里是文件的坟墓。某些时间段，会有人出现在监视高台上，但他们从不干预你的搜索。',
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
    text: '仓库的门需要两个人同时推才能打开，而掮客总是一个人在里面。他坐在货架中间的一把椅子上，四周是看不出用途的箱子。灯只有一盏，恰好只照亮他的脸。每次他说话时，你能听到回声，像是这个空间远比看起来要大。货架上的东西没有标签，但掮客似乎永远知道什么在哪里。这里的空气很冷，冷得不自然。',
    actions: [
      { id: 'move_hall_main', label: '返回大厅', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' },
    ]
  },
  'explore_cell_02': {
    id: 'explore_cell_02',
    locationId: 'cell_02',
    type: 'info',
    text: 'Satoshi 的房间里的混乱是有秩序的混乱。每一根电线都知道自己去哪里，每一块拆下来的零件都有固定的位置。他在床头贴了一张手绘电路图，密密麻麻的线从一个角延伸到另一个角，像是某种地图。房间里弥漫着焊接的气味和旧油脂的味道。床下堆积着各种废料中捡来的金属片，有些还闪闪发光。在这个被监禁的空间里，Satoshi 正在构建他自己的秘密世界。',
    actions: [
      { id: 'move_corridor_a', label: '返回走廊', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' },
    ]
  }
};

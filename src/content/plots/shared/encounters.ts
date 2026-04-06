import type { PlotScene } from '../../../types/plot';

export const encounterPlots: Record<string, PlotScene> = {
  // --- Elena V. 偶遇 ---
  'encounter_elena_hall_main': {
    id: 'encounter_elena_hall_main',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      const npc = ctx.npcs.npcs['elena'];
      return `在大厅的阴影角落里，你看到了 ${npc.name}。她正聚精会神地盯着走廊尽头的感应头，手里快速记着什么。察觉到你的靠近，她冷淡地收起了笔记本。`;
    },
    actions: [
      { 
        id: 'elena_ask_plan', label: '询问她在做什么', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.npcs.interact('elena', 5, 2);
          ctx.game.addLog('“我在计算死亡的概率，”她面无表情地回答，“顺便看看谁会是下一个被送进‘回收槽’的倒霉蛋。”', 'story');
        },
        nextSceneId: 'explore_hall_main'
      },
      { 
        id: 'elena_offer_help', label: '提供协作', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 6,
        effect: (ctx) => {
          ctx.npcs.interact('elena', 15, 10);
          ctx.game.flags.elena_allied = true;
          ctx.game.addLog('她审视了你一会儿。“你的眼神还没死透。也许我们能达成某种共识。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      { id: 'elena_ignore', label: '不打扰她', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_hall_main' }
    ]
  },

  // --- Marcus T. 偶遇 (走廊收保护费) ---
  'encounter_marcus_corridor_a': {
    id: 'encounter_marcus_corridor_a',
    locationId: 'corridor_a',
    type: 'warning',
    text: 'Marcus T. 魁梧的身影挡住了去路。他正在擦拭一根沉重的金属警棍，周围的空气似乎都凝固了。',
    actions: [
      { 
        id: 'marcus_pay_toll', label: '交出一些积分 (10点)', timeCost: 0.25, variant: 'default',
        condition: (ctx) => ctx.game.game.money >= 10,
        effect: (ctx) => {
          ctx.game.game.money -= 10;
          ctx.npcs.interact('marcus', 10, 5);
          ctx.game.addLog('他接过额度卡，露出了一个令人不安的笑容。“聪明人的选择。现在，路是你的了。”', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      },
      { 
        id: 'marcus_confront', label: '强行通过', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.npcs.interact('marcus', -20, 0);
          ctx.game.player.stats.hp -= 15;
          ctx.game.addLog('他没有说话，直接给了你一棍。剧痛从腹部蔓延，你只能狼狈地退后。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  // --- Dr. Aris 偶遇 ---
  'encounter_aris_med_bay': {
    id: 'encounter_aris_med_bay',
    locationId: 'med_bay',
    type: 'story',
    text: 'Dr. Aris 正在整理一堆散乱的药剂瓶。看到你进来，他显得有些手忙脚乱，下意识地遮住了身后的一个冷藏箱。',
    actions: [
      { 
        id: 'aris_ask_meds', label: '请求一些止痛药', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          if (ctx.npcs.npcs['aris'].trust > 40) {
            ctx.game.addLog('他犹豫了一下，飞快地塞给你一个小瓶子。“拿走，别让守卫看见。”', 'info');
            ctx.game.inventory.push({
              id: 'painkillers', name: '止痛药', description: '虽然快过期了，但能缓解疼痛。', icon: 'pill', quantity: 1, category: 'consumable'
            });
          } else {
            ctx.game.addLog('“我这里的配额连重伤员都不够用，”他冷冷地拒绝了你，“去别处看看吧。”', 'warning');
          }
        },
        nextSceneId: 'explore_med_bay'
      },
      { id: 'aris_ignore', label: '只是路过', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_med_bay' }
    ]
  },

  // --- 幻觉: 走廊的小女孩 ---
  'encounter_hallucination_ghost_girl': {
    id: 'encounter_hallucination_ghost_girl',
    locationId: 'corridor_a',
    type: 'story',
    text: '走廊的尽头站着一个穿着白色裙子的小女孩。她背对着你，正在低声哭泣。在这冰冷的金属设施里，这显得极其突兀。',
    actions: [
      { 
        id: 'ghost_girl_approach', label: '走过去安慰她', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('当你触碰到她的肩膀时，她转过头——那是一张没有任何五官的脸。她发出了刺耳的尖叫。', 'warning');
          ctx.game.player.stats.sanity -= 20;
        },
        nextSceneId: 'explore_corridor_a'
      },
      { 
        id: 'ghost_girl_ignore', label: '闭上眼睛快步走过', timeCost: 0.25, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你强迫自己不去听那哭声。当你睁开眼时，女孩已经不见了。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  // --- 幻觉: 阴影商人 ---
  'encounter_hallucination_shadow_vendor': {
    id: 'encounter_hallucination_shadow_vendor',
    locationId: 'warehouse_back',
    type: 'story',
    text: '阴影中坐着一个披着大衣的男人。他向你招手，展示着一叠花绿绿的额度卡。“想要吗？只需要你的一点点……灵魂。”',
    actions: [
      { 
        id: 'shadow_vendor_deal', label: '同意交易 (失去 10 生命值)', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 10;
          ctx.game.game.money += 30;
          ctx.game.addLog('你感到身体一阵空虚，但口袋里确实多了几张沉甸甸的额度卡。男人发出了干瘪的笑声。', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      { 
        id: 'shadow_vendor_refuse', label: '拒绝这诡异的交易', timeCost: 0.25, variant: 'default',
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  },

  // --- 日常事件 ---
  'daily_d04_isolation': {
    id: 'daily_d04_isolation',
    locationId: 'cell_01',
    type: 'warning',
    text: '夜深了。隔壁牢房传来低声的哭泣，断断续续的，像是有人在压抑自己的绝望。哭声持续了整个晚上，直到天亮。',
    actions: [
      {
        id: 'tap_wall_response',
        label: '敲墙回应她',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.heard_sasha_cry = true;
          ctx.npcs.npcs['sasha'].trust = Math.min(100, ctx.npcs.npcs['sasha'].trust + 5);
          ctx.game.addLog('你敲了几下墙，那边的哭声停了。片刻后，你听到了轻微的敲击回应——节奏很慢，但有规律。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'ignore_cry',
        label: '用枕头捂住耳朵',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你用枕头捂住了耳朵。渐渐地，你学会了如何不去听。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'wait_silent',
        label: '不动声色地等待',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你躺在黑暗中，听着隔壁的哭声。对这个地方的适应，有时候更像是腐蚀。', 'warning');
          ctx.game.player.stats.intelligence += 1;
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  'daily_d06_food_queue': {
    id: 'daily_d06_food_queue',
    locationId: 'hall_main',
    type: 'warning',
    text: '在配给站，一个面生的高大囚犯粗暴地从你前面的老人手中夺走了口粮。老人没有反抗，只是空洞地看着。周围的人都装作没有看见。',
    actions: [
      {
        id: 'intervene_food_theft',
        label: '出手干预 (力量检定)',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 9);
          ctx.game.addLog(`（力量检定：${check.roll} + ${ctx.game.player.stats.strength} = ${check.total}）`, 'info');
          if (check.success) {
            ctx.game.addLog('你强行夺回了口粮交给老人。那个高大的囚犯愤怒地瞪了你一眼，但在众目睽睽之下没有继续。老人眼中闪过一丝感激。', 'info');
            ctx.npcs.npcs['marcus'].met = true; // 随机 NPC 出现的占位
          } else {
            ctx.game.player.stats.hp -= 8;
            ctx.game.addLog('你被狠狠地推了一下，撞在了墙上。口粮还是被抢走了。', 'danger');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'record_incident',
        label: '无声地记录',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 1;
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你默默地看着这一切，在脑海中记下了这一刻。目睹而袖手……这是一种特殊的堕落。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'look_away',
        label: '假装没有看见',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你低下了头。当你再抬起来时，一切都结束了。只是，你发现自己没有停下来。这件事让你很不安。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  'daily_d07_nightmare': {
    id: 'daily_d07_nightmare',
    locationId: 'cell_01',
    type: 'story',
    text: '夜里的梦很深。你梦见了墙上那个名字——"林...夕..."——她在对你说话。她的嘴在动，但发不出声音。你拼命地想听清，却只听到了尖叫。\n你突然惊醒，大汗淋漓。心脏在狂跳，手抖个不停。',
    onEnter: (ctx) => {
      ctx.game.player.stats.sanity -= 5;
      ctx.game.player.stats.intelligence += 1;
    },
    actions: [
      {
        id: 'cope_with_nightmare',
        label: '从梦境中恢复',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('梦境留下了某种东西，但你说不上来是什么。也许是一个线索，也许只是疯狂的回声。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  'daily_d09_wall_tap': {
    id: 'daily_d09_wall_tap',
    locationId: 'corridor_a',
    type: 'warning',
    text: '走廊里有人在敲墙。节奏很有规律——快、快、慢、快、慢、慢——像是某种密码。这种敲击声持续了好几分钟，然后突然停止。沉寂中，你能听到对面同样的回应。',
    actions: [
      {
        id: 'decode_morse',
        label: () => `破译密码 (需要智力 >= 6)`,
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 6,
        effect: (ctx) => {
          ctx.game.flags.knows_they_count = true;
          ctx.game.addLog('你集中精神，试图在脑海中还原这个模式。最后，你破译出了两个字：\n"他们在数人。"', 'danger');
          ctx.game.player.stats.intelligence += 2;
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'ignore_tapping',
        label: '听不懂，继续走',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你听到了这个声音，但意义不明。也许不是密码。也许是某个人已经疯了，在墙上发泄。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  'daily_d13_white_coat': {
    id: 'daily_d13_white_coat',
    locationId: 'hall_main',
    type: 'story',
    text: '一个穿着洁白制服的人穿过大厅。设施里的所有声音都在一瞬间停止了。囚犯们的目光纷纷下移，没有人敢抬头。那个白衣人扫过这些低眉顺眼的身体，面无表情。',
    onEnter: (ctx) => {
      ctx.game.addLog('在他经过时，你感到了什么叫做绝对的权力——而你，正是被权力注视的对象。', 'warning');
    },
    actions: [
      {
        id: 'stare_at_white_coat',
        label: '盯着他看',
        timeCost: 0.5,
        variant: 'danger',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'crumpled_note'),
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 5;
          ctx.game.addLog('心跳加速，你意识到你在违背那张纸条的警告。他的眼角似乎察觉到了什么，但他没有停留。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'lower_head_white_coat',
        label: '低下头',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你学会了不引起注意。这可能是这个地方最重要的一课。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  // --- Grey 初次偶遇（未接纳前的选择机会） ---
  'encounter_grey_before_met': {
    id: 'encounter_grey_before_met',
    locationId: 'corridor_a',
    type: 'story',
    text: '一个穿着宽大灰色连帽衫的人在黑暗的走廊角落缓缓转过身。他的眼神很清澈，但眼底有某种深邃的疲惫。"你还活着。很多人没有。"他轻声说。',
    actions: [
      {
        id: 'follow_grey', label: '跟随他了解更多', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => !ctx.game.flags.companion_met,
        effect: (ctx) => {
          ctx.npcs.npcs['grey'].location = 'cell_01';
          ctx.game.flags.companion_met = true;
          ctx.game.addLog('他带你回到你的牢房，推开门。"我叫灰。接下来，我们有很多要谈的。"', 'info');
        },
        nextSceneId: 'companion_intro'
      },
      {
        id: 'ignore_grey', label: '匆匆离开', timeCost: 0.25, variant: 'default',
        condition: (ctx) => !ctx.game.flags.companion_met,
        effect: (ctx) => {
          ctx.game.addLog('灰没有追上来。你只是听到他在身后低声说："不愿意接纳帮助的人，往往活不久。"', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  // --- 囚犯打斗现场 ---
  'encounter_prisoner_brawl': {
    id: 'encounter_prisoner_brawl',
    locationId: 'corridor_a',
    type: 'warning',
    text: '前方传来了沉闷的撞击声和闷哼声。两个囚犯正在互相殴打，周围的人形成了一个圆圈旁观。卫兵们似乎对此习以为常，只是在一旁看着。其中一个人正在处于劣势，血从他的嘴角流出。',
    actions: [
      {
        id: 'intervene_brawl', label: '冲进去拉开他们 (力量检定)', timeCost: 1.0, variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 12);
          ctx.game.addLog(`（力量检定：${check.roll} + ${ctx.game.player.stats.strength} = ${check.total}）`, 'info');
          if (check.success) {
            ctx.game.addLog('你强行分开了两人。打斗停止了，但周围的人看你的眼神变得奇异。卫兵没有干预，只是冷冷地记录下来。', 'info');
            ctx.game.player.stats.hp -= 5;
            ctx.game.player.stats.sanity -= 2;
          } else {
            ctx.game.addLog('你被愤怒的拳头击中，倒在地上。打斗还在继续，现在包括你。', 'danger');
            ctx.game.player.stats.hp -= 20;
          }
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'watch_brawl', label: '旁观整个过程', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('打斗持续了几分钟，最后处于优势的人站起身，摇摇晃晃地走开了。失败者被其他人抬走。你学到的是：在这里，暴力有其自己的秩序。', 'warning');
          ctx.game.player.stats.intelligence += 1;
          ctx.game.player.stats.sanity -= 3;
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'avoid_brawl', label: '改变路线绕过', timeCost: 0.25, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有停留。也许这是正确的选择。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  // --- Aris 的秘密冷藏箱 ---
  'encounter_aris_secret_box': {
    id: 'encounter_aris_secret_box',
    locationId: 'med_bay',
    type: 'story',
    text: (ctx) => {
      const aris = ctx.npcs.npcs['aris'];
      if (!aris || aris.trust <= 40) {
        return 'Aris 在整理医疗用品。他看到你靠近时，下意识地转身挡住了身后的一个冷藏箱。"这个不用碰。"他冷冷地说。';
      }
      return 'Aris 在你进入时抬起头。他的眼神中有些犹豫。"你已经证明了自己。也许……该让你看看真相了。"';
    },
    actions: [
      {
        id: 'open_secret_box',
        label: '打开冷藏箱 (需要 Aris 信任 > 40)',
        timeCost: 2.0,
        variant: 'danger',
        condition: (ctx) => ctx.npcs.npcs['aris'].trust > 40,
        effect: (ctx) => {
          ctx.game.flags.aris_box_opened = true;
          ctx.game.inventory.push({
            id: 'experiment_death_records',
            name: '实验死亡档案',
            description: '被冷藏保存的文件。你的名字在第三页，但被划掉了。这意味着什么？',
            icon: 'document',
            quantity: 1,
            category: 'document'
          });
          ctx.game.addLog('冷藏箱打开时发出一阵冷雾。里面是一摞被冻得很硬的文件夹。Aris 递给你其中一个。', 'info');
          ctx.game.addLog('你翻开文件，看到了名单——实验从开始到现在已死亡的所有囚犯。第一页上有 47 个名字。你的名字在第三页，但被红笔划掉了，旁边注明：临时保留 / 高价值样本。', 'danger');
          ctx.game.player.stats.sanity -= 10;
          ctx.game.player.stats.intelligence += 5;
          ctx.npcs.interact('aris', 10, 20);
          ctx.game.addLog('"现在，你和我都是这个秘密的共谋者。如果他们知道……"Aris 没有说完，但你理解了。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'refuse_secret_box',
        label: '我不想知道',
        timeCost: 0.5,
        variant: 'default',
        condition: (ctx) => ctx.npcs.npcs['aris'].trust > 40,
        effect: (ctx) => {
          ctx.game.addLog('Aris 平静地关上了冷藏箱。"聪明。有些真相，知道反而更危险。"', 'info');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'confront_aris',
        label: '质问他这是什么',
        timeCost: 0.5,
        variant: 'danger',
        condition: (ctx) => ctx.npcs.npcs['aris'].trust <= 40,
        effect: (ctx) => {
          ctx.npcs.interact('aris', -20, -30);
          ctx.game.addLog('"不该你看的东西。出去。"Aris 的语气变得冰冷而危险。', 'danger');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  }
};

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
        label: '伸手把人拦下来',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 9);
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

  'daily_d08_ration_cut': {
    id: 'daily_d08_ration_cut',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天的配给队伍异常漫长。扩音器里反复播放着一条冷冰冰的通知：“因贡献率下滑，自今日起，基础口粮下调 30%。”队伍里立刻爆发出压抑的骚动，有人开始偷偷把视线投向别人手里的食物。',
    onEnter: (ctx) => {
      ctx.game.addLog('有人把口粮塞进衣服里时，动作快得像在藏刀。', 'danger');
    },
    actions: [
      {
        id: 'd08_hold_line',
        label: '硬顶住前面的人',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 11);
          if (check.success) {
            ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '虽然难吃，但能救命。', icon: 'package', quantity: 1, category: 'consumable' });
            ctx.game.addLog('你没有被挤出队伍，甚至多抢下了一份被踩扁的口粮。周围几道目光因此变得凶狠。', 'warning');
            ctx.game.game.money += 10;
          } else {
            ctx.game.player.stats.hp -= 10;
            ctx.game.game.hunger = Math.max(0, ctx.game.game.hunger - 8);
            ctx.game.addLog('你被人群撞开，肋下挨了一记肘击。等你重新站稳时，发放窗口已经关了。', 'danger');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd08_trade_slot',
        label: '把排位卖给别人',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.game.money += 25;
          ctx.game.player.stats.sanity -= 4;
          ctx.game.game.hunger = Math.max(0, ctx.game.game.hunger - 10);
          ctx.game.addLog('你用自己的位置换到了一点积分。口袋沉了一些，胃却更空了。你知道这不是能常做的交易。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd08_watch_hungry',
        label: '观察人群反应',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 1;
          ctx.game.flags.knows_food_is_currency = true;
          ctx.game.addLog('你注意到最先失控的不是最虚弱的人，而是那些已经开始囤粮的人。这里的秩序，正在围绕食物重组。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
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
        label: '停下来琢磨这段节奏',
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

  'daily_d10_body_removal': {
    id: 'daily_d10_body_removal',
    locationId: 'corridor_a',
    type: 'warning',
    text: '两名守卫推着金属担架穿过走廊。上面盖着一块灰布，布的边缘渗出已经发黑的血。你看见担架经过的牢房门上，被白漆刷掉了一个编号，像是那个人从来没有存在过。',
    onEnter: (ctx) => {
      ctx.game.addLog('围观的人都很安静。不是因为悲伤，而是因为每个人都在计算：下一个会不会轮到自己。', 'danger');
    },
    actions: [
      {
        id: 'd10_check_tag',
        label: '凑近看一眼标签',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.intelligence, 12);
          if (check.success) {
            ctx.game.flags.knows_non_contributor = true;
            ctx.game.player.stats.intelligence += 2;
            ctx.game.addLog('你看清了标签上的字样：非贡献者 / 优先移除。担架推远后，那几个字还留在你脑子里。', 'danger');
          } else {
            ctx.game.player.stats.sanity -= 5;
            ctx.game.addLog('你只来得及看见一个打叉的名字。那一瞬间你莫名觉得，那个名字本该是你。', 'warning');
          }
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd10_help_push',
        label: '帮忙推担架',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 4;
          ctx.game.player.stats.sanity -= 6;
          ctx.game.game.money += 15;
          ctx.game.addLog('守卫默认了你的顺从，塞给你一点积分作为“劳务补贴”。灰布下传来的重量却一直压在你的手腕上。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd10_back_off',
        label: '退到一边',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有上前。但担架轮子碾过地面的声音，还是在你耳边停留了很久。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  'daily_d12_food_debt': {
    id: 'daily_d12_food_debt',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂今天没有开灯，只留了一排应急红光。掮客的跑腿人沿桌子挨个敲击金属面板，提醒所有欠账者必须在三天内补足食物差额，否则将被列入“非贡献者”名单。',
    onEnter: (ctx) => {
      ctx.game.addLog('没人质疑这份名单是谁定的。你只看见几个人把自己的口粮抱得更紧了。', 'danger');
    },
    actions: [
      {
        id: 'd12_pay_food_debt',
        label: '咬牙换下一份口粮',
        timeCost: 0.5,
        variant: 'accent',
        condition: (ctx) => ctx.game.game.money >= 20,
        effect: (ctx) => {
          ctx.game.game.money -= 20;
          ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '虽然难吃，但能救命。', icon: 'package', quantity: 1, category: 'consumable' });
          ctx.game.flags.prepared_food_for_day15 = true;
          ctx.game.addLog('你用高价换来一份口粮。所有人都知道你在囤货，但至少你还握着选择权。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd12_mark_names',
        label: '记住被点名的人',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 1;
          ctx.game.flags.knows_they_count = true;
          ctx.game.addLog('你默默记下了那几个名字。你突然意识到，明面上的配给表其实也是一张处决预告。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd12_slip_away',
        label: '趁没人注意离开',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.game.hunger = Math.max(0, ctx.game.game.hunger - 6);
          ctx.game.addLog('你不想继续听下去了。但逃开并不会让名单消失。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
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

  'daily_d14_pre_vote_pressure': {
    id: 'daily_d14_pre_vote_pressure',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅中央的新告示牌前挤满了人。上面贴出了最新的“贡献排序”，你的名字也在其中。最底部几行被红笔圈了起来，旁边写着一行字：明日统一表决前完成最终评估。',
    onEnter: (ctx) => {
      ctx.game.setObjective('在明天的表决前，决定你要靠什么活下来');
      ctx.game.addLog('直到这一刻，所有人都终于明白，第 15 天的投票并不是突然发生，而是已经筹备了很多天。', 'danger');
    },
    actions: [
      {
        id: 'd14_study_board',
        label: '盯着名单看下去',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.intelligence, 13);
          if (check.success) {
            ctx.game.flags.day15_formula_known = true;
            ctx.game.player.stats.intelligence += 2;
            ctx.game.addLog('你看了一遍又一遍，终于看出红笔圈住的人几乎都有同一个特点：最近几天，他们不是断过粮，就是没人替他们说话。', 'danger');
          } else {
            ctx.game.player.stats.sanity -= 4;
            ctx.game.addLog('你越看越头疼。表格上的数字像在故意旋转，仿佛它们的目的就是逼人崩溃。', 'warning');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd14_make_presence',
        label: '当众表明自己不是软柿子',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 11);
          if (check.success) {
            ctx.game.flags.day15_intimidation = true;
            ctx.game.addLog('你逼退了两个试图拿你开刀的人。代价是，大厅里每个人都记住了你。', 'warning');
          } else {
            ctx.game.player.stats.hp -= 12;
            ctx.game.addLog('你没能撑住场面，反而被狠狠教训了一顿。明天投票前，你看起来更像个目标。', 'danger');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd14_hide_ration',
        label: '回去藏好自己的食物',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.day15_food_hidden = true;
          ctx.game.addLog('你把身上的口粮重新分藏到几个地方。至少明天来临前，不会有人轻易从你手里拿走它。', 'info');
        },
        nextSceneId: 'explore_hall_main'
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
        id: 'intervene_brawl', label: '冲进去把人拽开', timeCost: 1.0, variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 12);
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
      },
      {
        id: 'aris_box_leave',
        label: '转身离开',
        timeCost: 0.1,
        variant: 'default',
        nextSceneId: 'explore_med_bay'
      }
      ]
      },

      // --- 新增随机偶遇事件池 ---

      'encounter_stolen_tools': {
      id: 'encounter_stolen_tools',
      locationId: 'mess_hall',
      type: 'warning',
      text: '你在食堂的长凳下面发现了一个沉甸甸的包裹。里面是一组被偷出来的精密维修工具，上面还带着油渍和编号。如果守卫发现谁拿着这些，那个人肯定会被关禁闭。',
      actions: [
      {
        id: 'take_stolen_tools', label: '据为己有', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'precision_tools', name: '精密工具组', description: '虽然来路不正，但在修理和拆卸时非常有用。', icon: 'settings', quantity: 1, category: 'tool' });
          ctx.game.addLog('你飞快地把包裹藏进衣服里。心脏跳得飞快。', 'warning');
          ctx.game.player.stats.dexterity += 1;
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'report_stolen_tools', label: '向守卫举报', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.game.money += 20;
          ctx.game.addLog('守卫粗鲁地拿走了工具，并在你的额度卡上划了 20 积分。你注意到其他囚犯看你的眼神变得更加冰冷了。', 'info');
          ctx.game.player.stats.sanity -= 5;
        },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'leave_stolen_tools', label: '假装没看见，离开', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_mess_hall' }
      ]
      },

      'encounter_hallucination_wall_blood': {
      id: 'encounter_hallucination_wall_blood',
      locationId: 'corridor_a',
      type: 'story',
      text: '走廊的墙壁突然开始渗出深红色的液体。液体汇聚成一个又一个模糊的单词，像是某种警告，又像是垂死者的诅咒。你揉了揉眼睛，那些字迹却变得更加清晰。',
      actions: [
      {
        id: 'read_blood_words', label: '试图读出那些字', timeCost: 1.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('你辨认出了其中一个词：“回收”。紧接着，所有的红字都化作了灰尘消失了。你的头痛得厉害。', 'danger');
          ctx.game.player.stats.intelligence += 2;
          ctx.game.player.stats.sanity -= 15;
        },
        nextSceneId: 'explore_corridor_a'
      },
      { id: 'run_away_blood', label: '尖叫着跑开', timeCost: 0.25, variant: 'default', 
        effect: (ctx) => { ctx.game.player.stats.sanity -= 8; },
        nextSceneId: 'explore_corridor_a' 
      }
      ]
      },

      'encounter_sasha_whisper': {
      id: 'encounter_sasha_whisper',
      locationId: 'mess_hall',
      type: 'story',
      text: 'Sasha 在经过你身边时，极快地塞了一张纸条到你手里。她没有停下脚步，甚至没有看你一眼。',
      condition: (ctx) => ctx.npcs.npcs['sasha'].trust > 30,
      actions: [
      {
        id: 'read_sasha_note', label: '偷偷读纸条', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('纸条上写着：“今晚不要去废料处理区，他们在那儿数人。”', 'warning');
          ctx.game.flags.sasha_warning_received = true;
        },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'discard_sasha_note', label: '立刻销毁纸条', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_mess_hall' }
      ]
      },

      'encounter_grey_shadow': {
      id: 'encounter_grey_shadow',
      locationId: 'hall_main',
      type: 'story',
      text: '你在繁忙的大厅人群中看到了灰的身影。他靠在支柱旁，似乎在观察守卫换岗的节奏。当他发现你在看他时，他做了一个“噤声”的手势，然后迅速消失在转角。',
      actions: [
      { id: 'grey_shadow_nod', label: '向他微微点头', timeCost: 0.1, variant: 'default', 
        effect: (ctx) => { ctx.npcs.interact('grey', 5, 0); },
        nextSceneId: 'explore_hall_main' 
      },
      { id: 'grey_shadow_ignore', label: '继续做自己的事', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_hall_main' }
      ]
      },

      'encounter_system_glitch': {
      id: 'encounter_system_glitch',
      locationId: 'corridor_a',
      type: 'warning',
      text: '走廊里的自动广播系统突然发出了刺耳的杂音。在一连串毫无意义的代码中，你似乎听到了一个女人的求救声，随后是一段长长的忙音。',
      actions: [
      {
        id: 'glitch_investigate', label: '检查旁边的维护面板', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 8,
        effect: (ctx) => {
          ctx.game.addLog('面板里的一块芯片已经烧焦了。但在它最后留下的日志里，你看到了一串坐标。', 'info');
          ctx.game.flags.found_hidden_coordinates = true;
        },
        nextSceneId: 'explore_corridor_a'
      },
      { id: 'glitch_ignore', label: '快步走开', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_corridor_a' }
      ]
      },

      'encounter_mystery_pill': {
      id: 'encounter_mystery_pill',
      locationId: 'med_bay',
      type: 'info',
      text: '在 Aris 不注意的时候，你发现桌角掉落了一颗没有包装的蓝色胶囊。这种颜色的药剂你从未在配给中见过。',
      actions: [
      {
        id: 'swallow_blue_pill', label: '立刻吞下去', timeCost: 0.25, variant: 'danger',
        effect: (ctx) => {
          const rand = Math.random();
          if (rand < 0.3) {
            ctx.game.addLog('一股暖流流遍全身，你感到前所未有的清醒。', 'info');
            ctx.game.player.stats.intelligence += 3;
            ctx.game.player.stats.maxSanity += 5;
          } else if (rand < 0.6) {
            ctx.game.addLog('强烈的呕吐感袭来，你几乎无法呼吸。', 'danger');
            ctx.game.player.stats.hp -= 20;
          } else {
            ctx.game.addLog('你开始看到五彩斑斓的幻觉，仿佛墙壁在唱歌。', 'warning');
            ctx.game.player.stats.sanity -= 20;
          }
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'pocket_blue_pill', label: '先揣进兜里', timeCost: 0.25, variant: 'default',
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'mystery_blue_pill', name: '神秘蓝色胶囊', description: '来源不明。吞下它可能需要勇气。', icon: 'pill', quantity: 1, category: 'consumable' });
        },
        nextSceneId: 'explore_med_bay'
      },
      { id: 'leave_blue_pill', label: '装作没看见', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_med_bay' }
      ]
      },

      'encounter_rat_nest': {
      id: 'encounter_rat_nest',
      locationId: 'garbage_chute',
      type: 'warning',
      text: '在废料堆深处，你发现了一窝变异的硕鼠。它们正在啃食一块看起来像是电子主板的东西。看到你靠近，领头的硕鼠露出了锋利的牙齿。',
      actions: [
      {
        id: 'fight_rats', label: '赶走它们夺回主板', timeCost: 1.0, variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength, 10);
          if (check.success) {
            ctx.game.addLog('你用铁管赶走了它们，虽然手上被抓伤了，但拿到了主板。', 'info');
            ctx.game.inventory.push({ id: 'fried_mainboard', name: '焦黑的主板', description: '虽然受损，但对 Satoshi 应该有价值。', icon: 'zap', quantity: 1, category: 'misc' });
            ctx.game.player.stats.hp -= 5;
          } else {
            ctx.game.addLog('硕鼠非常疯狂，你不得不退后，手臂上留下了一道深深的伤口。', 'danger');
            ctx.game.player.stats.hp -= 15;
          }
        },
        nextSceneId: 'explore_garbage_chute'
      },
      { id: 'leave_rats', label: '让它们继续享用', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_garbage_chute' }
      ]
      },

      'encounter_broken_mirror': {
      id: 'encounter_broken_mirror',
      locationId: 'cell_02',
      type: 'story',
      text: 'Satoshi 的房间里有一面破碎的小镜子。你路过时，镜子里映射出的却不是现在的你，而是几年前的你——穿着整洁的衣服，在一个阳光明媚的公园里，正对着谁微笑。',
      actions: [
      {
        id: 'stare_mirror_memory', label: '凝视镜子中的回忆', timeCost: 1.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('那份遥远的幸福感让你心如刀割。当你回过神时，镜子里只剩下了形容枯槁的自己。', 'warning');
          ctx.game.player.stats.sanity -= 10;
          ctx.game.player.stats.maxSanity += 2;
        },
        nextSceneId: 'explore_cell_02'
      },
      { id: 'smash_mirror', label: '打破这面镜子', timeCost: 0.25, variant: 'danger', 
        effect: (ctx) => { ctx.game.addLog('你不想再看到那些幻象。碎片割破了你的手指，但也让你清醒了过来。', 'info'); },
        nextSceneId: 'explore_cell_02' 
      }
      ]
      },

      'encounter_guard_humiliation': {
      id: 'encounter_guard_humiliation',
      locationId: 'hall_main',
      type: 'warning',
      text: '一名守卫正故意踢翻一名年老囚犯的餐盘，发出的铁器碰撞声在寂静的大厅里格外响亮。守卫正狂笑着要求老人跪下去舔干净地上的粘稠物。',
      actions: [
      {
        id: 'guard_hum_stop', label: '故意在远处弄出响动引开守卫', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 14);
          if (check.success) {
            ctx.game.addLog('守卫被远处的声响吸引，骂骂咧咧地走了过去。老人趁机逃离。你感到了某种久违的正义感。', 'info');
            ctx.game.player.stats.sanity += 5;
          } else {
            ctx.game.addLog('守卫发现你在捣乱，直接过来给了你一托。', 'danger');
            ctx.game.player.stats.hp -= 10;
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      { id: 'guard_hum_ignore', label: '低下头，加快脚步', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_hall_main' }
      ]
      },

      'encounter_mystery_whisper_vent': {
      id: 'encounter_mystery_whisper_vent',
      locationId: 'corridor_a',
      type: 'story',
      text: '走廊上方的通风管道里传来了极其微弱的低语声。那不是人类的声音，更像是成千上万只昆虫在同时振翅，并拼凑出了你的名字。',
      actions: [
      {
        id: 'listen_vent_closely', label: '凑近通风口倾听', timeCost: 1.0, variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('你听到了一个声音在低语：“门在向内开启，而你在向外死去。”你感到耳朵里流出了温热的液体。', 'danger');
          ctx.game.player.stats.sanity -= 15;
          ctx.game.player.stats.intelligence += 3;
        },
        nextSceneId: 'explore_corridor_a'
      },
      { id: 'ignore_vent_whisper', label: '捂住耳朵跑开', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' }
      ]
      },

  'encounter_old_photo': {
    id: 'encounter_old_photo',
    locationId: 'corridor_a',
    type: 'story',
    text: '你在地砖的缝隙里发现了一张褪色的照片。照片上是一对年轻夫妇在海边的合影，背景是蔚蓝的海水和明亮的阳光。这色彩与这里单调的灰色形成了鲜明的对比。',
    actions: [
      { id: 'keep_photo', label: '收藏照片', timeCost: 0.25, variant: 'accent',
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'old_photo', name: '褪色的照片', description: '海边的回忆，虽然可能不属于你。', icon: 'image', quantity: 1, category: 'misc' });
          ctx.game.player.stats.sanity += 3;
          ctx.game.addLog('你小心地擦掉照片上的灰尘。看着那片海，你感到胸口有一阵微弱的暖意。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      },
      { id: 'discard_photo', label: '它在这里毫无意义', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_corridor_a' }
    ]
  },

  'encounter_leaking_steam': {
    id: 'encounter_leaking_steam',
    locationId: 'garbage_chute',
    type: 'warning',
    text: '一段管道破裂了，滚烫的蒸汽嘶嘶地喷涌而出，挡住了去路。蒸汽中混合着某种甜腻的、令人作呕的化学气味。',
    actions: [
      { id: 'fix_steam_leak', label: '尝试修复管道', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.dexterity >= 7,
        effect: (ctx) => {
          ctx.game.player.stats.dexterity += 1;
          ctx.game.addLog('你利用旁边的废铁片暂时封住了裂口。蒸汽停止了喷涌。', 'info');
        },
        nextSceneId: 'explore_garbage_chute'
      },
      { id: 'run_through_steam', label: '强行冲过去', timeCost: 0.25, variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 12;
          ctx.game.addLog('高温蒸汽瞬间灼伤了你的皮肤。你跌跌撞撞地冲到了另一边。', 'danger');
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },

  'encounter_hidden_stash_brick': {
    id: 'encounter_hidden_stash_brick',
    locationId: 'cell_01',
    type: 'info',
    text: '你注意到墙角的一块砖头有些松动。当你把它撬开时，发现后面隐藏着一个小空间。',
    actions: [
      { id: 'check_brick_stash', label: '检查隐藏空间', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          const rand = Math.random();
          if (rand < 0.4) {
            ctx.game.game.money += 15;
            ctx.game.addLog('你在里面发现了几张旧的额度卡，虽然有些磨损但还能使用。', 'info');
          } else if (rand < 0.7) {
            ctx.game.inventory.push({ id: 'moldy_bread', name: '发霉的面包', description: '虽然恶心，但至少是食物。', icon: 'package', quantity: 1, category: 'consumable' });
            ctx.game.addLog('里面藏着半块干硬的发霉面包。', 'warning');
          } else {
            ctx.game.addLog('里面除了一些蜘蛛网和灰尘外什么也没有。看来前任住户已经把它带走了。', 'info');
          }
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  'encounter_broken_vending': {
    id: 'encounter_broken_vending',
    locationId: 'hall_main',
    type: 'info',
    text: '大厅角落有一台早已报废的自动贩卖机。屏幕闪烁着微弱的红光，发出阵阵卡壳的声音。',
    actions: [
      { id: 'kick_vending', label: '用力踹它一脚', timeCost: 0.25, variant: 'danger',
        effect: (ctx) => {
          if (Math.random() < 0.3) {
            ctx.game.addLog('伴随着一阵金属撞击声，一罐过期的苏打水掉了出来。', 'info');
            ctx.game.inventory.push({ id: 'old_soda', name: '过期苏打水', description: '气泡已经跑光了，但甜味还在。', icon: 'package', quantity: 1, category: 'consumable' });
          } else {
            ctx.game.addLog('除了让你的脚趾生疼外，它没有任何反应。', 'warning');
            ctx.game.player.stats.hp -= 1;
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      { id: 'dismantle_vending', label: '尝试拆卸零件', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 8,
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'electronic_parts', name: '电子零件', description: '一些还没烧掉的电容和线材。', icon: 'settings', quantity: 2, category: 'misc' });
          ctx.game.addLog('你巧妙地拆下了一些有用的电子元件。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  'encounter_guard_sleep': {
    id: 'encounter_guard_sleep',
    locationId: 'corridor_a',
    type: 'warning',
    text: '一名年轻的守卫坐在椅子上睡着了，他的配枪半挂在腰间，警棍掉在脚边。这是极少数卫兵露出破绽的时刻。',
    actions: [
      { id: 'steal_guard_key', label: '尝试偷走他的钥匙卡', timeCost: 1.0, variant: 'danger',
        condition: (ctx) => ctx.game.player.stats.dexterity >= 9,
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'guard_keycard_temp', name: '临时权限卡', description: '可以开启一些低等级的电子锁。', icon: 'key', quantity: 1, category: 'key' });
          ctx.game.addLog('你的手稳如泰山。在不惊动他的情况下，你拿到了那张蓝色的磁卡。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      },
      { id: 'pass_guard_quiet', label: '屏住呼吸悄悄绕过', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' }
    ]
  },

  'encounter_crying_child_hallucination': {
    id: 'encounter_crying_child_hallucination',
    locationId: 'mess_hall',
    type: 'story',
    text: '食堂的喧闹声中，你突然听到了一声清脆的童笑。你转过头，看到桌子下面跑过一个模糊的彩色身影，但在这一片灰暗的囚服中，那是不可能存在的。',
    actions: [
      { id: 'chase_child_illusion', label: '追上去看看', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('你冲到了桌子对面，那里只有几个正在木然咀嚼的囚犯。其中一人用看疯子的眼神盯着你。', 'warning');
          ctx.game.player.stats.sanity -= 12;
        },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'ignore_child_illusion', label: '低头喝自己的汤', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_mess_hall' }
    ]
  },

  'encounter_rat_friend': {
    id: 'encounter_rat_friend',
    locationId: 'cell_01',
    type: 'story',
    text: '一只瘦小的老鼠出现在你的床脚。它没有逃跑，而是用那双黑亮的小眼睛注视着你，甚至发出了一阵温顺的吱吱声。',
    actions: [
      { id: 'feed_rat_friend', label: '分给它一点食物渣', timeCost: 0.5, variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          ctx.game.player.stats.sanity += 10;
          ctx.game.addLog('老鼠衔起碎屑跑回了洞穴。在这个孤独的地狱里，你感到自己并不完全是一个人。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      },
      { id: 'shoo_rat', label: '把它轰走', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_cell_01' }
    ]
  },

  'encounter_flickering_monitor': {
    id: 'encounter_flickering_monitor',
    locationId: 'hall_main',
    type: 'warning',
    text: '墙上的一台监控显示器由于信号干扰出现了黑白花屏。在雪花点中，偶尔会闪过一个房间的内部画面，那看起来像是一间监控室，桌上放着一份名单。',
    actions: [
      { id: 'memo_monitor_list', label: '强记画面中的名单', timeCost: 1.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 9,
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('你记住了名单上的几个名字，它们都在“已清理”一栏下面。这让你感到脊背发凉。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      },
      { id: 'monitor_ignore', label: '只是普通的故障', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_hall_main' }
    ]
  },

  'encounter_clogged_vent': {
    id: 'encounter_clogged_vent',
    locationId: 'med_bay',
    type: 'info',
    text: '医疗站的通风口传来了奇怪的刮擦声，似乎有什么东西堵在了栅栏后面。',
    actions: [
      { id: 'pry_vent_open', label: '撬开栅栏', timeCost: 0.75, variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('你撬开了锈迹斑斑的栅栏。里面竟然塞着一个装满旧信件的包裹。', 'info');
          ctx.game.inventory.push({ id: 'old_letters', name: '未寄出的信件', description: '写给家人的信，但永远没有寄出去的机会。', icon: 'document', quantity: 1, category: 'document' });
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },

  'encounter_blood_on_handle': {
    id: 'encounter_blood_on_handle',
    locationId: 'corridor_a',
    type: 'warning',
    text: '当你准备推开一扇门时，发现门把手上沾满了温热、新鲜的血液。门内传来了轻微的、重物拖行的声音。',
    actions: [
      { id: 'peek_inside_door', label: '从门缝往里窥视', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('你只看到了一个黑影在拐角消失。地板上留下的拖行痕迹让你心跳加速。', 'danger');
          ctx.game.player.stats.sanity -= 8;
        },
        nextSceneId: 'explore_corridor_a'
      },
      { id: 'walk_away_quietly', label: '悄无声息地离开', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' }
    ]
  },

  'encounter_mysterious_vendor_whisper': {
    id: 'encounter_mysterious_vendor_whisper',
    locationId: 'warehouse_back',
    type: 'story',
    text: '掮客今天的心情似乎不错。他一边数着额度卡，一边低声哼着一段欢快的旋律。当你靠近时，他突然停了下来。',
    actions: [
      { id: 'ask_about_melody', label: '询问那段旋律', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('“那是很久以前的事了，”他眼神闪烁，“那时的天空还是蓝色的。如果你有兴趣，可以用 5 积分换个故事。”', 'info');
        },
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  },

  'encounter_echo_of_past': {
    id: 'encounter_echo_of_past',
    locationId: 'garbage_chute',
    type: 'story',
    text: '废料堆里传来了一阵轻微的乐声。你翻开一堆金属碎片，发现一个已经严重损坏的音乐盒，它正在顽强地播放着最后几个音符。',
    actions: [
      { id: 'listen_music_box', label: '静静聆听', timeCost: 1.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.sanity += 15;
          ctx.game.addLog('在这片废墟中，这微弱的旋律显得如此纯净。你感到灵魂得到了一瞬间的洗涤。', 'info');
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },

  'encounter_stray_cat_illusion': {
    id: 'encounter_stray_cat_illusion',
    locationId: 'hall_main',
    type: 'story',
    text: '在一根支柱后面，你看到一只通体漆黑的流浪猫正在优雅地梳理毛发。它抬头看了你一眼，金色的瞳孔在灯光下闪闪发亮。',
    actions: [
      { id: 'pet_cat_illusion', label: '试着去摸它', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('你的手穿过了它的身体，只触碰到了冰冷的空气。猫化作一团黑烟消散了。', 'warning');
          ctx.game.player.stats.sanity -= 8;
        },
        nextSceneId: 'explore_hall_main'
      },
      { id: 'watch_cat_distance', label: '远距离观察', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_hall_main' }
    ]
  },

  'encounter_humming_pipes': {
    id: 'encounter_humming_pipes',
    locationId: 'corridor_a',
    type: 'story',
    text: '墙里的管道发出了低沉的嗡鸣声，节奏听起来竟然像是一首古老的摇篮曲。',
    actions: [
      { id: 'hum_along', label: '跟着一起哼唱', timeCost: 1.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.sanity += 10;
          ctx.game.addLog('你轻声附和着。虽然不记得歌名，但这旋律让你感到前所未有的平静。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  'encounter_secret_carving': {
    id: 'encounter_secret_carving',
    locationId: 'cell_01',
    type: 'info',
    text: '在床板的反面，你发现了一些细小的刻痕，描述了某种复杂的逃生路线……或者是某种疯子的妄想。',
    actions: [
      { id: 'study_carving', label: '仔细研究刻痕', timeCost: 2.0, variant: 'accent',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 10,
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 3;
          ctx.game.addLog('你理清了其中的逻辑。虽然这路线现在可能已经失效，但它极大地开阔了你的思维。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      },
      { id: 'leave_carving', label: '看不出头绪', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_cell_01' }
    ]
  },

  'encounter_unmarked_bottle': {
    id: 'encounter_unmarked_bottle',
    locationId: 'mess_hall',
    type: 'warning',
    text: '桌上遗落了一个没有任何标签的棕色玻璃瓶，里面晃荡着半瓶透明液体。',
    actions: [
      { id: 'sniff_bottle', label: '闻一下味道', timeCost: 0.1, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('一股浓烈的工业酒精味扑面而来，让你一阵眩晕。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'drink_bottle_danger', label: '一饮而尽', timeCost: 0.25, variant: 'danger',
        effect: (ctx) => {
          if (Math.random() < 0.5) {
            ctx.game.addLog('是劣质白酒！虽然辛辣，但你的理智得到了奇妙的提升。', 'info');
            ctx.game.player.stats.sanity += 20;
          } else {
            ctx.game.addLog('剧痛袭来，这根本不是给人喝的东西！', 'danger');
            ctx.game.player.stats.hp -= 25;
          }
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },

  'encounter_flickering_flashlight': {
    id: 'encounter_flickering_flashlight',
    locationId: 'warehouse_back',
    type: 'info',
    text: '货架顶端卡着一个坏掉的手电筒，电池盖半开着。',
    actions: [
      { id: 'retrieve_flashlight', label: '取下手电筒', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'broken_flashlight', name: '破损的手电筒', description: '虽然不能照明，但里面的电池或许有用。', icon: 'zap', quantity: 1, category: 'misc' });
          ctx.game.addLog('你费力地把它拿了下来。', 'info');
        },
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  },

  'encounter_strange_seeds': {
    id: 'encounter_strange_seeds',
    locationId: 'garbage_chute',
    type: 'story',
    text: '在潮湿的废料堆里，竟然长出了几株嫩绿的小草。旁边散落着几颗黑色的种子。',
    actions: [
      { id: 'collect_seeds', label: '收集种子', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'mystery_seeds', name: '神秘的种子', description: '在这个死气沉沉的地方，这是生命存在的证据。', icon: 'package', quantity: 5, category: 'misc' });
          ctx.game.addLog('你小心翼翼地把种子收好。', 'info');
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },

  'encounter_doodle_on_floor': {
    id: 'encounter_doodle_on_floor',
    locationId: 'corridor_a',
    type: 'info',
    text: '地板上有人用红色的油漆画了一个歪歪扭扭的笑脸。在这个冰冷的地方，这显得极其诡异。',
    actions: [
      { id: 'stare_doodle', label: '凝视笑脸', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你感到那笑脸似乎在嘲讽你的挣扎。', 'warning');
          ctx.game.player.stats.sanity -= 5;
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  'encounter_cold_draft': {
    id: 'encounter_cold_draft',
    locationId: 'cell_01',
    type: 'warning',
    text: '一阵极其刺骨的寒风不知从哪里吹了进来，即便你裹紧了毯子，依然感到寒气透骨。',
    actions: [
      { id: 'endure_cold', label: '硬扛过去', timeCost: 2.0, variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 5;
          ctx.game.addLog('当你醒来时，寒风已经消失了，但你的关节还在隐隐作痛。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  'encounter_sudden_blackout': {
    id: 'encounter_sudden_blackout',
    locationId: 'hall_main',
    type: 'warning',
    text: '灯光突然全部熄灭，整个大厅陷入了死一般的黑暗。几秒钟后，备用红灯才缓缓亮起。',
    actions: [
      { id: 'freeze_in_dark', label: '留在原地不动', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('黑暗中传来了杂乱的脚步声和压抑的尖叫声。直到红灯亮起，你才发现身边多了几道划痕。', 'warning');
          ctx.game.player.stats.sanity -= 6;
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  'encounter_muffled_laughter': {
    id: 'encounter_muffled_laughter',
    locationId: 'med_bay',
    type: 'story',
    text: '在药柜后面，你似乎听到了一个女人的低笑声，但在那里你只看到了一排排冰冷的药剂瓶。',
    actions: [
      { id: 'check_behind_cabinet', label: '去药柜后面查看', timeCost: 0.5, variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('什么也没有。只有一瓶被打碎的红色药水，在地板上蔓延开来，像是一滩血。', 'warning');
          ctx.game.player.stats.sanity -= 10;
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },

  'encounter_rusting_key': {
    id: 'encounter_rusting_key',
    locationId: 'garbage_chute',
    type: 'info',
    text: '你在废料中翻到了一把锈迹斑斑的大钥匙。虽然沉重，但它似乎依然很坚固。',
    actions: [
      { id: 'keep_rusty_key', label: '收起钥匙', timeCost: 0.25, variant: 'accent',
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'rusty_iron_key', name: '生锈的铁钥匙', description: '也许能打开某个古老的锁。', icon: 'key', quantity: 1, category: 'key' });
          ctx.game.addLog('你把它藏进了口袋。', 'info');
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },
};

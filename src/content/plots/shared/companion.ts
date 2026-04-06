import type { PlotScene } from '../../../types/plot';

export const companionPlots: Record<string, PlotScene> = {
  // --- Grey 的初次相遇（观察阶段） ---
  'grey_first_notice': {
    id: 'grey_first_notice',
    locationId: 'corridor_a',
    type: 'info',
    text: '你正在走廊里尝试某种动作时，突然察觉到阴影里有人在看你。一个穿着灰色连帽衫的囚犯从暗处走了出来。他的眼神很冷，但不是充满敌意，更像是在读一本打开的书。',
    onEnter: (ctx) => {
      ctx.game.flags.grey_met = true;
    },
    actions: [
      {
        id: 'grey_acknowledge',
        label: '与他对视',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('他停顿了一会儿，然后说："你在那方面浪费了太多时间。"声音很轻，带着某种疲惫的智慧。', 'info');
          ctx.game.flags.grey_noticed_me = true;
        },
        nextSceneId: 'grey_first_notice_choice'
      },
      {
        id: 'grey_ignore',
        label: '假装没看见',
        timeCost: 0.1,
        variant: 'default',
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  'grey_first_notice_choice': {
    id: 'grey_first_notice_choice',
    locationId: 'corridor_a',
    type: 'story',
    text: '他已经转身准备离开了，但似乎在等待你的反应。他的背影在走廊的昏暗中显得孤独而沉静。',
    actions: [
      {
        id: 'grey_ask_who',
        label: '问他叫什么名字',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('"灰，"他没有转身，只是回答，"在这个地方，名字没有意义。但我记得的比你多。"', 'info');
          ctx.game.flags.grey_talked = true;
          ctx.npcs.npcs['grey'].met = true;
        },
        nextSceneId: 'grey_first_approach_preamble'
      },
      {
        id: 'grey_let_go',
        label: '让他离开',
        timeCost: 0.1,
        variant: 'default',
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  // --- Grey 的过度场景（从走廊到牢房） ---
  'grey_first_approach_preamble': {
    id: 'grey_first_approach_preamble',
    locationId: 'corridor_a',
    type: 'info',
    text: '灰转身离开了。几个小时后，当你回到牢房时，一切都开始了。',
    actions: [
      {
        id: 'continue_to_grey_approach',
        label: '继续',
        timeCost: 0.1,
        variant: 'default',
        nextSceneId: 'grey_first_approach'
      }
    ]
  },

  // --- Grey 的主动接触 ---
  'grey_first_approach': {
    id: 'grey_first_approach',
    locationId: 'cell_01',
    type: 'story',
    text: '当你独自在牢房里时，灰悄无声息地出现了。他没有敲门，只是站在门框边，用那种深邃的眼神看着你。"你的训练方向有问题。我注意到了。"',
    onEnter: (ctx) => {
      ctx.game.flags.grey_approached = true;
      ctx.game.flags.grey_first_approach_seen = true;
    },
    actions: [
      {
        id: 'grey_accept_help',
        label: '问他是否愿意指点',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('他坐了下来，动作很慢，像是在思考每一个决定。"我们都在这里活下来。也许互相学习会有帮助。不是救你，只是...互相帮衬。"', 'info');
          ctx.game.flags.grey_allied = true;
          ctx.npcs.npcs['grey'].location = 'cell_01';
          ctx.npcs.npcs['grey'].met = true;
        },
        nextSceneId: 'grey_mechanics_guide'
      },
      {
        id: 'grey_refuse_help',
        label: '拒绝他的建议',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('他站起身，没有任何失望的表情。"没关系。我们迟早会再见。"他消失在走廊的黑暗中。', 'warning');
          ctx.npcs.npcs['grey'].location = '';
          ctx.npcs.npcs['grey'].met = false;
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  // --- 灰的机制引导 ---
  'grey_mechanics_guide': {
    id: 'grey_mechanics_guide',
    locationId: 'cell_01',
    type: 'story',
    text: '灰用他那沙哑的嗓音开始讲述这个实验的基本规则。他的每一句话都击中要点，就像他曾经无数次重复过这些话。',
    onEnter: (ctx) => {
      ctx.game.flags.grey_taught_mechanics = true;
    },
    actions: [
      {
        id: 'grey_listen',
        label: '认真听他讲解',
        timeCost: 1.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('【灰的生存指南】', 'info');
          ctx.game.addLog('时间(Time)是一切的基础。每个行动消耗小时数，24小时后进入下一天。无论你做什么，时间都在流逝。', 'info');
          ctx.game.addLog('三个能力决定了你能做什么：力量让你对抗，敏捷让你躲避和偷窃，智力让你理解这个地方的真相。没有完美的属性，只有选择的代价。', 'info');
          ctx.game.addLog('理智(Sanity)是脆弱的。每当你目睹不可名状的东西，它就在悄悄剥离。当它低于40时，你会开始看到不存在的东西。我见过理智破碎的人。他们看起来...不像人了。', 'story');
          ctx.game.addLog('NPC的好感度和信任度决定了他们是帮助你还是出卖你。有些人可以被收买，有些人只在乎自己的存活。学会识人。', 'info');
          ctx.game.addLog('每天有固定的配给。积分是这里的货币。没有积分，你会饿死。有积分，你可以购买所需的一切。', 'info');
          ctx.game.player.stats.intelligence += 3;
          ctx.game.setObjective('利用灰的教导提高生存能力');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'grey_stop',
        label: '打断他',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('灰平静地停了下来。"你已经听够了。那就靠自己去发现吧。"', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  // --- Grey 的后续剧情（day07） ---
  'grey_day07_check': {
    id: 'grey_day07_check',
    locationId: 'corridor_a',
    type: 'story',
    text: '灰再次拦住了你。第七天了，他似乎在检查你的进度。他的目光扫过你的脸，能看出一些微妙的疲惫。"时间在变快，对吧？"',
    onEnter: (ctx) => {
      ctx.game.addLog('他停顿了一下，声音变得更低："这是第一个警号。一旦你开始感觉不到时间的流逝，就意味着他们已经开始改变你了。"', 'warning');
    },
    actions: [
      {
        id: 'respond_to_grey_d7',
        label: '倾听他的话',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.grey_d7_done = true;
          ctx.game.addLog('灰拍了拍你的肩膀，消失在黑暗里。你站在那里，忽然意识到自己已经说不出上一次看到阳光是什么时候了。', 'info');
          ctx.game.player.stats.sanity -= 3;
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },

  // --- Grey 的第二次深入对话（day14） ---
  'grey_day14_secret': {
    id: 'grey_day14_secret',
    locationId: 'cell_01',
    type: 'story',
    text: '灰突然出现在你的牢房里，比上次见面时看起来更加疲惫。他没有寒暄，直接从怀里掏出一张纸条，用笔在你耳边写下两个字。',
    onEnter: (ctx) => {
      ctx.game.addLog('"莫比乌斯协议。"他低声说，"这是这个实验的真名。没有幸存者，只有...被升级的工具。"', 'warning');
      ctx.game.addLog('他的眼神不对焦，像是在背诵什么，又像是在忏悔。"我记得我原来的样子，这是诅咒。你最好尽快忘记。"', 'danger');
    },
    actions: [
      {
        id: 'hear_grey_secret',
        label: '消化这个信息',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.grey_d14_done = true;
          ctx.game.flags.broker_discount = true;
          ctx.game.player.stats.sanity -= 5;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('灰在离开前留下了一句话："掮客那边，你现在可以要折扣了。告诉他灰介绍的。"', 'info');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },

  // --- Grey 的警告（day45） ---
  'grey_day45_warning': {
    id: 'grey_day45_warning',
    locationId: 'hall_main',
    type: 'story',
    text: '灰在大厅的某个监视盲点出现了。他递给你一张破旧的纸片，上面用各种笔迹草草写着一串数字和箭头——像是一份地图的一部分。',
    onEnter: (ctx) => {
      ctx.game.addLog('"这是秘密通道的坐标，"他说，"第 60 天，他们会进行清洗。无辜的人会被送出去，没有回音。"', 'warning');
      ctx.game.addLog('"如果你想保住某个人......让他们在那一天远离人群。"', 'danger');
    },
    actions: [
      {
        id: 'receive_coordinates',
        label: '收下纸条',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.grey_d45_done = true;
          ctx.game.inventory.push({
            id: 'grey_coordinates',
            name: '秘密坐标',
            description: '灰提供的逃生路线。第 60 天可能有用。',
            icon: 'map-pin',
            quantity: 1,
            category: 'document'
          });
          ctx.game.addLog('灰消失在人群中，留下你独自站在大厅，手里握着这个可能改变一切的纸条。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  // --- Grey 的最终命运（day75） ---
  'grey_day75_fate': {
    id: 'grey_day75_fate',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      if (ctx.game.flags.joined_marcus) {
        return '灰不在大厅里。取而代之的，是一具被拖出来的尸体。你看不清脸，但那件宽大的灰色连帽衫......';
      }
      return '灰在大厅的角落等你。但他的眼神已经空洞了，像是灵魂被什么东西掏出来了。他只是静静地看着你。';
    },
    onEnter: (ctx) => {
      if (!ctx.game.flags.joined_marcus && ctx.game.flags.grey_d45_done) {
        ctx.game.addLog('"我记得的比你多。这是诅咒，"他用嘶哑的声音说，"外面的世界......比这里大得多。"', 'warning');
      }
    },
    actions: [
      {
        id: 'confront_grey_d75_ask',
        label: '追问他知道什么',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => !ctx.game.flags.joined_marcus,
        effect: (ctx) => {
          ctx.game.flags.grey_d75_fate = 'questioned';
          ctx.game.addLog('灰的目光焦聚了一下。"实验外，还有更大的选拔正在进行。这里只是......第一层。"', 'danger');
          ctx.game.addLog('他的手按在你的肩膀上，力度很轻，像是在说再见。"我已经没有答案了。但你......也许能走得更远。"', 'story');
          ctx.game.player.stats.intelligence += 3;
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'sit_with_grey_d75',
        label: '陪他坐一会儿',
        timeCost: 1.0,
        variant: 'default',
        condition: (ctx) => !ctx.game.flags.joined_marcus,
        effect: (ctx) => {
          ctx.game.flags.grey_d75_fate = 'silent';
          ctx.game.addLog('你们就这样坐着，没有任何对话。在这个充满监视的地方，沉默是最后的私密。', 'info');
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 5);
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'grey_dead_witness',
        label: '转身离开',
        timeCost: 0.5,
        variant: 'danger',
        condition: (ctx) => ctx.game.flags.joined_marcus,
        effect: (ctx) => {
          ctx.game.addLog('你没有停留。你学会了在这个地方不去看不该看的东西。', 'warning');
          ctx.game.player.stats.sanity -= 3;
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  // --- 掮客（旧有内容保留） ---
  'shop_broker': {
    id: 'shop_broker',
    locationId: 'warehouse_back',
    type: 'story',
    text: '掮客坐在一堆板箱上，吸着一支不知名的土烟。"只要你有积分，或者等值的玩意儿，我这儿什么都有。既然是新面孔，我给你开个友情价。"',
    actions: [
      { id: 'buy_ration', label: (ctx: any) => `购买口粮 (成本: ${ctx.game.flags.broker_discount ? 15 : 20} 积分)`, timeCost: 0.25, variant: 'default',
        condition: (ctx) => ctx.game.game.money >= (ctx.game.flags.broker_discount ? 15 : 20),
        effect: (ctx) => {
          const price = ctx.game.flags.broker_discount ? 15 : 20;
          ctx.game.game.money -= price;
          ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '虽然贵，但能救命。', icon: 'package', quantity: 1, category: 'consumable' });
          ctx.game.addLog('交易完成。', 'info');
        },
        nextSceneId: 'shop_broker'
      },
      { id: 'buy_bandage', label: (ctx: any) => `购买绷带 (成本: ${ctx.game.flags.broker_discount ? 25 : 35} 积分)`, timeCost: 0.25, variant: 'default',
        condition: (ctx) => ctx.game.game.money >= (ctx.game.flags.broker_discount ? 25 : 35),
        effect: (ctx) => {
          const price = ctx.game.flags.broker_discount ? 25 : 35;
          ctx.game.game.money -= price;
          ctx.game.inventory.push({ id: 'bandage', name: '简陋绷带', description: '回复 20 点生命值。', icon: 'plus', quantity: 1, category: 'consumable' });
          ctx.game.addLog('交易完成。', 'info');
        },
        nextSceneId: 'shop_broker'
      },
      { id: 'leave_shop', label: '离开商店', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_warehouse_back' }
    ]
  }
};

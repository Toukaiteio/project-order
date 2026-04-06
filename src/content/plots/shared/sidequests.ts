import type { PlotScene } from '../../../types/plot';

export const sideQuests: Record<string, PlotScene> = {
  'quest_satoshi_start': {
    id: 'quest_satoshi_start',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 缩在床角，手里捏着一块拆到一半的电路板。看见你进来，他先是下意识把东西往怀里一藏，随后又低声叫住你。"你要是去废料区，帮我留意一个高频振荡器。只有那东西还能把这台破终端拖回来。"',
    actions: [
      {
        id: 'accept_satoshi',
        label: '记下这件事',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.satoshi_quest_active = true;
          ctx.game.addLog('你把那件零件记了下来。Satoshi 没再多说，只把那块电路板握得更紧。', 'info');
          ctx.game.setObjective('去废料处理区找 Satoshi 需要的零件');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'refuse_satoshi',
        label: '先顾自己',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.satoshi_refused = true;
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'quest_satoshi_find_part': {
    id: 'quest_satoshi_find_part',
    locationId: 'garbage_chute',
    type: 'warning',
    text: '废料传送带边缘卡着一枚还在闪弱光的零件。齿轮转得不快，但只要手慢一点，那玩意就会先你一步被卷进去。',
    actions: [
      {
        id: 'grab_part',
        label: '伸手去够',
        timeCost: 1.0,
        variant: 'danger',
        condition: (ctx) => ctx.game.player.stats.dexterity >= 6,
        effect: (ctx) => {
          ctx.game.inventory.push({
            id: 'electronic_part',
            name: '电子零件',
            description: '虽然沾满了油污，但依然在运作。',
            icon: 'zap',
            quantity: 1,
            category: 'tool'
          });
          ctx.game.flags.has_satoshi_part = true;
          ctx.game.addLog('你在齿轮合拢前把零件抽了出来。手背擦破了一层皮，但它还完整。', 'info');
          ctx.game.setObjective('把零件带回给 Satoshi');
        },
        nextSceneId: 'explore_garbage_chute'
      },
      {
        id: 'leave_part',
        label: '算了',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.satoshi_part_missed = true;
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },
  'quest_satoshi_complete': {
    id: 'quest_satoshi_complete',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 接过零件时，指尖都在抖。他熟练地把它焊回板子，几秒后，那台旧终端终于亮起一层惨绿的底光。',
    actions: [
      {
        id: 'listen_to_terminal',
        label: '听他说刚刚捕到的东西',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 5;
          ctx.game.flags.satoshi_allied = true;
          ctx.game.flags.satoshi_terminal_repaired = true;
          ctx.game.addLog('静电里夹着一串管理频道的碎句。你们谁都没完全听懂，但已经够确认，这地方很多东西从来不是故障。', 'warning');
          ctx.game.setObjective('在活下去的同时，继续追查这座设施到底在筛选什么');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },

  'quest_sasha_locket_start': {
    id: 'quest_sasha_locket_start',
    locationId: 'corridor_a',
    type: 'story',
    text: '走廊拐角，Sasha 正蹲在墙边把脸埋进手里。几个刚走开的犯人还在笑，说她居然为一块破金属急成这样。她抬头时眼眶是红的。"他们把我的吊坠扔去废料口了。里面有张照片。"',
    actions: [
      {
        id: 'accept_sasha_locket',
        label: '去帮她找',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.sasha_locket_active = true;
          ctx.game.addLog('Sasha 说到一半就不敢再说，只把废料区的方向指给你看。', 'info');
          ctx.game.setObjective('去废料处理区找回 Sasha 的吊坠');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'ignore_sasha_locket',
        label: '别卷进去',
        timeCost: 0.1,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.sasha_locket_refused = true;
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'quest_sasha_locket_find': {
    id: 'quest_sasha_locket_find',
    locationId: 'garbage_chute',
    type: 'warning',
    text: '一层发臭的湿网下面，隐约压着一点金属反光。你把那团东西拨开，露出一枚被污水泡得发黑的银色吊坠。',
    actions: [
      {
        id: 'pick_up_locket',
        label: '把它捡起来',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.inventory.push({
            id: 'sasha_locket',
            name: '银色吊坠',
            description: '里面夹着一张已经模糊的全家福。',
            icon: 'image',
            quantity: 1,
            category: 'misc'
          });
          ctx.game.flags.has_sasha_locket = true;
          ctx.game.addLog('你把那枚吊坠从污物里捞了出来。它很轻，却像还压着一点旧日子。', 'info');
          ctx.game.setObjective('把吊坠还给 Sasha');
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },
  'quest_sasha_locket_return': {
    id: 'quest_sasha_locket_return',
    locationId: 'mess_hall',
    type: 'story',
    text: (ctx) => {
      const npc = ctx.npcs.npcs['sasha'];
      if (!npc || npc.state !== 'Alive') {
        return '你本来想把吊坠交还给 Sasha，可她常坐的位置已经空了。桌边没人，只有那种再也等不到人的安静。';
      }
      return 'Sasha 缩在食堂角落，一点点掰着口粮。你走近时，她先是本能地往后缩了缩，像已经习惯别人靠近她只是为了拿走什么。';
    },
    actions: [
      {
        id: 'return_locket_to_sasha',
        label: '把吊坠递过去',
        timeCost: 0.5,
        variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'sasha_locket'),
        effect: (ctx) => {
          const idx = ctx.game.inventory.findIndex((i: any) => i.id === 'sasha_locket');
          if (idx >= 0) ctx.game.inventory.splice(idx, 1);
          ctx.game.flags.sasha_locket_returned = true;
          ctx.npcs.interact('sasha', 20, 15);
          ctx.game.addLog('Sasha 打开吊坠时，手指一直在抖。她盯着里面那张几乎看不清的照片看了很久，最后只轻声说了一句“我还以为它也没了”。', 'story');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'keep_locket',
        label: '先不拿出来',
        timeCost: 0.1,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.sasha_locket_held_back = true;
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },

  'quest_aris_plea': {
    id: 'quest_aris_plea',
    locationId: 'med_bay',
    type: 'story',
    text: 'Aris 把你拉到帘子后面。病床上那个人已经瘦得像把骨头裹了层皮。Aris 压着声音说：“他再不进食，今晚就会断。你身上要是有多的一份，就现在。”',
    actions: [
      {
        id: 'give_ration_to_aris',
        label: '把口粮递给他',
        timeCost: 0.5,
        variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          const idx = ctx.game.inventory.findIndex((i: any) => i.id === 'ration');
          if (idx >= 0) ctx.game.inventory.splice(idx, 1);
          ctx.npcs.interact('aris', 40, 30);
          ctx.game.flags.aris_ration_given = true;
          ctx.game.inventory.push({
            id: 'pure_painkiller',
            name: '高纯度止痛药',
            description: '强效精神稳定剂。',
            icon: 'pill',
            quantity: 1,
            category: 'consumable'
          });
          ctx.game.addLog('Aris 什么都没多说，只把一小瓶药塞进你手里。你知道那不是交易，是他在记这笔人情。', 'info');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'ignore_aris',
        label: '这次不行',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.aris_refused = true;
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },

  'elena_day20_brief': {
    id: 'elena_day20_brief',
    locationId: 'hall_main',
    type: 'story',
    text: 'Elena 递给你一张手写统计表。上面是囚犯们最近几轮的贡献、体能下降速度和“可用性”预测。你的名字也在上面，旁边是一枚没有解释的问号。',
    actions: [
      {
        id: 'accept_elena_brief',
        label: '把表收下',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.elena_quest_active = true;
          ctx.game.inventory.push({
            id: 'elena_prediction_table',
            name: 'Elena 的预测表',
            description: '一张关于囚犯“存活指数”的手写统计表。',
            icon: 'document',
            quantity: 1,
            category: 'document'
          });
          ctx.game.addLog('Elena 说她不喜欢未知，而你正好能帮她把几处空白补上。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'reject_elena_brief',
        label: '别接',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.elena_brief_rejected = true;
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'quest_elena_data_collect': {
    id: 'quest_elena_data_collect',
    locationId: 'hall_main',
    type: 'story',
    text: 'Elena 没把话说得太满，只把笔尖点在表上的三个空栏。医疗站、走廊和大厅，她要的不是故事，是那些还没被整理过的原始反应。',
    actions: [
      {
        id: 'understand_elena_task',
        label: '听懂她的意思',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.elena_data_collect_active = true;
          ctx.game.setObjective('替 Elena 收集医疗站、走廊和大厅三处的原始信息');
          ctx.game.addLog('Elena 只说，等你带着足够干净的样本回来，她会给你看一份更脏的文件。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'decline_elena_task',
        label: '这事太显眼',
        timeCost: 0.1,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.elena_task_declined = true;
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'quest_elena_data_complete': {
    id: 'quest_elena_data_complete',
    locationId: 'hall_main',
    type: 'story',
    text: 'Elena 听完你的汇总后，终于把那份一直压在臂弯里的文件交了出来。她的脸上没有喜色，只有一种把最后一层猜测落实后的疲惫。',
    actions: [
      {
        id: 'receive_termination_protocol',
        label: '把文件拿走',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.elena_quest_complete = true;
          ctx.game.flags.termination_protocol_draft = true;
          ctx.game.inventory.push({
            id: 'termination_protocol_draft',
            name: '终止协议草案',
            description: '关于“秩序之眼”实验的官方终止文件副本。',
            icon: 'document',
            quantity: 1,
            category: 'document'
          });
          ctx.npcs.interact('elena', 25, 30);
          ctx.game.addLog('Elena 说，实验从一开始就给失败预留了格式，真正缺的只是谁来把这份格式拆开。', 'danger');
          ctx.game.addLog('你把文件收起来时，已经知道自己之后再也不可能只把这里当成一座牢。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },

  'quest_sasha_keepsake_repaid': {
    id: 'quest_sasha_keepsake_repaid',
    locationId: 'mess_hall',
    type: 'story',
    text: '清洗过去后，Sasha 主动在食堂角落等你。她把那枚吊坠擦得干净了些，链扣却已经彻底坏掉。她看了很久，最后把里面那张小照片拆了出来，折成更小的一片塞回你手里。',
    actions: [
      {
        id: 'accept_sasha_keepsake',
        label: '把那片照片收下',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.sasha_keepsake_scene = true;
          ctx.game.flags.arc6_sasha_anchor = true;
          ctx.npcs.interact('sasha', 10, 12);
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 4);
          ctx.game.addLog('Sasha 说：“要是后面真能出去，至少得有人记得我们不是一开始就只剩编号。”', 'story');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'quest_aris_medicine_repaid': {
    id: 'quest_aris_medicine_repaid',
    locationId: 'med_bay',
    type: 'story',
    text: 'Aris 在药架后面叫住你。他递来的不是药，而是一张被折过很多次的小纸条，上面记着几类伤员被优先转运时的顺序和常见反应。',
    actions: [
      {
        id: 'take_aris_note',
        label: '把纸条记住',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.aris_mercy_repaid = true;
          ctx.game.flags.arc6_aris_passage_hint = true;
          ctx.npcs.interact('aris', 10, 10);
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('Aris 只说了一句：“真到了最后，别把还能走的人和还想活的人看成一回事。”', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },
  'quest_satoshi_route_repaid': {
    id: 'quest_satoshi_route_repaid',
    locationId: 'cell_02',
    type: 'story',
    text: '档案被烧掉后，Satoshi 把残图又拉了一遍。这次他没有急着讲屏幕上的门，而是指着一条几乎被删空的回收支路，示意你记住那串断掉的编号。',
    actions: [
      {
        id: 'memorize_satoshi_route',
        label: '把那串编号背下来',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_satoshi_route_shared = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.npcs.interact('satoshi', 8, 10);
          ctx.game.addLog('Satoshi 低声说，那条路不是给人准备的，但也正因为这样，最后关头反而可能没人先去堵。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'quest_sasha_memory_lost': {
    id: 'quest_sasha_memory_lost',
    locationId: 'mess_hall',
    type: 'story',
    text: '清洗之后，Sasha 还是会下意识摸一把自己胸前空着的位置。她发现你在看时，先愣了一下，随即把手收回去，像是怕被人撞见自己还在记着什么。',
    actions: [
      {
        id: 'leave_sasha_silence',
        label: '什么也别说',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.sasha_failure_seen = true;
          ctx.game.flags.arc6_sasha_distance = true;
          ctx.npcs.interact('sasha', -8, -10);
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('Sasha 没提吊坠，也没提那张照片。她只是把口粮掰得更碎，像在把某段日子磨没。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'quest_aris_patient_lost': {
    id: 'quest_aris_patient_lost',
    locationId: 'med_bay',
    type: 'story',
    text: 'Aris 把一张白布往上拉了一点，刚好盖住床上那人的脸。他没抬头，也没对你解释，只是在转身时把手洗了很久，像是洗不掉那点迟到的时间。',
    actions: [
      {
        id: 'watch_aris_work',
        label: '站着看完',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.aris_failure_seen = true;
          ctx.game.flags.arc6_aris_regret = true;
          ctx.npcs.interact('aris', -10, -12);
          ctx.game.player.stats.sanity -= 4;
          ctx.game.addLog('Aris 最后只说了一句：“这里很多人不是死在今天，是死在前几天没人肯递出去的那一口。”', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },
  'quest_satoshi_signal_lost': {
    id: 'quest_satoshi_signal_lost',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 的床位还在，可那台终端已经彻底黑了。外壳被人撬开过，里面缺掉最关键的几块。床板上只剩一道被反复擦拭过的划痕，像有人一度还不肯认输。',
    actions: [
      {
        id: 'leave_dead_terminal',
        label: '把视线移开',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.satoshi_failure_seen = true;
          ctx.game.flags.arc6_satoshi_void = true;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你忽然意识到，有些路不是被堵死的，而是当初根本没人把第一块零件递过去。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'quest_elena_distance_set': {
    id: 'quest_elena_distance_set',
    locationId: 'hall_main',
    type: 'story',
    text: '白衣人重新出现后，Elena 只是远远看了你一眼，没有再靠近。她怀里那本本子已经比从前厚了很多，可里面不再有任何一页会为你留下空栏。',
    actions: [
      {
        id: 'accept_elena_distance',
        label: '让她走过去',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.elena_failure_seen = true;
          ctx.game.flags.arc6_elena_distance = true;
          ctx.npcs.interact('elena', -12, -10);
          ctx.game.addLog('她什么都没说。可你看得出来，那份本来可能递到你手里的东西，已经被她改成了别的去处。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

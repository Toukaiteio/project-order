import type { PlotScene } from '../../../types/plot';

export const day90Plots: Record<string, PlotScene> = {
  'day76_blood_on_tiles': {
    id: 'day76_blood_on_tiles',
    locationId: 'hall_main',
    type: 'warning',
    text: '昨晚的血已经被拖过一遍，可地砖缝里还留着颜色。长桌撤掉以后，大厅显得更空，像是有人故意把热气和人味一起清掉了。',
    onEnter: (ctx) => {
      if (ctx.game.flags.marcus_defeated) {
        ctx.game.addLog('没有了 Marcus，空出来的不是安静，而是一种谁都想先踩进去的缺口。', 'warning');
      }
      if (ctx.game.flags.joined_marcus) {
        ctx.game.addLog('昨晚坐上那张桌子的人，今天都比别人更像被看着。', 'warning');
      }
    },
    actions: [
      {
        id: 'd76_trace_blood',
        label: '顺着痕迹看完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_blood_memory = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把拖痕一路看到门边，忽然明白这里总是先把结果擦掉，再让人接受过程。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd76_walk_over',
        label: '直接踩过去',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你没有绕开。鞋底沾到的那点黏滞感，之后很久都没散。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day77_succession_notice': {
    id: 'day77_succession_notice',
    locationId: 'hall_main',
    type: 'warning',
    text: '广播第一次提到“继承阶段”。不是胜者，不是幸存者，而是继承。大厅里有几秒没人出声，因为这词比任何惩罚都更像宣布这地方会继续存在下去。',
    actions: [
      {
        id: 'd77_mark_word',
        label: '把这词记住',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_inheritance_named = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把“继承阶段”这几个字在心里压得很重。很多人到现在才意识到，终点可能只是另一道任命。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd77_watch_reaction',
        label: '先看谁抬头了',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没看屏幕，只去看人。有人害怕，有人发亮，最糟的是还有人真的开始期待。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day78_archive_burn': {
    id: 'day78_archive_burn',
    locationId: 'cell_02',
    type: 'story',
    text: '终端室今天飘出了烧焦的塑料味。不是失火，而像有人在成批擦除什么。Satoshi 盯着屏幕上的删除进度条，脸色白得像灯管。',
    actions: [
      {
        id: 'd78_copy_fast',
        label: '能记多少先记多少',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc6_archive_fragments = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('你和 Satoshi 没法全抢下来，只来得及硬记住几组编号和一张被删了一半的结构图。', 'danger');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd78_step_back',
        label: '先别把自己搭进去',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你后退了半步。被烧掉的东西也许重要，可不是每一份重要都值得立刻拿命去换。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'day79_outer_gate_hum': {
    id: 'day79_outer_gate_hum',
    locationId: 'corridor_a',
    type: 'warning',
    text: '从今天开始，最外层通道会在固定时段传来低沉的机械轰鸣。那声音和反应堆不同，更像很久没动过的重门正在被一点点唤醒。',
    actions: [
      {
        id: 'd79_follow_hum',
        label: '往外层走一段',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_gate_hum_known = true;
          ctx.game.addLog('你没真的走到尽头，但已经足够判断那不是维修声，而是门轴在重新学着怎么开。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd79_do_not_chase',
        label: '别跟着声音走',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没去追那声音。可它接下来每晚都会自己找上你的耳朵。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day80_last_medicine': {
    id: 'day80_last_medicine',
    locationId: 'med_bay',
    type: 'story',
    text: 'Aris 把剩下的药分成了更小的几堆。不是为了公平，而是因为剩到今天，已经没人敢假装还够。每一份都像从明天硬抠出来的。',
    onEnter: (ctx) => {
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 的眼睛红得厉害，却还是在把瓶子排得整整齐齐。像只要顺序还在，人就还没散。', 'warning');
      }
    },
    actions: [
      {
        id: 'd80_take_aris_advice',
        label: '听他说该留给谁',
        timeCost: 0.75,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.aris_saved === true,
        effect: (ctx) => {
          ctx.game.flags.arc6_aris_priorities = true;
          ctx.npcs.interact('aris', 8, 8);
          ctx.game.addLog('Aris 没再讲仁慈，只讲谁还能走、谁能不能撑到门开。你第一次听他这样说话。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd80_leave_medicine',
        label: '别在这里分心',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有插手。如今每一份药都带着脸，碰一下就像碰到某个人的明天。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },
  'day81_selection_interviews': {
    id: 'day81_selection_interviews',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天开始有人被单独叫走，时间不长，回来后却都比去之前更安静。没有人说里面问了什么，可每个人都开始修正自己的站姿、语气和眼神。',
    actions: [
      {
        id: 'd81_watch_returns',
        label: '盯着回来的人看',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_interviews_seen = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你看见他们回来后先摸喉咙、再摸衣角，像是刚被要求把自己重新穿好。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd81_rehearse_self',
        label: '想一遍如果叫到自己',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc6_self_script = true;
          ctx.game.addLog('你在心里把可能的问题过了一遍。越往下想，越像在替别人写一份合格样本说明。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day82_sky_on_screen': {
    id: 'day82_sky_on_screen',
    locationId: 'hall_main',
    type: 'story',
    text: '所有屏幕今天都短暂切到了一段地表画面。不是实时的，更像库存素材。蓝得过分的天、风吹动的荒草，还有一条没有任何脚印的路。',
    actions: [
      {
        id: 'd82_stare_sky',
        label: '把那片天看完',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 1;
          ctx.game.addLog('你盯着那片天，反而更难判断它是真是假。到了现在，连希望都像是实验材料。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd82_watch_people',
        label: '看看谁先信了',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_sky_reactions = true;
          ctx.game.addLog('你没去看天空，而是看人群。总有人会先把一段录像当成出口。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day83_food_for_names': {
    id: 'day83_food_for_names',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂今天开始拿额外口粮换名单。不是公开收买，只是有人在角落里低声问：“你知道谁被叫过吗？”食物越像食物的时候，越容易让人开口。',
    actions: [
      {
        id: 'd83_refuse_trade',
        label: '别拿名字换吃的',
        timeCost: 0.25,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_kept_silence = true;
          ctx.game.addLog('你什么都没说。空着的胃会疼，可有些话一旦换出去，就再也收不回来了。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd83_trade_hint',
        label: '只递出去半句',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.game.hunger = Math.min(100, ctx.game.game.hunger + 8);
          ctx.game.flags.arc6_names_traded = true;
          ctx.game.addLog('你只给了半句不够致命的话，换来一小块更像样的吃食。可回头时，还是觉得有人少了一点。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day84_terminal_map': {
    id: 'day84_terminal_map',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 把一张残缺的设施图拉到了屏幕上。最外层门禁、升降台、监控扇区和样本回收通道都只剩半边，但已经够让人看懂一件事：出口从来不只一扇。',
    actions: [
      {
        id: 'd84_memorize_map',
        label: '先把缺的那半边补在脑子里',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc6_terminal_map = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('你和 Satoshi 把残图拼来拼去，最后勉强看出一条不像给人走、却可能真的能走出去的边路。', 'danger');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd84_close_map',
        label: '知道有别的门就够了',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有把图看完。知道出口不止一扇，有时候已经足够危险。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'day85_open_air_rumor': {
    id: 'day85_open_air_rumor',
    locationId: 'corridor_a',
    type: 'warning',
    text: '“上面有风。”这句话今天不知从哪传了起来。一开始像疯话，后来越来越像证词。有人说闻到了土味，有人说听见了鸟，更多的人只是把这句传下去。',
    actions: [
      {
        id: 'd85_hold_rumor',
        label: '把这句压在心里',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没帮它传下去。到了这一步，太多人已经开始靠一句话活着。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd85_test_air',
        label: '认真闻一闻风向',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_air_rumor_tested = true;
          ctx.game.addLog('你在转角停了很久，最后真的闻到一丝和这里不一样的冷味。太淡了，却让人更睡不着。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day86_last_sorting': {
    id: 'day86_last_sorting',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅今天被最后整理了一次。不是清洁，而是分层。谁靠近屏幕、谁靠近门、谁只配站在边缘，突然都有了默认的位置。',
    actions: [
      {
        id: 'd86_refuse_slot',
        label: '别站进别人给的位置',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc6_slot_refused = true;
          ctx.game.player.stats.sanity -= 1;
          ctx.game.addLog('你故意站偏了一点。代价是所有人都更容易记住你。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd86_blend_in',
        label: '先站进去看清楚',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_slot_seen = true;
          ctx.game.addLog('你站进了他们默认给你的那格。暂时安全，但也像是在提前练习某种服从。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day87_white_coats_return': {
    id: 'day87_white_coats_return',
    locationId: 'hall_main',
    type: 'warning',
    text: '很久没出现过的白衣人今天重新站到了玻璃后面。他们不说话，只在看板上记录。那种被重新当成样本端详的感觉，比执行队更让人恶心。',
    onEnter: (ctx) => {
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 抬头盯着那排白衣人，像终于看见了自己一直想找到的源头。', 'warning');
      }
    },
    actions: [
      {
        id: 'd87_count_white_coats',
        label: '数清有几个人在看',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_observers_counted = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把玻璃后的人影数了两遍。比你想的少，也比你希望的多。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd87_look_down',
        label: '别和他们对视',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你低下头，却还是知道他们在看。很多时候，羞耻根本不需要对视。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day88_door_test': {
    id: 'day88_door_test',
    locationId: 'corridor_a',
    type: 'warning',
    text: '最外层的门今天真的动了。不是完全打开，只是抬起了一道够光漏进来的缝。那缝短得像错觉，却足够让整层人安静到忘记呼吸。',
    actions: [
      {
        id: 'd88_watch_gap',
        label: '盯住那道缝',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_door_gap_seen = true;
          ctx.game.addLog('光只亮了一瞬，可已经够让你确认，外面真的不是另一层灯。', 'danger');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd88_watch_people',
        label: '看谁先往前动',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没盯门，只盯人。有人下意识往前迈了半步，又立刻缩了回去。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day89_final_night': {
    id: 'day89_final_night',
    locationId: 'hall_main',
    type: 'warning',
    text: '第89天的夜里，设施第一次像真正快结束了。没有额外广播，没有突然点名，连巡逻都少了一轮。可正因为这样，整个夜晚都像在被谁憋着最后一口气。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬过最后一夜，准备迎接第90天');
      if (ctx.game.flags.grey_d45_done) {
        ctx.game.addLog('Grey 留下的坐标和今晚的安静叠在一起，让人很难不去想它是不是终于要有用了。', 'warning');
      }
      if (ctx.game.flags.termination_protocol_draft || ctx.game.inventory.some((i: any) => i.id === 'termination_protocol_draft')) {
        ctx.game.addLog('那份终止协议像一块压在胸口的冷铁。你知道明天不只是“出去”那么简单。', 'warning');
      }
    },
    actions: [
      {
        id: 'd89_choose_truth',
        label: '今晚把知道的事串起来',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_truth_faced = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你第一次不再把这些线索分开看。实验、继承、门、样本和幸存，全都被你硬拉成了一条线。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd89_hold_breath',
        label: '什么都别想，先活到明早',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你强迫自己不去想门外。可越不想，越像整个设施都在替你想。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'grand_finale': {
    id: 'grand_finale',
    locationId: 'hall_main',
    type: 'warning',
    text: '第90天到了。“秩序之眼”实验结束。通往地表的巨大钢铁闸门缓缓升起，刺眼的强光一下子灌进大厅。没有掌声，也没有欢呼，只有所有人同时眯起眼时那种近乎屈辱的沉默。',
    onEnter: (ctx) => {
      ctx.game.addLog('门开了。大厅里没有人先出声，只有呼吸声一下子变得很乱。', 'danger');
      if (ctx.game.flags.arc6_door_gap_seen) {
        ctx.game.addLog('那道你在第88天见过的门缝，现在终于整个张开了。', 'warning');
      }
      if (ctx.game.flags.arc6_truth_faced) {
        ctx.game.addLog('你已经没法再把“出口”这两个字只当成出口了。', 'warning');
      }
      if (ctx.game.flags.arc6_sasha_anchor) {
        ctx.game.addLog('口袋里那片被折小的旧照片硌着你的掌心，提醒你有人不是为了被统计才活到今天。', 'warning');
      }
      if (ctx.game.flags.arc6_satoshi_route_shared) {
        ctx.game.addLog('Satoshi 留给你的那串断编号还在脑子里，像一条谁也没打算给人走的路。', 'warning');
      }
      if (ctx.game.flags.arc6_satoshi_void) {
        ctx.game.addLog('你路过那间黑下去太久的床位时，还是会想起自己当初到底少递了哪一步。', 'warning');
      }
      if (ctx.game.flags.arc6_elena_distance) {
        ctx.game.addLog('Elena 没再站到你这边。某些本来能被证实的事，如今只能靠你自己拼。', 'warning');
      }
    },
    actions: [
      {
        id: 'step_into_light',
        label: '走向那道光',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          const stats = ctx.game.player.stats;
          const flags = ctx.game.flags;
          const hasProtocol = flags.termination_protocol_draft || ctx.game.inventory.some((i: any) => i.id === 'termination_protocol_draft');
          const hasGreyCoords = ctx.game.inventory.some((i: any) => i.id === 'grey_coordinates') || flags.grey_d45_done;
          const hasSashaBond = flags.sasha_locket_returned || flags.arc6_sasha_anchor;
          const hasArisBond = flags.aris_ration_given || flags.aris_mercy_repaid || flags.arc3_aris_debt;
          const hasDeepRoute = flags.arc6_terminal_map && flags.arc6_satoshi_route_shared;
          const hasElenaProof = flags.arc6_archive_fragments || flags.arc6_observers_counted;
          const routeCollapsed = flags.arc6_satoshi_void && !flags.arc6_terminal_map;

          if (stats.sanity <= 0) {
            flags.finale_ending = 'end_vessel';
          } else if (flags.joined_marcus) {
            flags.finale_ending = 'end_order';
          } else if (
            flags.elena_quest_complete &&
            hasProtocol &&
            hasElenaProof &&
            !flags.arc6_elena_distance &&
            stats.intelligence >= 55
          ) {
            flags.finale_ending = 'end_elena';
          } else if (
            stats.intelligence >= 60 &&
            stats.sanity < 35 &&
            flags.satoshi_allied &&
            hasDeepRoute &&
            flags.grey_d75_fate === 'questioned'
          ) {
            flags.finale_ending = 'end_true_mobius';
          } else if (flags.marcus_defeated) {
            flags.finale_ending = 'end_marcus_slayer';
          } else if (
            flags.sasha_saved &&
            flags.aris_saved &&
            hasGreyCoords &&
            (hasSashaBond || hasArisBond) &&
            !flags.arc6_sasha_distance &&
            !flags.arc6_aris_regret &&
            !routeCollapsed &&
            (flags.arc6_aris_passage_hint || flags.arc6_satoshi_route_shared || stats.intelligence >= 50)
          ) {
            flags.finale_ending = 'end_salvation';
          } else {
            flags.finale_ending = 'end_lone_wolf';
          }
        },
        nextSceneId: 'finale_resolution'
      }
    ]
  },
  'finale_resolution': {
    id: 'finale_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      const end = ctx.game.flags.finale_ending;
      if (end === 'end_vessel') {
        return '【结局 06：容器】你的理智终于先于门打开前耗尽。白衣人抬走你时，动作轻得像在回收一件保养得还不错的设备。你没有离开这场实验，你只是被重新归类了。';
      }
      if (end === 'end_order') {
        return '【结局 05：新秩序】你走出了那道门，也被门外的人留了下来。白衣人没有把你带去别处，而是把你领向了另一扇还亮着灯的门。';
      }
      if (end === 'end_elena') {
        return '【结局 04：数据的继承者】Elena 带着残档和那份终止协议离开了设施。你们穿过地表风口时，文件夹始终被她压在臂弯里，没有松开。';
      }
      if (end === 'end_true_mobius') {
        return '【真结局：莫比乌斯环】你顺着 Grey 留下的话、Satoshi 拼出的断路和那些缺页走了出去。门外还有更高的围栏、更远的灯带，以及玻璃后面没有熄灭的观察窗。';
      }
      if (end === 'end_marcus_slayer') {
        return '【结局 03：弑王者】你亲手打碎了这里最具体的一种统治，也因此带着那份重量走了出去。门外的风是真的，可落在你身上时，依旧没法把手上的血彻底吹干。';
      }
      if (end === 'end_salvation') {
        return '【结局 02：薪火】你没有一个人出去。Sasha 握着那枚残破吊坠里拆下来的旧照片，Aris 照着自己记住的转运顺序带着你们避开了最后一拨人。风吹过来时，你们三个人都没有停下。';
      }
      if (
        ctx.game.flags.arc6_sasha_distance ||
        ctx.game.flags.arc6_aris_regret ||
        ctx.game.flags.arc6_satoshi_void ||
        ctx.game.flags.arc6_elena_distance
      ) {
        return '【结局 01：自由的幽灵】你独自一个人穿过那道门，走进了荒凉而空旷的地表。';
      }
      return '【结局 01：自由的幽灵】你独自一个人穿过那道门，走进了荒凉而空旷的地表。';
    },
    actions: [
      {
        id: 'game_over',
        label: '实验结束',
        timeCost: 0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('感谢游玩 PROJECT ORDER。', 'info');
        }
      }
    ]
  }
};

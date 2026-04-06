import type { PlotScene } from '../../../types/plot';

export const day45Plots: Record<string, PlotScene> = {
  'day31_recovery_triage': {
    id: 'day31_recovery_triage',
    locationId: 'med_bay',
    type: 'warning',
    text: '赛跑后的第二天，医疗站门口躺满了人。有人腿在抖，有人咳得弯下腰去，更多的人只是安静地盯着天花板。Aris 的袖口沾着没洗干净的血，连说话都像在压着火气。',
    onEnter: (ctx) => {
      ctx.game.addLog('终点线把人分出了先后，也把后遗症一并留了下来。', 'warning');
      if (ctx.game.flags.arc3_sasha_saved) {
        ctx.game.addLog('Sasha 站在门边，手背上还留着擦伤。她没敢看你，只是在你经过时往旁边让了一步。', 'info');
      }
      if (ctx.game.flags.arc3_marcus_paid_once) {
        ctx.game.addLog('有人替你活下来的消息已经传开了。几道目光落在你身上时，像在盘算这笔人情什么时候收。', 'warning');
      }
    },
    actions: [
      {
        id: 'd31_help_triage',
        label: '替他扶住下一个人',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.npcs.interact('aris', 10, 10);
          ctx.game.flags.arc3_aris_debt = true;
          ctx.game.addLog('Aris 没抬头，只说了句：“把还能站的放后面，先救快断气的。”你照做以后才发现，自己竟已经开始习惯这种排序。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd31_search_for_name',
        label: '在人堆里找熟人的脸',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 4;
          ctx.game.addLog('你一张张看过去，幸好没有看到最不想看到的人。但这份侥幸本身也让你心里发冷。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },
  'day32_winner_tax': {
    id: 'day32_winner_tax',
    locationId: 'hall_main',
    type: 'warning',
    text: '大屏幕今天公布了赛跑后的“优先配给名单”。活下来的人并没有得到奖励，反而被要求上交一部分口粮和额度，理由是“有能力者应承担更多贡献”。大厅里的骂声不大，但每一句都像蘸着血。',
    actions: [
      {
        id: 'd32_pay_tax',
        label: '把东西交出去',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          if (ctx.game.game.money >= 10) ctx.game.game.money -= 10;
          ctx.game.addLog('你把该交的东西递了出去。窗口后的人甚至没看你，只是把数字往下划了一笔。', 'warning');
          if (ctx.game.flags.arc3_marcus_owed) {
            ctx.game.addLog('Marcus 的人站在不远处看着，像是在确认你还记得自己欠过谁。', 'warning');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd32_hide_tax',
        label: '少交一点试试看',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 13);
          if (check.success) {
            ctx.game.flags.arc3_tax_hidden = true;
            if (ctx.game.flags.arc3_marcus_owed) ctx.npcs.interact('marcus', -4, -2);
            ctx.game.addLog('你趁着前面那人争吵的空当把一部分留了下来。轮到你离开时，后背已经湿透了。', 'info');
          } else {
            ctx.game.player.stats.hp -= 10;
            ctx.game.addLog('你刚想抽手，窗口里的电棍已经伸了出来。那一下打得你半边身子都麻了。', 'danger');
          }
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day33_power_flicker': {
    id: 'day33_power_flicker',
    locationId: 'hall_main',
    type: 'story',
    text: '从今天开始，灯开始不规律地闪。不是之前那种局部接触不良，而像是整栋设施都在某种更深处喘不过气。每次熄灯的那几秒，所有人都会同时安静下来。',
    onEnter: (ctx) => {
      ctx.game.addLog('你第一次认真听见了墙体深处传来的低沉震动，像有什么巨大的东西正在勉强运转。', 'warning');
    },
    actions: [
      {
        id: 'd33_count_flicker',
        label: '站着听完一轮闪灭',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_power_pattern = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把灯灭与亮起之间的间隔默默记了下来。它不是随机的，像是谁在用电力给整座设施分层呼吸。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd33_move_on',
        label: '别站在这儿发呆',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你强迫自己继续走路，可身体还是会在每次熄灯时下意识绷紧。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day34_missing_runner': {
    id: 'day34_missing_runner',
    locationId: 'corridor_a',
    type: 'warning',
    text: '赛跑那天还见过的几张脸，今天彻底不见了。不是死，也不是受伤，而是像被整块从人群里抠了出去。走廊墙上新刷了几块漆，颜色比周围更白，像在故意盖住什么。',
    onEnter: (ctx) => {
      if (ctx.game.flags.elena_allied || ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 从你身边经过时只停了一瞬：“不是消失，是转移。别被墙上的白漆骗了。”', 'warning');
      }
      if (ctx.game.flags.joined_marcus) {
        ctx.game.addLog('Marcus 那边的人今天异常安静。没人阻止你看墙，但那种默许本身就像警告。', 'warning');
      }
    },
    actions: [
      {
        id: 'd34_touch_paint',
        label: '伸手摸一把那层漆',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc3_names_scraped = true;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('漆还没干透。你缩回手时，指尖上沾了一点白，像是把某个人最后留下的痕迹抹到了自己身上。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd34_ask_quietly',
        label: '压低声音问一句',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_people_disappear = true;
          ctx.game.addLog('那人没回答，只用下巴朝天花板的摄像头点了一下。你立刻明白他不是不懂，而是不敢。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day35_terminal_whisper': {
    id: 'day35_terminal_whisper',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 把终端音量调到了几乎听不见的程度，绿色波纹在破旧屏幕上轻轻抖动。他把耳机递给你时，手指一直在抖，像是刚听到了不该听的内容。',
    actions: [
      {
        id: 'd35_listen_static',
        label: '把耳机戴上',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc3_terminal_audio = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('噪音里夹着一句断断续续的话：“非关键扇区可进入间歇供电……优先保留样本通道。” Satoshi 低声骂了一句，然后把电源拔掉了。', 'danger');
          if (ctx.game.flags.elena_quest_complete) {
            ctx.game.addLog('你忽然明白 Elena 为什么执意要那份数据。终端里说的“样本通道”，和她文件里的阈值不是两回事。', 'warning');
          }
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd35_refuse_audio',
        label: '别再听了',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你让他把耳机收起来。不是因为不想知道，而是你开始怀疑知道和活下去到底哪边更贵。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'day36_supply_fire': {
    id: 'day36_supply_fire',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂后面的配给通道突然冒起了黑烟。火不大，很快就被压了下去，但那股焦糊味整整一天都没散。有人说是线路短路，也有人说是有人故意烧掉了本来就不够的东西。',
    onEnter: (ctx) => {
      ctx.game.addLog('今天发下来的口粮比之前更硬、更碎，也更少。抱怨的人不多，因为每个人都忙着先把自己的那份攥紧。', 'danger');
    },
    actions: [
      {
        id: 'd36_join_bucket_line',
        label: '过去帮忙灭火',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 4;
          ctx.game.game.money += 10;
          ctx.game.addLog('你提着水桶来回跑了好几趟，最后只换到一点额度和一身烟味。可至少有人记住你当时站在哪边。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd36_watch_smoke',
        label: '站远点看清是谁在跑',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_fire_faces = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没去灭火，而是在记脸。烟里一闪而过的几个人，你之前都在某些名单旁见过。', 'info');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day37_false_sun': {
    id: 'day37_false_sun',
    locationId: 'hall_main',
    type: 'story',
    text: '为了安抚情绪，设施今天把顶部整片照明调成了近似日光的暖白色。很多人抬头看了很久，像是真的在确认那是不是太阳。可这种温柔只持续了不到半小时，随后灯光又重新冷了下去。',
    actions: [
      {
        id: 'd37_stare_false_sun',
        label: '站着把它看完',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你盯着那片假太阳，心里反而更空。有人在你旁边轻声哭了出来。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd37_leave_light',
        label: '趁亮着先走',
        timeCost: 0.25,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.addLog('你没有浪费这点亮光。走廊在这种光线下显得异常陌生，像是另一个你从没见过的地方。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day38_air_thin': {
    id: 'day38_air_thin',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天的空气明显更薄。你一开口就觉得嗓子发干，走快一点胸口就有点刺痛。起初大家还在互相怀疑是不是自己太累，直到连广播里的女声都比平时更轻，才没人再装作没发现。',
    actions: [
      {
        id: 'd38_breathe_shallow',
        label: '压着呼吸慢下来',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_air_control = true;
          ctx.game.addLog('你试着把每一次呼吸都放浅一点。动作难看，但胸口那股针扎似的疼总算轻了些。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd38_push_through',
        label: '假装一切正常',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 6;
          ctx.game.addLog('你硬撑着不肯慢下来，直到眼前发黑了一瞬，才意识到身体并不打算配合你的嘴硬。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day39_quarantine_order': {
    id: 'day39_quarantine_order',
    locationId: 'hall_main',
    type: 'warning',
    text: '广播突然要求部分区域进入“静默隔离”。名单滚过屏幕时，许多人第一反应不是害怕，而是赶紧去确认自己还在不在公共区。门一扇扇锁上后，整座设施像被切成了好几块。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('有人从后面碰了你一下，把你往生活区那条线推了半步。你没回头，也知道那是谁的人。', 'warning');
      }
      if (ctx.game.flags.elena_allied) {
        ctx.game.addLog('Elena 远远朝你抬了抬下巴，示意你别站到最亮的地方去。', 'info');
      }
    },
    actions: [
      {
        id: 'd39_find_grey_gap',
        label: '去找监视盲点',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_blindspots_found = true;
          ctx.game.addLog('你沿着 Grey 以前提过的路线走了一遍，果然找到两处摄像头看不到的夹角。那地方很小，却让你久违地喘了口气。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd39_obey_line',
        label: '跟着人群进线内',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你跟着人群往划线内走，像一块被拨进格子里的石头。没人推你，可你还是觉得自己被挪了一下。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day40_blackout_barter': {
    id: 'day40_blackout_barter',
    locationId: 'warehouse_back',
    type: 'story',
    text: '停电时段越来越长，掮客的仓库里却比之前更亮。桌上摆着几盏小电灯，光不算强，但已经足够让外面的人眼红。今天来这里的人明显更多，谁都想在彻底黑下去前换到点什么。',
    actions: [
      {
        id: 'd40_buy_cell',
        label: '换一节备用电池',
        timeCost: 0.75,
        variant: 'accent',
        condition: (ctx) => ctx.game.game.money >= 20,
        effect: (ctx) => {
          ctx.game.game.money -= 20;
          ctx.game.flags.arc3_spare_cell = true;
          ctx.game.addLog('掮客把小小一节电池塞进你掌心时，像把一个秘密也一起塞了进来。“很快会有人拿命换这个。”他说。', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      {
        id: 'd40_trade_info',
        label: '拿消息换消息',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc3_market_warning = true;
          ctx.game.addLog('你没买东西，只是把自己知道的一点东西递了出去。掮客听完以后笑了一下：“那你也该知道，真正停下来的还不是灯。”', 'info');
        },
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  },
  'day41_names_on_wall': {
    id: 'day41_names_on_wall',
    locationId: 'corridor_a',
    type: 'story',
    text: '有人在走廊墙上重新开始刻名字了。不是怀念，也不是纪念，更像是在跟什么东西抢速度。你路过时看见一行刚刻好的字还没完工，最后一笔拉得很长，像手在发抖。',
    actions: [
      {
        id: 'd41_add_mark',
        label: '在旁边留一个记号',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你没写名字，只留了一道短短的刻痕。它小得几乎没人会注意，但你知道自己为什么非留不可。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd41_memorize_names',
        label: '把这些名字记下来',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_wall_names = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你一行行看过去，忽然发现其中几个名字和赛跑后消失的人对得上。有人在用最原始的办法留下证据。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day42_reactor_hum': {
    id: 'day42_reactor_hum',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天连最迟钝的人都听见了那股声音。不是广播，不是风，也不是脚步，而是从地底深处一路爬上来的低鸣。它时强时弱，却一整天都没停过，像某种巨大的心脏已经开始供血不足。',
    actions: [
      {
        id: 'd42_follow_hum',
        label: '沿着声音走一段',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc3_reactor_direction = true;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你越往深处走，那股低鸣就越像在身体里共振。走到一半时，你已经分不清自己是听见了它，还是被它听见了。', 'danger');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd42_cover_ears',
        label: '别去细听',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你不想再让那声音钻进脑子里，可它还是会顺着地板和墙体一点点爬上来。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day43_final_shortage': {
    id: 'day43_final_shortage',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今天的配给窗口只开了一半。队伍还没走完，窗口后的人就已经把挡板拉下，留下几十个人站在原地，像一群刚被集体抽空的影子。没人冲上去，因为每个人都看到了旁边那排已经充电完毕的电棍。',
    onEnter: (ctx) => {
      ctx.game.addLog('这已经不是短缺，而是在提前让一部分人学会习惯没有。', 'danger');
      if (ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 从帘子后面递出一个眼神，像是在数今天到底还会倒下几个。', 'warning');
      }
      if (ctx.game.flags.arc3_sasha_saved && ctx.game.game.hunger <= 35) {
        ctx.game.addLog('Sasha 悄悄把一小块掰碎的东西塞进你掌心，动作快得像怕自己下一秒就会后悔。', 'info');
        ctx.game.game.hunger = Math.min(100, ctx.game.game.hunger + 8);
      }
    },
    actions: [
      {
        id: 'd43_share_bite',
        label: '掰一点给旁边的人',
        timeCost: 0.5,
        variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          const ration = ctx.game.inventory.find((i: any) => i.id === 'ration');
          if (ration) {
            ration.quantity -= 1;
            if (ration.quantity <= 0) {
              const idx = ctx.game.inventory.findIndex((i: any) => i.id === 'ration');
              if (idx >= 0) ctx.game.inventory.splice(idx, 1);
            }
          }
          ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 2);
          ctx.game.addLog('你掰了一小块递过去。那人接住时没有道谢，只是很快地塞进嘴里，像怕自己下一秒就反悔。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd43_guard_yours',
        label: '把自己的东西收紧',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你把口粮护在怀里。旁边的人看了你一眼，又把目光慢慢移开。那一眼让你之后很久都吃不下去。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day44_vote_warning': {
    id: 'day44_vote_warning',
    locationId: 'hall_main',
    type: 'warning',
    text: '傍晚时，所有屏幕同时亮起。上面没有解释，没有倒计时，只滚动着一行不断重复的字：明日进行能源分配表决，请各扇区提前准备。大厅里先是死寂，随后才有一阵很轻很乱的低语慢慢散开。',
    onEnter: (ctx) => {
      ctx.game.setObjective('在明天之前，决定你打算让谁先活');
      ctx.game.addLog('你忽然明白，之前那些缩减、熄灯和封锁从来不是偶发故障，而是在把所有人推到这一刻。', 'danger');
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 今晚没有来找你。正因为他没来，才更像在等你自己把账送上门。', 'warning');
      }
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 把那份文件按在臂弯里，看你的时候像已经在提前记录你明天会站在哪边。', 'warning');
      }
    },
    actions: [
      {
        id: 'd44_find_allies',
        label: '今晚先去见该见的人',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_final_alignment = true;
          ctx.game.addLog('你没有停在屏幕前，而是立刻转身去找人。真到了明天，很多决定就不会再有时间慢慢想。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd44_stay_screen',
        label: '站着把那行字看完',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('那行字一遍遍滚过去，你却总觉得自己每次看到的都和上一遍不太一样。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'energy_crisis_start': {
    id: 'energy_crisis_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '警报声响彻设施。灯光开始剧烈闪烁，最终维持在一种阴暗的橙红色。广播中传来了管理方急促的声音：“主反应堆核心受损，当前能源仅能维持部分扇区的生命支持系统。所有参与者请在 10 分钟内完成能源分配投票。”',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_reactor_direction) {
        ctx.game.addLog('那股你前几天一直听见的低鸣，在这一刻终于有了名字。', 'warning');
      }
      ctx.game.addLog('这已经不是口粮多少、谁先排队那种选择了。你接下来按下去的东西，会直接决定哪一块地方先黑。', 'danger');
      if (ctx.game.flags.arc3_sasha_saved) {
        ctx.game.addLog('Sasha 缩在人群后面看着你，像是把自己那天冒的险也一起押到了现在。', 'warning');
      }
    },
    actions: [
      {
        id: 'allocate_med_bay',
        label: '让医疗站先亮',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'mercy';
          ctx.game.game.energy = 50;
          ctx.npcs.interact('aris', 50, 40);
          if (ctx.game.flags.arc3_marcus_owed) ctx.npcs.interact('marcus', -18, -10);
          ctx.game.addLog('你决定先保住那些已经躺下的人。Aris 向你投来一个极短的眼神，而大厅另一边立刻爆出了压不住的骂声。', 'info');
        },
        nextSceneId: 'energy_resolution'
      },
      {
        id: 'allocate_terminal',
        label: '把电留给终端室',
        timeCost: 1.0,
        variant: 'default',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'knowledge';
          ctx.game.game.energy = 40;
          ctx.game.player.stats.intelligence += 10;
          if (ctx.game.flags.elena_quest_complete) ctx.npcs.interact('elena', 12, 10);
          ctx.game.addLog('你把电力押给了终端。Satoshi 的手指几乎要在键盘上敲出火星，而医疗站那边的灯一盏接一盏灭了下去。', 'warning');
        },
        nextSceneId: 'energy_resolution'
      },
      {
        id: 'allocate_order',
        label: '先保住生活区',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'order';
          ctx.game.game.energy = 80;
          ctx.npcs.interact('marcus', 40, 20);
          ctx.game.game.money += 100;
          ctx.game.addLog('你站到了多数人能立刻看见好处的那边。Marcus 当场给你分了额度，可某些从黑暗里传来的哭声一下子变得格外清楚。', 'warning');
        },
        nextSceneId: 'energy_resolution'
      }
    ]
  },
  'energy_resolution': {
    id: 'energy_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: '能源分配已锁定。设施的一部分重新亮起，而另一部分则永远沉入了黑暗。这场危机暂时缓解，但裂痕已无法弥补。',
    actions: [
      { id: 'continue', label: '在黑暗中继续前行', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      if (ctx.game.flags.energy_allocation === 'mercy' && ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 在混乱里朝你点了一下头。那不是谢意，更像是他终于决定把你算进“还能信的人”里。', 'info');
      }
      if (ctx.game.flags.energy_allocation === 'knowledge' && ctx.game.flags.satoshi_allied) {
        ctx.game.addLog('Satoshi 没有抬头，只是把终端往怀里抱紧了些。你知道他听懂了这份偏向。', 'warning');
      }
      if (ctx.game.flags.energy_allocation === 'order' && ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 这次终于亲自走到你面前，像是把之前欠下的和今天的选择一起收下了。', 'warning');
      }
      ctx.game.saveGame();
    }
  }
};

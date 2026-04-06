import type { PlotScene } from '../../../types/plot';

export const day60Plots: Record<string, PlotScene> = {
  'day46_after_blackout': {
    id: 'day46_after_blackout',
    locationId: 'hall_main',
    type: 'warning',
    text: '能源表决后的第二天，灯是亮着的，可每个人都像还没从黑暗里出来。大厅被重新划了线，谁该站哪边、谁能靠近哪张桌子，忽然都有人开始管。',
    onEnter: (ctx) => {
      if (ctx.game.flags.energy_allocation === 'order') {
        ctx.game.addLog('Marcus 的人开始在过道边站岗，像是这地方本来就该归他们管。', 'warning');
      }
      if (ctx.game.flags.energy_allocation === 'knowledge') {
        ctx.game.addLog('终端室门口多了两层锁。Satoshi 抬头看了你一眼，像在估算这点电还能换几天时间。', 'warning');
      }
      if (ctx.game.flags.energy_allocation === 'mercy') {
        ctx.game.addLog('医疗站外的人更多了。Aris 说话时已经不再抬头，像怕一抬头就要看到新的请求。', 'warning');
      }
    },
    actions: [
      {
        id: 'd46_watch_lines',
        label: '先看谁在画线',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_control_map = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没去争位置，只把谁在发话、谁在记名字先记了下来。到了现在，线从来不是画给地上的。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd46_keep_head_low',
        label: '先把自己缩进去',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你站到了最不显眼的地方。视线少了些，可那种被挑剩下的感觉并没有跟着少。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day47_hunt_notice': {
    id: 'day47_hunt_notice',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天的大屏幕只滚动一件事：资源贡献率将开始周审，连续落后者会被转入“再评估名单”。没人解释那是什么意思，因为已经不需要解释了。',
    onEnter: (ctx) => {
      ctx.game.addLog('大厅里安静得只剩翻纸声。你知道，从今天开始，很多人会被迫先盯住别人。', 'danger');
    },
    actions: [
      {
        id: 'd47_remember_faces',
        label: '记住谁先开始看人',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_watchers_marked = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('名单滚动时，有几张脸亮得比屏幕还快。你把那些反应先记下了。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd47_leave_before_end',
        label: '别把名单看完',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你在最后几页滚出来前先离开了。可没看到，不代表那几页上不会有你认识的人。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day48_tagged_beds': {
    id: 'day48_tagged_beds',
    locationId: 'cell_01',
    type: 'warning',
    text: '一早回来时，你看见几间床位边缘被人做了记号。不是编号，也不是检查印章，更像是临时留下的取件标识。被记上的人今天都说得比平时更轻。',
    actions: [
      {
        id: 'd48_scrape_mark',
        label: '把记号刮掉',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc4_marks_scraped = true;
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你把边缘那点痕迹慢慢刮花，可你心里清楚，真正记住这些床位的从来不是漆。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd48_check_neighbors',
        label: '看看谁的床被碰过',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_marked_beds_known = true;
          ctx.game.addLog('你沿着床位看过去，忽然发现那些被做了记号的人，大多在最近几次名单里都排在后段。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },
  'day49_whisper_network': {
    id: 'day49_whisper_network',
    locationId: 'corridor_a',
    type: 'story',
    text: '走廊里开始有人专门低声报消息。不是帮人，是换债。谁昨晚被叫走、谁今天没领到配给、谁和执行队说过话，这些名字在墙边和拐角一层层传开。',
    onEnter: (ctx) => {
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 递给你半页撕下来的纸，只写着几个名字和时间。她一句解释都没有。', 'info');
      }
    },
    actions: [
      {
        id: 'd49_listen_network',
        label: '站着把消息听全',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_whisper_network = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没插话，只把这些碎消息在脑子里拼成了一张更糟的图。有人已经开始为清洗提前点名。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd49_trade_own_info',
        label: '拿一点自己的见闻换',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc4_owed_whisper = true;
          ctx.game.addLog('你递出去一条不算致命的消息，换回来另一条更重要的。这里的嘴，已经越来越像另一种市场。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day50_supply_frisk': {
    id: 'day50_supply_frisk',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今天发配给前，每个人都被要求张开手、掀开衣角、把口袋翻出来。检查的人不多，但看得很仔细，像在挑谁还藏得起一点明天。',
    onEnter: (ctx) => {
      ctx.game.addLog('队伍比平时安静得多。有人连吞咽都显得小心，像怕把什么声音露出来。', 'warning');
    },
    actions: [
      {
        id: 'd50_empty_pockets',
        label: '把手全摊开',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你什么都没藏。检查你的人看得久了一点，像是在怀疑这份坦白是不是装出来的。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd50_hide_better',
        label: '先挪掉最要紧的东西',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 14);
          if (check.success) {
            ctx.game.flags.arc4_cache_secured = true;
            ctx.game.addLog('你在排队前就把最要紧的那点东西分开塞好了。轮到你时，他们只翻出一些不值一提的零碎。', 'info');
          } else {
            ctx.game.player.stats.hp -= 8;
            ctx.game.addLog('你还没来得及收好，手背就被电棍末端敲了一下。那人没多说，只把视线在你身上停得更久。', 'danger');
          }
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day51_friend_or_witness': {
    id: 'day51_friend_or_witness',
    locationId: 'hall_main',
    type: 'story',
    text: '从今天开始，帮人和害人之间的距离忽然变得很短。你给谁递一句提醒、替谁挡一下视线、把谁的名字记在心里，都可能在之后被当成证词。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 走过你身边时，像随口一样说了句：“到时候，别站错边。”', 'warning');
      }
      if (ctx.game.flags.elena_allied) {
        ctx.game.addLog('Elena 抬笔在本子上停了一瞬，像是在等你自己决定要不要被她记进去。', 'warning');
      }
    },
    actions: [
      {
        id: 'd51_choose_witness',
        label: '先把该记的人记住',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_names_to_keep = true;
          ctx.game.addLog('你没有急着说话，只先把那几张今天不能丢掉的脸记进脑子里。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd51_avoid_eye_contact',
        label: '谁也别看太久',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你把视线压得很低。这样也许安全一点，可也像是在提前练习装作不认识任何人。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day52_smoke_test': {
    id: 'day52_smoke_test',
    locationId: 'corridor_a',
    type: 'warning',
    text: '一段走廊今天突然被放了烟。不是火警，更像一次试验。守卫站在外面看着人群往哪边退、谁先被呛倒、谁知道去哪里找缝。',
    actions: [
      {
        id: 'd52_follow_gaps',
        label: '顺着缝隙摸出去',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_smoke_route = true;
          ctx.game.player.stats.dexterity += 1;
          ctx.game.addLog('你没往亮处挤，而是贴着墙和人群之间的空隙摸了出去。有人注意到了你的路。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd52_help_stumbler',
        label: '拽住旁边快倒的人',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 4;
          ctx.game.player.stats.sanity += 1;
          ctx.game.addLog('你把那人拖到了能喘气的地方，自己也跟着吸了几口更呛的烟。守卫看见了，但什么都没说。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day53_quiet_transfer': {
    id: 'day53_quiet_transfer',
    locationId: 'med_bay',
    type: 'warning',
    text: '医疗站今晚少了两张脸，多了三份空表。没有人问去哪了，Aris 也没有解释，只是一张张把表翻过去，像是在把人从纸上先处理掉。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 在你靠近时停了一下，低声说：“从现在开始，空床比病人更危险。”', 'warning');
      }
    },
    actions: [
      {
        id: 'd53_read_forms',
        label: '看清那些空表',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_blank_forms = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('那些表上没有病名，只有编号、时间和转运栏。你忽然明白，很多人是在死之前先被归类。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd53_leave_aris_work',
        label: '别在这时候逼他开口',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你什么都没问。Aris 也什么都没留你。如今沉默已经成了这里最常见的保护方式。', 'info');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },
  'day54_hidden_census': {
    id: 'day54_hidden_census',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天没有正式点名，可每一个区域都像在被重新数人。守卫不再问名字，只看脸、看腿、看谁跟谁坐在一起。',
    actions: [
      {
        id: 'd54_change_pattern',
        label: '今天换个坐法和路线',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_pattern_broken = true;
          ctx.game.addLog('你故意把今天走得和往常不一样。这样也许会更显眼，但至少不会显得太好算。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd54_stay_habitual',
        label: '照旧，别露慌',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你一切照旧。省事，可也像主动把自己交给别人总结成一张更完整的表。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day55_last_safe_corner': {
    id: 'day55_last_safe_corner',
    locationId: 'cell_02',
    type: 'story',
    text: '连最乱的角落也开始有人固定看守了。Satoshi 的房间还亮着一点微绿的光，可那点光第一次显得不像秘密，更像最后一块还没被收走的边角。',
    onEnter: (ctx) => {
      if (ctx.game.flags.satoshi_allied) {
        ctx.game.addLog('Satoshi 把门先关到只剩一条缝，才让你进去。“他们开始记电了，”他说。', 'warning');
      }
    },
    actions: [
      {
        id: 'd55_check_backup',
        label: '问他还剩什么能用',
        timeCost: 0.75,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc4_satoshi_backup = true;
          ctx.game.addLog('Satoshi 从床板下面摸出一小包拆开的零件，像给你看一副已经快凑不齐的骨架。', 'info');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd55_leave_quickly',
        label: '别在这儿待太久',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你很快离开了。现在连停留时间，都开始像另一种会被记下来的东西。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'day56_names_removed': {
    id: 'day56_names_removed',
    locationId: 'corridor_a',
    type: 'warning',
    text: '墙上的名字今天少了一整片。不是被盖住，也不是被划花，而是被整块磨平，像从来没刻上去过。旁边地上留着一层很细的白灰。',
    actions: [
      {
        id: 'd56_collect_dust',
        label: '捻一点灰在指尖',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('那层灰细得像骨粉。你立刻松手，却还是觉得指缝里沾着什么。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd56_compare_memory',
        label: '想想少掉的是谁',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_missing_names_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把记忆里的那面墙和现在比了一遍，发现被磨掉的，几乎都是最近几天最容易被叫到的人。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day57_route_rehearsal': {
    id: 'day57_route_rehearsal',
    locationId: 'hall_main',
    type: 'warning',
    text: '执行队今天没有抓人，只是在各区之间来回走了几遍。门开几秒、关几秒，哪边先堵、哪边好封，像是在演练一次还没开始的搬运。',
    onEnter: (ctx) => {
      ctx.game.addLog('没有人会把这称作预演，可每个人都看得出来它就是。', 'danger');
    },
    actions: [
      {
        id: 'd57_count_steps',
        label: '记他们走哪条线',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_purge_route_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你数着靴子声和门锁声，把这套路线记进脑子里。真正开始时，它们大概不会有太大区别。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd57_stay_out_of_view',
        label: '别让他们记住你的脸',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你始终站在看不清全脸的地方。这样很好，可也意味着你今晚什么都带不走。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day58_lock_test': {
    id: 'day58_lock_test',
    locationId: 'cell_01',
    type: 'warning',
    text: '半夜，整排门锁突然一起落了一次，又很快弹开。没人出来骂，也没人拍门，因为所有人都知道这不是故障，是在确认哪一扇门还关得住人。',
    actions: [
      {
        id: 'd58_test_door',
        label: '摸一把门缝和锁舌',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_door_timing = true;
          ctx.game.addLog('你在黑里摸到锁舌回弹的节奏。它快得不近人情，但还是有一点点能被记住的迟滞。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd58_wait_in_dark',
        label: '一动不动等过去',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你没有靠近门。可那一下落锁声还是让你的胃跟着缩了一下。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },
  'day59_purge_eve': {
    id: 'day59_purge_eve',
    locationId: 'hall_main',
    type: 'warning',
    text: '今晚的大厅比之前任何一次都安静。没有人吵，没有人抢位置，甚至连碗勺碰撞都轻得像怕惊动明天。可那种安静不是平静，而是所有人都在把最后一点力气往身体里收。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬过今晚，决定明天你打算先护住谁');
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 今晚只看了你一眼，像在提醒你明天不是第一次站边。', 'warning');
      }
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 把本子合上时，像已经替明天写完了开头。', 'warning');
      }
      if (ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 经过你身边时只说了一句：“明天别太晚。”他没有说晚了什么会来不及。', 'warning');
      }
    },
    actions: [
      {
        id: 'd59_find_one_person',
        label: '今晚先去见一个人',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_commitment_made = true;
          ctx.game.addLog('你没有让今晚就这么过去。明天真来了，很多话未必还说得出口。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd59_hold_wall',
        label: '靠着墙把夜熬完',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你什么都没做，只把背抵在墙上。可夜越长，越像有人在隔着墙替你倒数。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'the_great_purge_start': {
    id: 'the_great_purge_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '“第60天。清洗程序启动。检测到资源贡献率不达标者共计 24 名。执行队已出发。”广播声在大厅回荡，伴随着沉重的靴子踏地声。今天终于没有人再假装听不懂。',
    onEnter: (ctx) => {
      ctx.game.addLog('你看见执行队正带着武器走向各个区域。真正可怕的不是他们终于来了，而是很多人昨晚就已经知道他们会走哪条路。', 'danger');
      if (ctx.game.flags.arc4_purge_route_known) {
        ctx.game.addLog('你记得他们预演过的路线。那一点点提前知道的顺序，现在终于要派上用场。', 'warning');
      }
      if (ctx.game.flags.grey_d45_done) {
        ctx.game.addLog('Grey 当初留给你的那张纸，忽然在脑子里变得比任何一句话都清楚。', 'warning');
      }
    },
    actions: [
      {
        id: 'save_sasha',
        label: '去找 Sasha',
        condition: (ctx) => ctx.npcs.npcs['sasha'].state === 'Alive' && ctx.npcs.npcs['sasha'].favorability > 20,
        timeCost: 2.0,
        variant: 'danger',
        effect: (ctx) => {
          const bonus = (ctx.game.flags.arc4_smoke_route ? 4 : 0)
            + (ctx.game.flags.arc4_door_timing ? 3 : 0)
            + (ctx.game.flags.arc3_sasha_saved ? 4 : 0)
            + (ctx.game.flags.sasha_locket_returned ? 3 : 0);
          const penalty = ctx.game.flags.arc6_sasha_distance ? 4 : 0;
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity + bonus - penalty, 62);
          if (check.success) {
            ctx.game.flags.sasha_saved = true;
            ctx.npcs.npcs['sasha'].state = 'Alive';
            ctx.game.addLog('你在废料区后侧的管道边找到了缩成一团的 Sasha，把她从执行队即将合拢的缺口里拖了出去。', 'info');
            if (ctx.game.flags.sasha_locket_returned) {
              ctx.game.addLog('她死死攥着胸前那枚早就坏掉的吊坠，跑起来时却第一次没有掉队。', 'warning');
            }
          } else {
            ctx.game.player.stats.hp -= 35;
            ctx.npcs.npcs['sasha'].state = 'Dead';
            ctx.game.addLog('你只差一点。执行队的灯先扫到了你们，Sasha 被硬生生从你手边拖走时，连哭声都来不及完整。', 'danger');
          }
        },
        nextSceneId: 'purge_resolution'
      },
      {
        id: 'save_aris',
        label: '去找 Aris',
        condition: (ctx) => ctx.npcs.npcs['aris'].state === 'Alive' && ctx.npcs.npcs['aris'].trust > 30,
        timeCost: 2.0,
        variant: 'danger',
        effect: (ctx) => {
          const bonus = (ctx.game.flags.arc4_blank_forms ? 4 : 0)
            + (ctx.game.flags.arc4_control_map ? 3 : 0)
            + (ctx.game.flags.arc3_aris_debt ? 4 : 0)
            + (ctx.game.flags.arc4_satoshi_backup ? 2 : 0)
            + (ctx.game.flags.aris_ration_given ? 3 : 0);
          const penalty = ctx.game.flags.arc6_aris_regret ? 4 : 0;
          const check = ctx.game.rollCheck(ctx.game.player.stats.intelligence + bonus - penalty, 60);
          if (check.success) {
            ctx.game.flags.aris_saved = true;
            ctx.npcs.npcs['aris'].state = 'Alive';
            ctx.game.addLog('你利用提前摸到的门锁节奏和一条备用通路，替 Aris 把医疗站后间短暂关成了死角。等执行队冲进去时，里面已经空了。', 'info');
            if (ctx.game.flags.aris_ration_given) {
              ctx.game.addLog('Aris 临走前把那份你很久前递出去的口粮账，轻轻拍回了你肩上。谁都没再提谢字。', 'warning');
            }
          } else {
            ctx.game.player.stats.hp -= 20;
            ctx.npcs.npcs['aris'].state = 'Dead';
            ctx.game.addLog('你慢了一步。执行队撞开门时，Aris 只来得及回头看你一眼，那一眼里的疲惫比绝望还重。', 'danger');
          }
        },
        nextSceneId: 'purge_resolution'
      },
      {
        id: 'hide_self',
        label: '先把自己藏起来',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有出去。门外的脚步声、撞门声、短促的喊叫声一层层压过来，像在替你把这个决定坐实。', 'warning');
          ctx.game.player.stats.sanity -= 20;
          const targets = ['sasha', 'aris', 'satoshi'].filter((id) => ctx.npcs.npcs[id].state === 'Alive');
          if (targets.length > 0) {
            const victim = targets[Math.floor(Math.random() * targets.length)];
            ctx.npcs.npcs[victim].state = 'Dead';
            ctx.game.addLog(`第二天，你再也没见过 ${ctx.npcs.npcs[victim].name}。`, 'danger');
          }
        },
        nextSceneId: 'purge_resolution'
      }
    ]
  },
  'purge_resolution': {
    id: 'purge_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      const saved: string[] = [];
      if (ctx.game.flags.sasha_saved) saved.push('Sasha');
      if (ctx.game.flags.aris_saved) saved.push('Aris');
      if (saved.length === 2) {
        return '靴声终于远了下去，可大厅比之前更空。你护住了两个人，可也因此更清楚地看见，还有更多人连名字都没能留下。';
      }
      if (saved.length === 1) {
        return `清洗过去了，可空气里还挂着火药和血腥味。你至少把 ${saved[0]} 留了下来，可这个“至少”轻得像一句借口。`;
      }
      return '杀戮的喧嚣终于远去。空气里弥漫着刺鼻的火药味和血腥气，设施再次空了一层，连回声都变得更薄。';
    },
    onEnter: (ctx) => {
      if (ctx.game.flags.sasha_saved) {
        ctx.npcs.interact('sasha', 20, 15);
        ctx.game.addLog('Sasha 还在发抖，却还是把手死死攥着，像终于确认自己没被带走。', 'info');
      }
      if (ctx.game.flags.aris_saved) {
        ctx.npcs.interact('aris', 15, 12);
        ctx.game.addLog('Aris 靠着墙喘气，袖口上的血已经干了。他看着你，像是第一次允许自己把一点重量交给别人。', 'info');
      }
      if (!ctx.game.flags.sasha_saved && !ctx.game.flags.aris_saved) {
        ctx.game.addLog('你活下来了，但这一次，“活下来”本身没给你留下任何可以抓住的东西。', 'warning');
      }
    },
    actions: [
      { id: 'continue', label: '继续呼吸', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ]
  }
};

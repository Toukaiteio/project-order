import type { PlotScene } from '../../../types/plot';

export const day20Plots: Record<string, PlotScene> = {
  'aftermath_reaction': {
    id: 'aftermath_reaction',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      if (ctx.game.flags.voted_marcus) {
        return '投票后的第五天，你在走廊里再次遇到了 Marcus T.。他的脸色比平时更加阴沉，两个跟班不怀好意地挡住了你的去路。';
      }
      if (ctx.game.flags.voted_elena) {
        return 'Elena V. 正在整理她的记录。看到你走近，她甚至没有抬头，只是冷冷地说：“有些人的数据正在变得无关紧要。”';
      }
      return '大厅里弥漫着一种诡异的安静。第15天的投票之后，幸存者们明显分成了几个小团体，而你似乎处于中心之外。';
    },
    onEnter: (ctx) => {
      ctx.game.addLog('投票没有让气氛平静下来，反而像是替之后的很多事开了头。', 'warning');
    },
    actions: [
      { 
        id: 'confront_consequences', 
        label: '走过去把话说清楚', 
        timeCost: 1.0, 
        variant: 'accent',
        nextSceneId: 'day20_branch_decision'
      }
    ]
  },
  'day20_branch_decision': {
    id: 'day20_branch_decision',
    locationId: 'hall_main',
    type: 'story',
    text: '你意识到，保持中立的日子已经结束了。投票只是第一次站队，接下来每一天都会有人逼你把位置站得更明白。',
    actions: [
      {
        id: 'seek_marcus_mercy',
        label: '先向 Marcus 低头',
        condition: (ctx) => ctx.game.game.money >= 20,
        timeCost: 1.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.game.money -= 20;
          ctx.game.flags.joined_marcus = true;
          ctx.npcs.interact('marcus', 15, 5);
          ctx.game.addLog('Marcus 接过你递过去的积分，冷哼了一声：“至少你知道先活哪边。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'seek_elena_truth',
        label: '去找 Elena 交换情报',
        condition: (ctx) => ctx.game.player.stats.intelligence >= 45,
        timeCost: 1.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.elena_allied = true;
          ctx.npcs.interact('elena', 20, 10);
          ctx.game.addLog('Elena 听完后才终于抬头。“很好，”她说，“至少你不是靠嗓门活到现在的。”', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'stay_independent',
        label: '谁也不靠',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc2_lone_mark = true;
          ctx.game.player.stats.sanity -= 5;
          ctx.game.addLog('你转身离开时，能感觉到几道目光一起落在你背上。谁也不靠，通常也意味着谁都不会替你说话。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day21_ration_audit': {
    id: 'day21_ration_audit',
    locationId: 'hall_main',
    type: 'warning',
    text: '配给站前立起了一块新屏幕，开始逐个显示每个人近五天的领取记录。每报出一个编号，周围就会有几个人下意识地抬头看一眼。轮到你时，空气安静得很不自然。',
    onEnter: (ctx) => {
      ctx.game.addLog('原来他们不只是发放口粮，也在统计谁快撑不住了。', 'danger');
    },
    actions: [
      {
        id: 'd21_keep_face',
        label: '站着别动',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc2_audit_seen = true;
          ctx.game.addLog('你没有露出任何反应。但你知道，从今天开始，别人会记得你的名字是出现在这块屏幕上的。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd21_mark_watchers',
        label: '记住谁在看你',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc2_audit_seen = true;
          ctx.game.flags.race_watchers_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没有看屏幕，而是在看人。比起名单本身，谁在名单亮起时露出兴趣更值得记住。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day22_faction_claim': {
    id: 'day22_faction_claim',
    locationId: 'corridor_a',
    type: 'warning',
    text: (ctx) => {
      if (ctx.game.flags.joined_marcus) {
        return 'Marcus 的人把一小段走廊清了出来，让你从中间穿过去。没人说话，但那种刻意腾出的空间本身就像一种宣告。';
      }
      if (ctx.game.flags.elena_allied) {
        return 'Elena 靠在墙边，像是在等你。她把一页折过的纸塞进你手里，只说了一句：“别让别人看见。”';
      }
      return '两拨人几乎同时朝你走来。Marcus 的跟班站在左边，Elena 的视线从另一头越过人群落到你脸上。你第一次感觉到，站在哪边本身也会成为一种答案。';
    },
    actions: [
      {
        id: 'd22_take_marcus_job',
        label: '接下 Marcus 的差事',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.joined_marcus = true;
          ctx.game.flags.arc2_marcus_runner = true;
          ctx.npcs.interact('marcus', 10, 10);
          ctx.game.addLog('你替 Marcus 把一张名单送去了后区。没人拦你，这比任何口头承认都更像站队。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd22_take_elena_note',
        label: '把 Elena 的纸收下',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.elena_allied = true;
          ctx.game.flags.arc2_elena_note = true;
          ctx.npcs.interact('elena', 10, 12);
          ctx.game.addLog('纸上只有一行字：别在跑的时候跟着人群。她连解释都没给你。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd22_refuse_both',
        label: '谁的话都不接',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc2_lone_mark = true;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你装作什么都没听见，径直走了过去。背后的沉默比争吵更让人不舒服。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day23_infirmary_overflow': {
    id: 'day23_infirmary_overflow',
    locationId: 'med_bay',
    type: 'story',
    text: '医疗站外排起了长队。有人扶着墙，有人坐在地上，还有人只是木然地捂着肚子。帘子后面不断传出呕吐和咳嗽声，空气里全是消毒水也盖不住的酸腐味。',
    onEnter: (ctx) => {
      ctx.game.addLog('Aris 的桌上堆着空瓶子。你忽然意识到，这地方最先不够用的从来不是床位。', 'warning');
    },
    actions: [
      {
        id: 'd23_help_aris',
        label: '帮 Aris 压住场面',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.npcs.interact('aris', 12, 12);
          ctx.game.flags.arc2_aris_helped = true;
          ctx.game.addLog('Aris 没空道谢，只在你转身时低声说了一句：“跑之前别空腹。”他像是在提醒，也像是在自言自语。', 'info');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd23_watch_symptoms',
        label: '站在一边观察',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc2_body_limit_known = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你注意到倒下去的人并不都是伤得最重的。更多是那些空着肚子硬撑的人。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },
  'day24_corridor_shakedown': {
    id: 'day24_corridor_shakedown',
    locationId: 'corridor_a',
    type: 'warning',
    text: '夜里，走廊被临时拉起了铁栅。守卫和囚犯混在一起，一间间搜过去，专挑那些看起来还能挤出点东西的人下手。轮到你这边时，铁门外已经有人开始哭了。',
    actions: [
      {
        id: 'd24_hide_ration',
        label: '先把口粮藏起来',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.day15_food_hidden = true;
          ctx.game.flags.arc2_cache_kept = true;
          ctx.game.addLog('你把最要紧的东西分散塞进几处不起眼的角落。搜到你这里时，他们只找到了一堆不值钱的破烂。', 'info');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd24_bribe_searchers',
        label: '递过去一点积分',
        timeCost: 0.5,
        variant: 'default',
        condition: (ctx) => ctx.game.game.money >= 15,
        effect: (ctx) => {
          ctx.game.game.money -= 15;
          ctx.game.flags.arc2_bribed_searchers = true;
          ctx.game.addLog('门外的人掂了掂你递过去的东西，什么也没说，敲了两下门框就走了。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd24_take_hit',
        label: '硬顶着让他们翻',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 12;
          ctx.game.player.stats.sanity -= 4;
          ctx.game.addLog('他们翻得很仔细，最后顺手给了你一脚，像是在提醒谁才有资格决定你还能留下什么。', 'danger');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  },
  'day25_black_market_whisper': {
    id: 'day25_black_market_whisper',
    locationId: 'warehouse_back',
    type: 'story',
    text: '仓库深处比平时更安静。掮客没点灯，只在桌上放了一盏小得可怜的应急灯。他看见你时没有寒暄，而是先把一张折起的路线图按在桌上，又慢慢收了回去。',
    actions: [
      {
        id: 'd25_buy_route',
        label: '把那张图买下来',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.game.money >= 25,
        effect: (ctx) => {
          ctx.game.game.money -= 25;
          ctx.game.flags.race_shortcut_known = true;
          ctx.game.addLog('掮客收了钱，只说：“跑的时候别跟着第一个转弯的人。”然后把图塞进了你袖口。', 'info');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      {
        id: 'd25_trade_food',
        label: '用一份口粮换消息',
        timeCost: 0.75,
        variant: 'danger',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          const rationIndex = ctx.game.inventory.findIndex((i: any) => i.id === 'ration');
          if (rationIndex >= 0) ctx.game.inventory.splice(rationIndex, 1);
          ctx.game.flags.race_shortcut_known = true;
          ctx.game.addLog('掮客把口粮拖到自己那边，笑得很轻。“你还真舍得。”然后他把路线说得比图纸更仔细。', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      {
        id: 'd25_leave_empty',
        label: '什么都不换',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你转身离开时，掮客在背后说：“不知道路的人，跑起来总是很像牲口。”', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  },
  'day26_lockdown_night': {
    id: 'day26_lockdown_night',
    locationId: 'hall_main',
    type: 'warning',
    text: '夜里突然停电了。备用红灯亮起后，大厅像被浸在血里。广播要求所有人原地等待，但很快你就听见远处传来奔跑声和撞门声。有人在黑暗里趁机做事。',
    actions: [
      {
        id: 'd26_follow_sound',
        label: '顺着声音摸过去',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 13);
          if (check.success) {
            ctx.game.flags.race_breath_rhythm = true;
            ctx.game.addLog('你在黑暗里追上了一队偷偷练跑的人。他们贴墙换气，步子极轻。你没靠太近，但已经记住了那种节奏。', 'info');
          } else {
            ctx.game.player.stats.hp -= 8;
            ctx.game.addLog('你撞上了废弃推车，金属声在黑暗里响得刺耳。等守卫脚步靠近时，你只能先退回去。', 'warning');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd26_wait_dark',
        label: '在原地熬到来电',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你站着不动，听黑暗里不断有人从你身边经过。等灯亮起来时，仿佛谁都没离开过原位。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day27_screening_notice': {
    id: 'day27_screening_notice',
    locationId: 'hall_main',
    type: 'warning',
    text: '今天的大屏幕没有播配给，而是反复播放一段新通知：第30天前，所有幸存者必须接受体能筛查。字迹闪烁得厉害，最后只剩下一行更大的红字：掉队者会被回收。',
    onEnter: (ctx) => {
      ctx.game.addLog('大厅里没人说话，但每个人都在看别人的腿、肩膀和脸色。', 'danger');
    },
    actions: [
      {
        id: 'd27_show_strength',
        label: '当场跑两圈给人看',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc2_ran_public = true;
          ctx.game.player.stats.hp -= 6;
          ctx.game.addLog('你强行让自己跑得很稳。有人因此移开了视线，也有人因此更认真地记住了你。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd27_leave_early',
        label: '趁大家盯着屏幕先离开',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc2_avoided_attention = true;
          ctx.game.addLog('你悄悄离开了大厅。少露一次脸，不代表危险就少一分，但至少今天没人能当场把你点出来。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day28_qualifier_run': {
    id: 'day28_qualifier_run',
    locationId: 'corridor_a',
    type: 'story',
    text: '几名守卫临时清空了半条走廊，让幸存者挨个跑过去。不是正式游戏，更像是在提前挑出谁会在第30天拖后腿。跑到尽头的人大多弯下腰咳嗽，很少有人能装得若无其事。',
    actions: [
      {
        id: 'd28_run_clean',
        label: '跟着他们跑完',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(Math.max(ctx.game.player.stats.strength, ctx.game.player.stats.dexterity), 14);
          if (check.success) {
            ctx.game.flags.race_confidence = true;
            ctx.game.addLog('你没有冲得太猛，只让自己看起来足够稳。守卫在表上勾了一笔，没再多看你。', 'info');
          } else {
            ctx.game.player.stats.hp -= 10;
            ctx.game.addLog('你跑到最后一段时脚下发软，几乎当场跪下去。那几个守卫看你的眼神，像是在提前给你编号。', 'danger');
          }
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd28_fake_limp',
        label: '故意装得更虚弱些',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc2_fake_weak = true;
          ctx.game.addLog('你把呼吸放乱，步子也拖得更沉。这样做能不能避开视线，你自己都不确定。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  },
  'day29_last_meal': {
    id: 'day29_last_meal',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂今晚比平时安静得多。每个人都在吃，但谁也没吃出味道。盘子和勺子碰撞的声音很轻，像是所有人都在怕惊动明天。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬过今晚，迎接第30天');
      ctx.game.addLog('有人把口粮掰成了两半，有人一口都没舍得动。你忽然不确定，留着它是为了明天，还是只是为了今晚能安心一点。', 'warning');
    },
    actions: [
      {
        id: 'd29_eat_now',
        label: '现在就把口粮吃下去',
        timeCost: 0.5,
        variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          ctx.game.flags.race_fed = true;
          ctx.game.useItem('ration');
          ctx.game.addLog('你把东西咽下去时，周围有两个人几乎同时抬头看了你一眼。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd29_save_food',
        label: '先留着不动',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.race_saved_food = true;
          ctx.game.addLog('你没有动那份口粮。它躺在掌心里时，比任何话都更能让人冷静下来。', 'info');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd29_sit_silent',
        label: '什么都不吃，只坐着',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 4;
          ctx.game.game.hunger = Math.max(0, ctx.game.game.hunger - 6);
          ctx.game.addLog('你只是坐着。食堂里的味道反而让胃里更空了。', 'danger');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day75Plots: Record<string, PlotScene> = {
  'day61_empty_tables': {
    id: 'day61_empty_tables',
    locationId: 'mess_hall',
    type: 'warning',
    text: '清洗后的第一顿饭，食堂空出了整排位置。没人去碰那些桌子，连平时最饿的人都绕开走，像怕把椅子拉响就会把昨天重新惊动一遍。',
    onEnter: (ctx) => {
      if (ctx.game.flags.sasha_saved) {
        ctx.game.addLog('Sasha 坐得比以前更靠里，吃东西时几乎不抬头，像怕被人再次记住。', 'warning');
      }
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 没来食堂。有人说他已经开始替活下来的人重新分轻重。', 'warning');
      }
    },
    actions: [
      {
        id: 'd61_count_absent',
        label: '把空位数完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_absences_counted = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没有急着坐下，先把空位一张张看过去。数字比广播里报的还难听。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd61_eat_fast',
        label: '吃完就走',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没在这地方多停。如今连多看一眼空位，都像在替谁补上一句迟到的告别。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day62_spoils_list': {
    id: 'day62_spoils_list',
    locationId: 'hall_main',
    type: 'warning',
    text: '第二天，大厅屏幕上挂出一张新的分配表。不是补给，也不是配给，而是“清理后可再利用物资”。有人在看床位，有人在看工具，还有人直接在看谁留下的口粮。',
    actions: [
      {
        id: 'd62_read_spoils',
        label: '把表看完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_spoils_read = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把那张表从头看到尾，越看越明白，清洗从来不只是少掉一些人，也是在腾出一些东西。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd62_turn_away',
        label: '别盯着别人留下的东西看',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你很快移开了视线。可那张表已经看见了你，这就够了。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day63_marcus_invitation': {
    id: 'day63_marcus_invitation',
    locationId: 'hall_main',
    type: 'story',
    text: 'Marcus 这次没让跟班传话，而是亲自走到你面前。他把警棍搭在肩上，像在谈一件再自然不过的事：“人少了，桌子也该重新排一排。”',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed || ctx.game.flags.joined_marcus) {
        ctx.game.addLog('他看你的眼神不像在拉拢，更像在确认一件早该兑现的事。', 'warning');
      }
    },
    actions: [
      {
        id: 'd63_hear_marcus_out',
        label: '先听他说完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_marcus_offer = true;
          ctx.npcs.interact('marcus', 6, 6);
          ctx.game.addLog('Marcus 没提忠诚，只提位置、份额和谁能活着坐到最后。越是这样，越像真正的威胁。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd63_leave_marcus',
        label: '别在这里接他的话',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有当场表态。Marcus 也没拦你，只是那种不着急的样子更让人不舒服。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day64_quiet_clinic': {
    id: 'day64_quiet_clinic',
    locationId: 'med_bay',
    type: 'story',
    text: '医疗站安静得不正常。少了哭喊，也少了争抢，剩下的只有笔尖、托盘和压得极低的呼吸声。安静到这一步，反而更像某种彻底认命后的后遗症。',
    onEnter: (ctx) => {
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 把一摞记录压在手肘下，像压着一叠不能外流的尸检。', 'warning');
      }
    },
    actions: [
      {
        id: 'd64_help_sort',
        label: '帮他把托盘归好',
        timeCost: 0.75,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.aris_saved === true,
        effect: (ctx) => {
          ctx.game.flags.arc5_aris_records = true;
          ctx.npcs.interact('aris', 8, 8);
          ctx.game.addLog('Aris 没说谢，只在你把最后一个空瓶放回去时低声说：“他们现在开始挑能留下的人，不是在挑该救的人。”', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd64_leave_clinic',
        label: '别让这里把你拖慢',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你很快离开了。这里的安静太像井底，站久了会让人忘记外面还在变。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  },
  'day65_terminal_archive': {
    id: 'day65_terminal_archive',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 把终端亮度调到最低，屏幕上多了一列新的归档目录。不是设施日志，而是“继承组候选行为样本”。他看到那几个字时，先骂了一句，才把位置让给你。',
    actions: [
      {
        id: 'd65_open_archive',
        label: '把目录看下去',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.arc5_archive_seen = true;
          ctx.game.player.stats.intelligence += 2;
          ctx.game.addLog('目录里有站队、执行、节律、服从和资源保全。你越往下看，越觉得他们是在替某个人准备一场加冕。', 'danger');
        },
        nextSceneId: 'explore_cell_02'
      },
      {
        id: 'd65_cut_power',
        label: '先把屏幕熄掉',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没让那份目录亮太久。可看过一眼的东西，通常灭得没有屏幕那么干净。', 'warning');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },
  'day66_ration_festival': {
    id: 'day66_ration_festival',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今天的配给比前几天突然多了一点。不是很多，但足够让人群里出现一种危险的轻松。有人笑了，有人甚至开始说“是不是终于熬过去了”。',
    onEnter: (ctx) => {
      ctx.game.addLog('你知道，这种时候突然多出来的东西，通常都不是好消息。', 'warning');
    },
    actions: [
      {
        id: 'd66_take_extra',
        label: '先把多出来的拿稳',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.game.hunger = Math.min(100, ctx.game.game.hunger + 10);
          ctx.game.addLog('你把多出来的那点东西先吃进了肚子里。暖意很短，可比空着要诚实。', 'info');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd66_watch_smiles',
        label: '看看是谁先笑出来',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_false_relief = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没急着动手，而是看谁最先松了那口气。往往这种时候，最先放松的人也最先会被收走。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day67_debtor_roll': {
    id: 'day67_debtor_roll',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅里新挂出了一张债务榜。不是积分，而是“占用资源未偿还者”。名字下面没有金额，只有一道更让人心里发紧的空栏，像在等谁亲自来填。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('你的视线扫过去时，忽然觉得这榜不是挂给所有人看的。', 'warning');
      }
    },
    actions: [
      {
        id: 'd67_read_debts',
        label: '站着把榜读完',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_debt_board = true;
          ctx.game.addLog('上面不只是欠配给的人，还有欠命、欠位子、欠一次不该有的放过的人。这里终于把这些都算进去了。', 'danger');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd67_do_not_stop',
        label: '走过去，别站住',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没停。可那张榜已经足够让你今天之后看谁都像在看债主。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day68_false_pardon': {
    id: 'day68_false_pardon',
    locationId: 'hall_main',
    type: 'story',
    text: '广播今天难得地用了温和语气，说部分表现稳定者将得到“长期留用评估”。大厅里甚至有人小声鼓掌。可那句子听上去越温和，越像绞索被包了层布。',
    actions: [
      {
        id: 'd68_mark_phrase',
        label: '记住这句话的说法',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_pardon_phrase = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把“长期留用”四个字在心里默念了一遍。那不是活路，更像一种被留下来继续用的资格。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd68_look_at_crowd',
        label: '看看是谁信了',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没有抬头看屏幕，只去看人群。相信这种话的人，表情总是很像同一种祈祷。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day69_inner_circle': {
    id: 'day69_inner_circle',
    locationId: 'hall_main',
    type: 'warning',
    text: 'Marcus 的人开始明显地分圈。站得近的人能先听到消息，站得远的人只能先看到结果。圈子不大，却像一块正在慢慢收紧的金属箍。',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc5_marcus_offer || ctx.game.flags.joined_marcus) {
        ctx.game.addLog('有人特意给你留了半步的位置。留得不多，却足够让旁边的人都看见。', 'warning');
      }
    },
    actions: [
      {
        id: 'd69_step_in',
        label: '先站进去试一试',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc5_inner_circle_seen = true;
          ctx.npcs.interact('marcus', 8, 6);
          ctx.game.addLog('你往前站了半步，立刻感到几道视线一起压过来。圈子里从来不缺位置，缺的是代价。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd69_stay_edge',
        label: '待在外圈看着',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_outer_ring = true;
          ctx.game.addLog('你没有往里站。站在边缘虽然难受，但至少还能看清谁在把别人往里推。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day70_scent_of_meat': {
    id: 'day70_scent_of_meat',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂后面今天飘出了一股真正的肉味。那味道不大，却足够让整层人的胃一起抽紧。没人知道来源，可每个人都在猜这是不是给某些人准备的。',
    onEnter: (ctx) => {
      ctx.game.addLog('你几乎忘了这种味道原来会让人想起的不是饱，而是贪。', 'warning');
    },
    actions: [
      {
        id: 'd70_follow_smell',
        label: '顺着味道走两步',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc5_feast_smell = true;
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('味道在通道拐角前就断掉了，像故意只放出来给人尝一口念想。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd70_hold_position',
        label: '别让胃替你走路',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你站着没动。可那股味道还是会自己往脑子里钻。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day71_broker_last_prices': {
    id: 'day71_broker_last_prices',
    locationId: 'warehouse_back',
    type: 'story',
    text: '掮客今天把价牌都翻了一面。不是涨价，而是不再写价格，只写“最后一批”“只换不卖”“有命再来”。他看见你时笑了一下，像早就知道这地方快没生意可做了。',
    actions: [
      {
        id: 'd71_ask_broker_why',
        label: '问他在怕什么',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_broker_warning = true;
          ctx.game.addLog('掮客把烟灰弹进空罐头里，只说了一句：“不是我怕，是有些桌子开始只给固定的人留座。”', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      {
        id: 'd71_buy_silence',
        label: '什么都别问，先换东西',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          if (ctx.game.game.money >= 15) {
            ctx.game.game.money -= 15;
            ctx.game.inventory.push({ id: 'ration', name: '合成口粮', description: '硬得像石头，但能续命。', icon: 'package', quantity: 1, category: 'consumable' });
            ctx.game.addLog('你没追问，只先把能拿到手的东西拿了。现在会先闭嘴的人，通常也更能活。', 'info');
          } else {
            ctx.game.addLog('你摸了摸空掉的口袋，最后还是什么都没换到。', 'warning');
          }
        },
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  },
  'day72_seating_rehearsal': {
    id: 'day72_seating_rehearsal',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅被搬进了一张长桌，但很快又被抬走了。没人解释，可所有人都看见了桌上大致留了几套餐具，哪边椅子高一点，哪边背后更靠近出口。',
    actions: [
      {
        id: 'd72_count_seats',
        label: '把座位数清楚',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_seat_count = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把位置数得很慢，最后只得到一个让人更不舒服的答案：那张桌子根本不是给大多数人准备的。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd72_watch_carriers',
        label: '看是谁在搬桌子',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.arc5_carriers_seen = true;
          ctx.game.addLog('你没看桌子，只看抬桌的人。真正重要的东西，通常总是先经过最沉默的手。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'day73_cutlery_count': {
    id: 'day73_cutlery_count',
    locationId: 'mess_hall',
    type: 'warning',
    text: '今晚食堂提前把勺叉都收走了一批。留下的人只能拿着手里的那份发愣，因为谁都知道，明天有些人会突然吃上更像样的东西。',
    actions: [
      {
        id: 'd73_hide_utensil',
        label: '顺手留下一把',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 13);
          if (check.success) {
            ctx.game.flags.arc5_hidden_utensil = true;
            ctx.game.addLog('你把那点金属悄悄别进袖口。它未必有用，但在这种时候，能藏住一件东西本身就像还没被掏空。', 'warning');
          } else {
            ctx.game.player.stats.hp -= 6;
            ctx.game.addLog('你动作慢了一拍，指节立刻挨了一下。对方没多说，只把那把叉从你手边抽走。', 'danger');
          }
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd73_let_them_take',
        label: '看着他们收走',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你什么都没做。可那些被收走的碰撞声还是让你想到明天会有一张怎样的桌子。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  },
  'day74_last_whispers': {
    id: 'day74_last_whispers',
    locationId: 'hall_main',
    type: 'warning',
    text: '到了第74天，连低语都变得有方向了。谁会被请去、谁只是陪站、谁明天可能根本看不到大厅，这些话开始在不同角落里长得越来越像。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬到明天，决定你是上桌、掀桌，还是活着离桌');
      if (ctx.game.flags.arc5_archive_seen) {
        ctx.game.addLog('你现在很难不把“继承组候选”那几个字和明天联系到一起。', 'warning');
      }
    },
    actions: [
      {
        id: 'd74_pick_side',
        label: '今晚先把立场想清楚',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc5_final_posture = true;
          ctx.game.addLog('你终于不再把明天当成一顿饭。想清楚这一点以后，很多选择忽然都硬了起来。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd74_keep_moving',
        label: '别停，别让人先抓到你',
        timeCost: 0.5,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 2;
          ctx.game.addLog('你整晚都没在一个地方站太久。这样很累，但至少还像自己在选。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'the_last_supper_start': {
    id: 'the_last_supper_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '大厅中央真的摆上了一张长桌。桌上是久违的新鲜食物，热气薄得像幻觉。Marcus 坐在首位，手里把玩着那根警棍，像在把玩一支已经写好结局的笔。“过来坐，”他说，“在一切结束前，我们得聊聊谁有资格继承这里。”',
    onEnter: (ctx) => {
      ctx.game.addLog('空气里弥漫着最后阶段才会有的那种平静。越平静，越像已经替血准备好了地方。', 'warning');
      if (ctx.game.flags.arc5_seat_count) {
        ctx.game.addLog('你记得那张桌子预留过多少把椅子。现在摆出来的，比昨天还少。', 'warning');
      }
      if (ctx.game.flags.arc5_marcus_offer || ctx.game.flags.joined_marcus) {
        ctx.game.addLog('Marcus 看你的眼神不像在招呼客人，更像在叫一道迟到了太久的答案。', 'warning');
      }
    },
    actions: [
      {
        id: 'confront_marcus',
        label: '当场掀掉这场戏',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.addLog('“看来你还是选了最难看的那条路。”Marcus 站了起来，笑声里已经没有半点招待的意思。', 'danger');
          ctx.game.enterCombat('Marcus T. (秩序领袖)', 150, 15);
        },
        nextSceneId: 'marcus_battle_loop'
      },
      {
        id: 'join_marcus',
        label: '坐到他右手边',
        timeCost: 1.0,
        variant: 'accent',
        condition: (ctx) => ctx.npcs.npcs['marcus'].favorability > 50,
        effect: (ctx) => {
          ctx.game.flags.joined_marcus = true;
          ctx.game.addLog('你坐了下去。椅子很稳，桌上的东西也真的能吃，可你很清楚这不是款待，只是盖章。', 'info');
          if (ctx.game.flags.sasha_saved) {
            ctx.game.addLog('Sasha 没出声，只是在角落里把头压得更低。', 'warning');
          }
          if (ctx.game.flags.aris_saved) {
            ctx.game.addLog('Aris 看了你一眼，像是在确认自己该不该继续把你算在“还能信的人”里面。', 'warning');
          }
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  },
  'marcus_battle_loop': {
    id: 'marcus_battle_loop',
    locationId: 'hall_main',
    type: 'warning',
    text: (ctx) => {
      if (!ctx.game.combat.active) {
        return '战斗结束了。长桌还在，热气却已经散干净了。';
      }
      return `战斗进行中：${ctx.game.combat.enemyName} 正死死盯着你。`;
    },
    actions: [
      {
        id: 'finish_battle',
        label: '战斗已结束',
        timeCost: 0.1,
        variant: 'default',
        condition: (ctx) => !ctx.game.combat.active,
        nextSceneId: 'marcus_battle_win'
      }
    ]
  },
  'marcus_battle_win': {
    id: 'marcus_battle_win',
    locationId: 'hall_main',
    type: 'story',
    text: 'Marcus 沉重的身体终于倒了下去。那根警棍从他手里滚落，撞在桌脚上，发出一声比喊叫更像结尾的轻响。“秩序……”他最后只剩下这一点气音，随后整个人一起熄了。',
    actions: [
      { id: 'continue', label: '让桌上的热气自己冷下去', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.flags.marcus_defeated = true;
      ctx.npcs.npcs['marcus'].state = 'Dead';
      ctx.game.game.money += 200;
      if (ctx.game.flags.arc5_hidden_utensil) {
        ctx.game.addLog('你忽然想起袖口里还藏着那点冷金属。和倒下的 Marcus 比起来，它轻得近乎荒唐。', 'warning');
      }
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 没有靠近尸体，只是先去看还活着的人。', 'info');
      }
      if (ctx.game.flags.satoshi_allied) {
        ctx.game.addLog('Satoshi 看着熄掉的大屏，像在等待某个比欢呼更重要的信号出现。', 'warning');
      }
    }
  }
};

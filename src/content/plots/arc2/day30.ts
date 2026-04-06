import type { PlotScene } from '../../../types/plot';

export const day30Plots: Record<string, PlotScene> = {
  'game_02_death_race': {
    id: 'game_02_death_race',
    locationId: 'hall_main',
    type: 'warning',
    text: '“欢迎来到第30天。今天的游戏：死亡赛跑。”广播响起时，大厅里没有人发出声音。“回廊已经清空，路线只会开放一次。最后三名到达的人将被回收。”几盏白灯同时亮起，把每一张脸都照得像病人。',
    onEnter: (ctx) => {
      if (ctx.game.flags.race_shortcut_known) {
        ctx.game.addLog('你摸了摸袖口，想起那张早就背下来的路线。', 'info');
      }
      if (ctx.game.flags.race_breath_rhythm) {
        ctx.game.addLog('你下意识地调匀了呼吸，脑子里浮起那晚黑暗里偷听来的步点。', 'info');
      }
      if (ctx.game.game.hunger <= 25) {
        ctx.game.addLog('胃里空得发紧。起跑前这一点点虚弱，被放大得格外明显。', 'danger');
      }
    },
    actions: [
      {
        id: 'race_sprint',
        label: '起跑就压上全力',
        timeCost: 2.0,
        variant: 'danger',
        effect: (ctx) => {
          const prep = (ctx.game.flags.race_fed ? 4 : 0)
            + (ctx.game.flags.arc2_aris_helped ? 2 : 0)
            + (ctx.game.flags.race_confidence ? 2 : 0)
            - (ctx.game.flags.arc2_fake_weak ? 2 : 0);
          const check = ctx.game.rollCheck(ctx.game.player.stats.strength + prep, 55);
          if (check.success) {
            ctx.game.flags.race_win = true;
            ctx.game.flags.race_style = 'sprint';
            ctx.game.addLog('起跑铃一响，你就把人群撕开了一道口子。前半程几乎没人能追上你。', 'info');
          } else {
            ctx.game.flags.race_win = false;
            ctx.game.flags.race_style = 'sprint';
            ctx.game.addLog('你前半段冲得太狠，后面几次呼吸都像在吞刀子。速度还是一点点掉了下来。', 'warning');
          }
        },
        nextSceneId: 'race_resolution'
      },
      {
        id: 'race_agile',
        label: '离开人群自己找路',
        timeCost: 2.0,
        variant: 'accent',
        effect: (ctx) => {
          const prep = (ctx.game.flags.race_shortcut_known ? 8 : 0)
            + (ctx.game.flags.race_breath_rhythm ? 3 : 0)
            + (ctx.game.flags.arc2_avoided_attention ? 2 : 0);
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity + prep, 60);
          if (check.success) {
            ctx.game.flags.race_win = true;
            ctx.game.flags.race_style = 'agile';
            ctx.game.addLog('你在第一个分岔就偏出了大部队，贴着墙翻过障碍，从一条狭窄侧道硬生生抄了过去。', 'info');
          } else {
            ctx.game.flags.race_win = false;
            ctx.game.flags.race_style = 'agile';
            ctx.game.addLog('你试图从旁边切出去，却在翻越时脚下一滑，整个人重重撞在金属边角上。', 'warning');
          }
        },
        nextSceneId: 'race_resolution'
      },
      {
        id: 'race_paced',
        label: '压着呼吸稳稳去跑',
        timeCost: 2.0,
        variant: 'default',
        effect: (ctx) => {
          const prep = (ctx.game.flags.race_breath_rhythm ? 6 : 0)
            + (ctx.game.flags.race_fed ? 3 : 0)
            + (ctx.game.flags.arc2_body_limit_known ? 2 : 0);
          const check = ctx.game.rollCheck(Math.max(ctx.game.player.stats.strength, ctx.game.player.stats.dexterity) + prep, 58);
          if (check.success) {
            ctx.game.flags.race_win = true;
            ctx.game.flags.race_style = 'paced';
            ctx.game.addLog('你没有抢第一，也没有被人带乱步子。一路上你只盯着呼吸和转角，硬是把自己留在安全线前。', 'info');
          } else {
            ctx.game.flags.race_win = false;
            ctx.game.flags.race_style = 'paced';
            ctx.game.addLog('你本来想跑得更稳，可最后一段还是被身后的人群顶乱了节奏。', 'warning');
          }
        },
        nextSceneId: 'race_resolution'
      }
    ]
  },
  'race_resolution': {
    id: 'race_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: (ctx) => {
      if (ctx.game.flags.race_win) {
        if (ctx.game.flags.race_style === 'agile') {
          return '你从侧道翻回主回廊时，终点线已经在眼前。等别人反应过来，你已经冲了过去。';
        }
        if (ctx.game.flags.race_style === 'paced') {
          return '终点线出现时，你几乎已经看不清四周，但脚下节奏还没乱。你不是最快的，但你足够早。';
        }
        return '你几乎是撞过终点线的。肺像要炸开，但你听见身后还有更乱的脚步声。你活下来了。';
      }
      return '你跌进最后那片混乱时，终点就在前面了。有人从身后撞上来，整条回廊像一锅沸开的水。';
    },
    actions: [
      { id: 'continue', label: '拖着气喘回去', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      if (ctx.game.flags.race_win) {
        ctx.game.player.stats.hp -= ctx.game.flags.race_fed ? 8 : 14;
        ctx.game.game.money += 30;
        if (ctx.game.flags.joined_marcus) {
          ctx.npcs.interact('marcus', 8, 10);
          ctx.game.flags.arc3_marcus_owed = true;
          ctx.game.addLog('Marcus 在人群外看了你一眼，点了点头。那动作很轻，却比夸奖更像是一种默认。', 'warning');
        } else if (ctx.game.flags.elena_allied) {
          ctx.npcs.interact('elena', 8, 12);
          ctx.game.flags.arc3_elena_invested = true;
          ctx.game.addLog('Elena 在记录板上划掉了你的编号，然后把笔帽重新按了回去。', 'info');
        } else if (ctx.game.flags.arc2_lone_mark) {
          ctx.game.flags.arc3_lone_survivor = true;
          ctx.game.addLog('你冲过终点后，四周没有任何声音替你落下。你活了下来，但那份安静更像在记账。', 'warning');
        }
      } else {
        if (ctx.npcs.npcs['sasha'].favorability > 40) {
          ctx.game.player.stats.hp -= 30;
          ctx.npcs.interact('sasha', 10, 10);
          ctx.game.flags.arc3_sasha_saved = true;
          ctx.game.addLog('是 Sasha P.。她在最后关头绊倒了外侧那个人，你才勉强从人堆里挤出一线。', 'info');
        } else if (ctx.game.flags.joined_marcus) {
          ctx.game.player.stats.hp -= 35;
          ctx.game.flags.arc3_marcus_paid_once = true;
          ctx.game.addLog('一个 Marcus 的跟班在最后关头撞开了你外侧的人。你听见他骂了一句，但那一下确实替你挪出了半步。', 'warning');
        } else {
          ctx.game.player.stats.hp -= 60;
          ctx.game.flags.arc3_lone_survivor = true;
          ctx.game.addLog('你挨到了垫底者的电击。疼痛一路窜进后槽牙，眼前一黑时，你只来得及确认自己还没死。', 'danger');
        }
        ctx.game.player.stats.sanity -= 8;
      }
    }
  }
};

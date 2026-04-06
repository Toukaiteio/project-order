import type { PlotScene } from '../../../types/plot';

export const day90Plots: Record<string, PlotScene> = {
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

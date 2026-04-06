import type { PlotScene } from '../../../types/plot';

export const day22Plots: Record<string, PlotScene> = {
  'day22_faction_claim': {
    id: 'day22_faction_claim',
    locationId: 'corridor_a',
    type: 'warning',
    text: (ctx) => {
      if (ctx.game.flags.joined_marcus) {
        return 'Marcus 的人把一小段走廊清了出来，让你从中间穿过去。没人说话，但那种刻意腾出的空间本身就像一种宣告。';
      }
      if (ctx.game.flags.elena_allied) {
        return 'Elena 靠在墙边，像是在等你。她把一页折过的纸塞进你手里，只说了一句："别让别人看见。"';
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
  }
};

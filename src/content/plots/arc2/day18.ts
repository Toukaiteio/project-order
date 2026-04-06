import type { PlotScene } from '../../../types/plot';

export const day18Plots: Record<string, PlotScene> = {
  'day18_bed_remarks': {
    id: 'day18_bed_remarks',
    locationId: 'cell_01',
    type: 'story',
    text: '傍晚回到牢房区时，几个人正把旧铺盖卷从门口拖出来。床架上被粉笔重新写了编号，有的被擦掉，有的被圈了起来。隔壁有人问为什么换床位，没人回答。',
    onEnter: (ctx) => {
      ctx.game.addLog('被擦掉的编号旁边还留着半截痕迹，像有人想把名字一起抹干净。', 'warning');
    },
    actions: [
      {
        id: 'd18_help_move',
        label: '搭把手把东西挪开',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.game.money += 10;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('搬东西的人随手塞给你一点积分。卷起的被褥比看上去重，像裹着还没散尽的体温。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd18_memorize_marks',
        label: '记住被圈起来的编号',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你把那些被圈起来的编号默背了一遍。它们并不靠近门，像是特地给谁留出来的。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      },
      {
        id: 'd18_close_door',
        label: '关上门，当作没看见',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('门合上以后，拖拽布料的声音反而更清楚。', 'warning');
        },
        nextSceneId: 'explore_cell_01'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day25Plots: Record<string, PlotScene> = {
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
          ctx.game.addLog('掮客收了钱，只说："跑的时候别跟着第一个转弯的人。"然后把图塞进了你袖口。', 'info');
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
          ctx.game.addLog('掮客把口粮拖到自己那边，笑得很轻。"你还真舍得。"然后他把路线说得比图纸更仔细。', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      },
      {
        id: 'd25_leave_empty',
        label: '什么都不换',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你转身离开时，掮客在背后说："不知道路的人，跑起来总是很像牲口。"', 'warning');
        },
        nextSceneId: 'explore_warehouse_back'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day40Plots: Record<string, PlotScene> = {
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
  }
};

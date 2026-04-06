import type { PlotScene } from '../../../types/plot';

export const day85Plots: Record<string, PlotScene> = {
  'day85_open_air_rumor': {
    id: 'day85_open_air_rumor',
    locationId: 'corridor_a',
    type: 'warning',
    text: '“上面有风。”这句话今天不知从哪传了起来。一开始像疯话，后来越来越像证词。有人说闻到了土味，有人说听见了鸟，更多的人只是把这句传下去。',
    actions: [
      {
        id: 'd85_hold_rumor',
        label: '把这句压在心里',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你没帮它传下去。到了这一步，太多人已经开始靠一句话活着。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd85_test_air',
        label: '认真闻一闻风向',
        timeCost: 0.5,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc6_air_rumor_tested = true;
          ctx.game.addLog('你在转角停了很久，最后真的闻到一丝和这里不一样的冷味。太淡了，却让人更睡不着。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

import type { PlotScene } from '../../../types/plot';

export const day70Plots: Record<string, PlotScene> = {
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
  }
};

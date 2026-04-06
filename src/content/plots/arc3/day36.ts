import type { PlotScene } from '../../../types/plot';

export const day36Plots: Record<string, PlotScene> = {
  'day36_supply_fire': {
    id: 'day36_supply_fire',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂后面配给通道突然冒起了黑烟。火不大，很快就被压了下去，但那股焦糊味整整一天都没散。有人说是线路短路，也有人说是有人故意烧掉了本来就不够的东西。',
    onEnter: (ctx) => {
      ctx.game.addLog('今天发下来的口粮比之前更硬、更碎，也更少。抱怨的人不多，因为每个人都忙着先把自己的那份攥紧。', 'danger');
    },
    actions: [
      {
        id: 'd36_join_bucket_line',
        label: '过去帮忙灭火',
        timeCost: 1.0,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.hp -= 4;
          ctx.game.game.money += 10;
          ctx.game.addLog('你提着水桶来回跑了好几趟，最后只换到一点额度和一身烟味。可至少有人记住你当时站在哪边。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd36_watch_smoke',
        label: '站远点看清是谁在跑',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_fire_faces = true;
          ctx.game.player.stats.intelligence += 1;
          ctx.game.addLog('你没去灭火，而是在记脸。烟里一闪而过的几个人，你之前都在某些名单旁见过。', 'info');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

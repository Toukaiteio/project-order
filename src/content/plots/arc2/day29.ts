import type { PlotScene } from '../../../types/plot';

export const day29Plots: Record<string, PlotScene> = {
  'day29_last_meal': {
    id: 'day29_last_meal',
    locationId: 'mess_hall',
    type: 'warning',
    text: '食堂今晚比平时安静得多。每个人都在吃，但谁也没吃出味道。盘子和勺子碰撞的声音很轻，像是所有人都在怕惊动明天。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬过今晚，迎接第30天');
      ctx.game.addLog('有人把口粮掰成了两半，有人一口都没舍得动。你忽然不确定，留着它是为了明天，还是只是为了今晚能安心一点。', 'warning');
    },
    actions: [
      {
        id: 'd29_eat_now',
        label: '现在就把口粮吃下去',
        timeCost: 0.5,
        variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          ctx.game.flags.race_fed = true;
          ctx.game.useItem('ration');
          ctx.game.addLog('你把东西咽下去时，周围有两个人几乎同时抬头看了你一眼。', 'warning');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd29_save_food',
        label: '先留着不动',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.flags.race_saved_food = true;
          ctx.game.addLog('你没有动那份口粮。它躺在掌心里时，比任何话都更能让人冷静下来。', 'info');
        },
        nextSceneId: 'explore_mess_hall'
      },
      {
        id: 'd29_sit_silent',
        label: '什么都不吃，只坐着',
        timeCost: 0.75,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 4;
          ctx.game.game.hunger = Math.max(0, ctx.game.game.hunger - 6);
          ctx.game.addLog('你只是坐着。食堂里的味道反而让胃里更空了。', 'danger');
        },
        nextSceneId: 'explore_mess_hall'
      }
    ]
  }
};

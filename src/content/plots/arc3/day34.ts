import type { PlotScene } from '../../../types/plot';

export const day34Plots: Record<string, PlotScene> = {
  'day34_missing_runner': {
    id: 'day34_missing_runner',
    locationId: 'corridor_a',
    type: 'warning',
    text: '赛跑那天还见过的几张脸，今天彻底不见了。不是死，也不是受伤，而是像被整块从人群里抠了出去。走廊墙上新刷了几块漆，颜色比周围更白，像在故意盖住什么。',
    onEnter: (ctx) => {
      if (ctx.game.flags.elena_allied || ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 从你身边经过时只停了一瞬：“不是消失，是转移。别被墙上的白漆骗了。”', 'warning');
      }
      if (ctx.game.flags.joined_marcus) {
        ctx.game.addLog('Marcus 那边的人今天异常安静。没人阻止你看墙，但那种默许本身就像警告。', 'warning');
      }
    },
    actions: [
      {
        id: 'd34_touch_paint',
        label: '伸手摸一把那层漆',
        timeCost: 0.5,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.arc3_names_scraped = true;
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('漆还没干透。你缩回手时，指尖上沾了一点白，像是把某个人最后留下的痕迹抹到了自己身上。', 'warning');
        },
        nextSceneId: 'explore_corridor_a'
      },
      {
        id: 'd34_ask_quietly',
        label: '压低声音问一句',
        timeCost: 0.75,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc3_people_disappear = true;
          ctx.game.addLog('那人没回答，只用下巴朝天花板的摄像头点了一下。你立刻明白 he 不是不懂，而是不敢。', 'info');
        },
        nextSceneId: 'explore_corridor_a'
      }
    ]
  }
};

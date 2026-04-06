import type { PlotScene } from '../../../types/plot';

export const day26Plots: Record<string, PlotScene> = {
  'day26_lockdown_night': {
    id: 'day26_lockdown_night',
    locationId: 'hall_main',
    type: 'warning',
    text: '夜里突然停电了。备用红灯亮起后，大厅像被浸在血里。广播要求所有人原地等待，但很快你就听见远处传来奔跑声和撞门声。有人在黑暗里趁机做事。',
    actions: [
      {
        id: 'd26_follow_sound',
        label: '顺着声音摸过去',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          const check = ctx.game.rollCheck(ctx.game.player.stats.dexterity, 13);
          if (check.success) {
            ctx.game.flags.race_breath_rhythm = true;
            ctx.game.addLog('你在黑暗里追上了一队偷偷练跑的人。他们贴墙换气，步子极轻。你没靠太近，但已经记住了那种节奏。', 'info');
          } else {
            ctx.game.player.stats.hp -= 8;
            ctx.game.addLog('你撞上了废弃推车，金属声在黑暗里响得刺耳。等守卫脚步靠近时，你只能先退回去。', 'warning');
          }
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd26_wait_dark',
        label: '在原地熬到来电',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你站着不动，听黑暗里不断有人从你身边经过。等灯亮起来时，仿佛谁都没离开过原位。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

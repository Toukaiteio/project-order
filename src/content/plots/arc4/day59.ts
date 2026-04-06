import type { PlotScene } from '../../../types/plot';

export const day59Plots: Record<string, PlotScene> = {
  'day59_purge_eve': {
    id: 'day59_purge_eve',
    locationId: 'hall_main',
    type: 'warning',
    text: '今晚的大厅比之前任何一次都安静。没有人吵，没有人抢位置，甚至连碗勺碰撞都轻得像怕惊动明天。可那种安静不是平静，而是所有人都在把最后一点力气往身体里收。',
    onEnter: (ctx) => {
      ctx.game.setObjective('熬过今晚，决定明天你打算先护住谁');
      if (ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 今晚只看了你一眼，像在提醒你明天不是第一次站边。', 'warning');
      }
      if (ctx.game.flags.elena_quest_complete) {
        ctx.game.addLog('Elena 把本子合上时，像已经替明天写完了开头。', 'warning');
      }
      if (ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 经过你身边时只说了一句：“明天别太晚。”他没有说晚了什么会来不及。', 'warning');
      }
    },
    actions: [
      {
        id: 'd59_find_one_person',
        label: '今晚先去见一个人',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.arc4_commitment_made = true;
          ctx.game.addLog('你没有让今晚就这么过去。明天真来了，很多话未必还说得出口。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      },
      {
        id: 'd59_hold_wall',
        label: '靠着墙把夜熬完',
        timeCost: 0.75,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.player.stats.sanity -= 3;
          ctx.game.addLog('你什么都没做，只把背抵在墙上。可夜越长，越像有人在隔着墙替你倒数。', 'warning');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

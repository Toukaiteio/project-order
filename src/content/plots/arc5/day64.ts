import type { PlotScene } from '../../../types/plot';

export const day64Plots: Record<string, PlotScene> = {
  'day64_quiet_clinic': {
    id: 'day64_quiet_clinic',
    locationId: 'med_bay',
    type: 'story',
    text: '医疗站安静得不正常。少了哭喊，也少了争抢，剩下的只有笔尖、托盘和压得极低的呼吸声。安静到这一步，反而更像某种彻底认命后的后遗症。',
    onEnter: (ctx) => {
      if (ctx.game.flags.aris_saved) {
        ctx.game.addLog('Aris 把一摞记录压在手肘下，像压着一叠不能外流的尸检。', 'warning');
      }
    },
    actions: [
      {
        id: 'd64_help_sort',
        label: '帮他把托盘归好',
        timeCost: 0.75,
        variant: 'accent',
        condition: (ctx) => ctx.game.flags.aris_saved === true,
        effect: (ctx) => {
          ctx.game.flags.arc5_aris_records = true;
          ctx.npcs.interact('aris', 8, 8);
          ctx.game.addLog('Aris 没说谢，只在你把最后一个空瓶放回去时低声说：“他们现在开始挑能留下的人，不是在挑该救的人。”', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      },
      {
        id: 'd64_leave_clinic',
        label: '别让这里把你拖慢',
        timeCost: 0.25,
        variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你很快离开了。这里的安静太像井底，站久了会让人忘记外面还在变。', 'warning');
        },
        nextSceneId: 'explore_med_bay'
      }
    ]
  }
};

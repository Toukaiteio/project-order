import type { PlotScene } from '../../types/plot';

export const day45Plots: Record<string, PlotScene> = {
  'energy_crisis_start': {
    id: 'energy_crisis_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '警报声响彻设施。灯光开始剧烈闪烁，最终维持在一种阴暗的橙红色。广播中传来了管理方急促的声音：“主反应堆核心受损，当前能源仅能维持部分扇区的生命支持系统。所有参与者请在 10 分钟内完成能源分配投票。”',
    onEnter: (ctx) => {
      ctx.game.addLog('这是你目前面临的最艰难的抉择。你的决定将直接抹除某些人的生存希望。', 'danger');
    },
    actions: [
      {
        id: 'allocate_med_bay',
        label: '优先医疗站 (Path Mercy)',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'mercy';
          ctx.game.game.energy = 50;
          ctx.npcs.interact('aris', 50, 40);
          ctx.game.addLog('你决定保住伤员。Aris 向你投来了充满感激的目光，但 Marcus 的支持者们在愤怒地咆哮。', 'info');
        },
        nextSceneId: 'energy_resolution'
      },
      {
        id: 'allocate_terminal',
        label: '优先终端室 (Path Knowledge)',
        timeCost: 1.0,
        variant: 'default',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'knowledge';
          ctx.game.game.energy = 40;
          ctx.game.player.stats.intelligence += 10;
          ctx.game.addLog('你选择了真相。Satoshi 成功锁定了设施的备用逃生口坐标，但代价是医疗站陷入了死一般的寂静。', 'warning');
        },
        nextSceneId: 'energy_resolution'
      },
      {
        id: 'allocate_order',
        label: '优先生活区 (Path Order)',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'order';
          ctx.game.game.energy = 80;
          ctx.npcs.interact('marcus', 40, 20);
          ctx.game.game.money += 100;
          ctx.game.addLog('你站在了强者一边。作为回报，Marcus 分给了你大量的信用额度，但你的理智因为愧疚而剧烈波动。', 'warning');
        },
        nextSceneId: 'energy_resolution'
      }
    ]
  },
  'energy_resolution': {
    id: 'energy_resolution',
    locationId: 'hall_main',
    type: 'story',
    text: '能源分配已锁定。设施的一部分重新亮起，而另一部分则永远沉入了黑暗。这场危机暂时缓解，但裂痕已无法弥补。',
    actions: [
      { id: 'continue', label: '在黑暗中继续前行', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.game.saveGame();
    }
  }
};

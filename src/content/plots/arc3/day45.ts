import type { PlotScene } from '../../../types/plot';

export const day45Plots: Record<string, PlotScene> = {
  'energy_crisis_start': {
    id: 'energy_crisis_start',
    locationId: 'hall_main',
    type: 'warning',
    text: '警报声响彻设施。灯光开始剧烈闪烁，最终维持在一种阴暗的橙红色。广播中传来了管理方急促的声音：“主反应堆核心受损，当前能源仅能维持部分扇区的生命支持系统。所有参与者请在 10 分钟内完成能源分配投票。”',
    onEnter: (ctx) => {
      if (ctx.game.flags.arc3_reactor_direction) {
        ctx.game.addLog('那股你前几天一直听见的低鸣，在这一刻终于有了名字。', 'warning');
      }
      ctx.game.addLog('这已经不是口粮多少、谁先排队那种选择了。你接下来按下去的东西，会直接决定哪一块地方先黑。', 'danger');
      if (ctx.game.flags.arc3_sasha_saved) {
        ctx.game.addLog('Sasha 缩在人群后面看着你，像是把自己那天冒的险也一起押到了现在。', 'warning');
      }
    },
    actions: [
      {
        id: 'allocate_med_bay',
        label: '让医疗站先亮',
        timeCost: 1.0,
        variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'mercy';
          ctx.game.game.energy = 50;
          ctx.npcs.interact('aris', 50, 40);
          if (ctx.game.flags.arc3_marcus_owed) ctx.npcs.interact('marcus', -18, -10);
          ctx.game.addLog('你决定先保住那些已经躺下的人。Aris 向你投来一个极短的眼神，而大厅另一边立刻爆出了压不住的骂声。', 'info');
        },
        nextSceneId: 'energy_resolution'
      },
      {
        id: 'allocate_terminal',
        label: '把电留给终端室',
        timeCost: 1.0,
        variant: 'default',
        condition: (ctx) => ctx.game.flags.satoshi_allied === true,
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'knowledge';
          ctx.game.game.energy = 40;
          ctx.game.player.stats.intelligence += 10;
          if (ctx.game.flags.elena_quest_complete) ctx.npcs.interact('elena', 12, 10);
          ctx.game.addLog('你把电力押给了终端。Satoshi 的手指几乎要在键盘上敲出火星，而医疗站那边的灯一盏接一盏灭了下去。', 'warning');
        },
        nextSceneId: 'energy_resolution'
      },
      {
        id: 'allocate_order',
        label: '先保住生活区',
        timeCost: 1.0,
        variant: 'danger',
        effect: (ctx) => {
          ctx.game.flags.energy_allocation = 'order';
          ctx.game.game.energy = 80;
          ctx.npcs.interact('marcus', 40, 20);
          ctx.game.game.money += 100;
          ctx.game.addLog('你站到了多数人能立刻看见好处的那边。Marcus 当场给你分了额度，可某些从黑暗里传来的哭声一下子变得格外清楚。', 'warning');
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
      if (ctx.game.flags.energy_allocation === 'mercy' && ctx.game.flags.arc3_aris_debt) {
        ctx.game.addLog('Aris 在混乱里朝你点了一下头。那不是谢意，更像是他终于决定把你算进“还能信的人”里。', 'info');
      }
      if (ctx.game.flags.energy_allocation === 'knowledge' && ctx.game.flags.satoshi_allied) {
        ctx.game.addLog('Satoshi 没有抬头，只是把终端往怀里抱紧了些。你知道他听懂了这份偏向。', 'warning');
      }
      if (ctx.game.flags.energy_allocation === 'order' && ctx.game.flags.arc3_marcus_owed) {
        ctx.game.addLog('Marcus 这次终于亲自走到你面前，像是把之前欠下的和今天的选择一起收下了。', 'warning');
      }
      ctx.game.saveGame();
    }
  }
};

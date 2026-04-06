import type { PlotScene } from '../../../types/plot';

export const day11Plots: Record<string, PlotScene> = {
  'game_01_dilemma': {
    id: 'game_01_dilemma',
    locationId: 'hall_main',
    type: 'warning',
    text: '广播中传来了刺耳的电流声：“各位参与者，第11天到了。第一个淘汰游戏：囚徒困境。你们面前有两个按钮，‘协作’或‘背叛’。”',
    actions: [
      { id: 'choice_profile_marcus', label: '先盯着 Marcus 看', timeCost: 1.0, variant: 'accent', condition: (ctx) => ctx.game.player.stats.intelligence >= 8, nextSceneId: 'game_01_result_profile' },
      { id: 'choice_cooperate', label: '选择：协作', timeCost: 1.0, variant: 'accent', nextSceneId: 'game_01_result_coop' },
      { id: 'choice_betray', label: '选择：背叛', timeCost: 1.0, variant: 'danger', nextSceneId: 'game_01_result_betray' },
    ],
    onEnter: (ctx) => {
      ctx.game.addLog('大厅的屏幕上显示出 Marcus T. 的名字，他似乎是你这一轮的对手。', 'warning');
      if (ctx.game.game.hunger <= 25) {
        ctx.game.addLog('胃部的空洞感在这一刻显得格外清晰。你讨厌这种状态，因为饥饿会让你在关键判断上慢半拍。', 'danger');
      }
    }
  },
  'game_01_result_profile': {
    id: 'game_01_result_profile',
    locationId: 'hall_main',
    type: 'story',
    text: '你没有立刻按下按钮，而是盯着 Marcus 的肩膀和眼神。他显然还不想在第一轮就暴露自己最恶劣的一面。你在最后一秒按下协作，屏幕显示他也做出了同样的选择。',
    actions: [
      { id: 'continue', label: '至少这次你看对了', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.npcs.interact('marcus', 15, 25);
      ctx.game.player.stats.intelligence += 1;
      ctx.game.addLog('Marcus 多看了你一眼。那不是感激，而是把你视为值得记住的人。', 'warning');
    }
  },
  'game_01_result_coop': {
    id: 'game_01_result_coop',
    locationId: 'hall_main',
    type: 'story',
    text: '你按下了协作。屏幕闪烁，显示 Marcus 也选择了协作。你们都活了下来，但组织对此表示遗憾。',
    actions: [
      { id: 'continue', label: '呼，暂时安全了', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.npcs.interact('marcus', 10, 20);
      ctx.game.addLog('Marcus 隔着屏幕看了你一眼，表情复杂。', 'info');
    }
  },
  'game_01_result_betray': {
    id: 'game_01_result_betray',
    locationId: 'hall_main',
    type: 'warning',
    text: '你按下了背叛。Marcus 选择了协作。你获得了额外的积分，但 Marcus 遭到了电击惩罚，倒在地上抽搐。',
    actions: [
      { id: 'continue', label: '活下去才是唯一的路', timeCost: 0.5, variant: 'default', nextSceneId: 'explore_hall_main' }
    ],
    onEnter: (ctx) => {
      ctx.npcs.interact('marcus', -50, -30);
      ctx.game.game.money += 50;
      ctx.game.player.stats.sanity -= 15;
      ctx.game.addLog('你的积分增加了，但良心的谴责让你的理智受损。', 'warning');
    }
  }
};

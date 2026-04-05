import type { PlotScene } from '../../types/plot';

export const sideQuests: Record<string, PlotScene> = {
  // --- Satoshi K. 支线: 修复终端 ---
  'quest_satoshi_start': {
    id: 'quest_satoshi_start',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 蜷缩在床角，手里摆弄着一块电路板。看到你进来，他显得很紧张，但随即眼神亮了一下：“你……你能帮我吗？我需要一个高频震荡子，我在废料处理区的粉碎机附近见过它。”',
    actions: [
      { 
        id: 'accept_satoshi', label: '答应帮他寻找', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => { ctx.game.flags.satoshi_quest_active = true; ctx.game.addLog('你接下了 Satoshi 的请求。', 'info'); },
        nextSceneId: 'explore_cell_02'
      },
      { id: 'refuse_satoshi', label: '没空管闲事', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_cell_02' }
    ]
  },
  'quest_satoshi_find_part': {
    id: 'quest_satoshi_find_part',
    locationId: 'garbage_chute',
    type: 'warning',
    text: '巨大的粉碎机正在缓慢转动。你看到在履带的边缘卡着一个闪烁着微弱蓝光的零件。',
    actions: [
      { 
        id: 'grab_part', label: '尝试抓取 (需要敏捷 >= 6)', timeCost: 1.0, variant: 'danger',
        condition: (ctx) => ctx.game.player.stats.dexterity >= 6,
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'electronic_part', name: '电子零件', description: '虽然沾满了油污，但依然在运作。', icon: 'zap', quantity: 1, category: 'tool' });
          ctx.game.flags.has_satoshi_part = true;
          ctx.game.addLog('你成功拿到了零件！', 'info');
        },
        nextSceneId: 'explore_garbage_chute'
      },
      { id: 'leave_part', label: '太危险了，放弃', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_garbage_chute' }
    ]
  },
  'quest_satoshi_complete': {
    id: 'quest_satoshi_complete',
    locationId: 'cell_02',
    type: 'story',
    text: 'Satoshi 颤抖着接过零件，熟练地将其焊在电路板上。一阵滋滋声后，他破旧的终端亮起了绿光。',
    actions: [
      {
        id: 'listen_to_terminal', label: '听听他发现了什么', timeCost: 1.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.player.stats.intelligence += 5;
          ctx.game.flags.satoshi_allied = true;
          ctx.game.addLog('通过终端，你听到了管理区的一些杂音……他们似乎在谈论某种“进化指标”。', 'story');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },

  // --- Dr. Aris 支线: 秘密配给 ---
  'quest_aris_plea': {
    id: 'quest_aris_plea',
    locationId: 'med_bay',
    type: 'story',
    text: 'Dr. Aris 将你拉到屏风后面。那里躺着一个神志不清的幸存者。“他快饿死了，组织切断了他的配给，”Aris 低声哀求，“你身上有口粮吗？只要一份，我就能稳住他的情况。”',
    actions: [
      {
        id: 'give_ration_to_aris', label: '交出一份口粮', timeCost: 0.5, variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'),
        effect: (ctx) => {
          const idx = ctx.game.inventory.findIndex((i: any) => i.id === 'ration');
          ctx.game.inventory.splice(idx, 1);
          ctx.npcs.interact('aris', 40, 30);
          ctx.game.inventory.push({ id: 'pure_painkiller', name: '高纯度止痛药', description: '强效精神稳定剂。', icon: 'pill', quantity: 1, category: 'consumable' });
          ctx.game.addLog('Aris 感激地看着你，偷偷塞给你一瓶特制的药剂。', 'info');
        },
        nextSceneId: 'explore_med_bay'
      },
      { id: 'ignore_aris', label: '我顾不上别人', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_med_bay' }
    ]
  }
};

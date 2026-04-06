import type { PlotScene } from '../../../types/plot';

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
        effect: (ctx) => { 
          ctx.game.flags.satoshi_quest_active = true; 
          ctx.game.addLog('你接下了 Satoshi 的请求。', 'info'); 
          ctx.game.setObjective('前往废料处理区寻找零件');
        },
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
          ctx.game.setObjective('将零件带回给 Satoshi');
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
          ctx.game.setObjective('在生存中寻找真相');
        },
        nextSceneId: 'explore_cell_02'
      }
    ]
  },

  // --- Sasha P. 支线: 丢失的吊坠 ---
  'quest_sasha_locket_start': {
    id: 'quest_sasha_locket_start',
    locationId: 'corridor_a',
    type: 'story',
    text: '你看到 Sasha 正蹲在墙角小声啜泣。几个高大的囚犯刚刚哄笑着离开。她抬起红肿的眼睛，“他们……他们把我的吊坠抢走扔进垃圾槽了。那是我唯一的家人照片……”',
    actions: [
      { 
        id: 'accept_sasha_locket', label: '帮她找回来', timeCost: 0.5, variant: 'accent',
        effect: (ctx) => {
          ctx.game.flags.sasha_locket_active = true;
          ctx.game.addLog('你决定帮这个可怜的女孩找回她的吊坠。', 'info');
          ctx.game.setObjective('在废料处理区寻找吊坠');
        },
        nextSceneId: 'explore_corridor_a'
      },
      { id: 'ignore_sasha_locket', label: '视而不见', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_corridor_a' }
    ]
  },
  'quest_sasha_locket_find': {
    id: 'quest_sasha_locket_find',
    locationId: 'garbage_chute',
    type: 'warning',
    text: '你在恶心的废料堆里翻找。终于，在一个破旧的滤网下，你看到了一抹金属光泽。',
    actions: [
      {
        id: 'pick_up_locket', label: '捡起吊坠', timeCost: 1.0, variant: 'accent',
        effect: (ctx) => {
          ctx.game.inventory.push({ id: 'sasha_locket', name: '银色吊坠', description: '里面有一张模糊的全家福。', icon: 'image', quantity: 1, category: 'misc' });
          ctx.game.flags.has_sasha_locket = true;
          ctx.game.addLog('你忍着恶臭捡起了吊坠。', 'info');
          ctx.game.setObjective('将吊坠还给 Sasha');
        },
        nextSceneId: 'explore_garbage_chute'
      }
    ]
  },

  // --- Sasha 项链返回场景 ---
  'quest_sasha_locket_return': {
    id: 'quest_sasha_locket_return',
    locationId: 'mess_hall',
    type: 'story',
    text: (ctx) => {
      const npc = ctx.npcs.npcs['sasha'];
      if (!npc || npc.state !== 'Alive') {
        return '你来到食堂想找 Sasha，但她不在了。角落的座位是空的，永远是空的。';
      }
      return '你在食堂的角落找到了 Sasha。她正在用那种机械化的动作拨弄她的口粮，眼神空洞而疲惫。';
    },
    actions: [
      {
        id: 'return_locket_to_sasha', label: '把吊坠递给她', timeCost: 0.5, variant: 'accent',
        condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'sasha_locket'),
        effect: (ctx) => {
          const idx = ctx.game.inventory.findIndex((i: any) => i.id === 'sasha_locket');
          ctx.game.inventory.splice(idx, 1);
          ctx.game.flags.sasha_locket_returned = true;
          ctx.npcs.interact('sasha', 20, 15);
          ctx.game.addLog('Sasha 的眼神瞬间恢复了焦点。她接过吊坠，手指颤抖着打开它。看到那张全家福的瞬间，她的眼泪决堤了。\n"谢谢你……"她只能重复这个词，像在重复呼吸。', 'story');
        },
        nextSceneId: 'explore_mess_hall'
      },
      { id: 'keep_locket', label: '放弃', timeCost: 0.1, variant: 'default', nextSceneId: 'explore_mess_hall' }
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

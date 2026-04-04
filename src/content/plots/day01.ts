import type { PlotScene } from '../../types/plot';

export const day01Plots: Record<string, PlotScene> = {
  'awake': {
    id: 'awake',
    locationId: 'cell_01',
    type: 'story',
    text: '你再次环顾这间狭小的牢房。墙壁上布满了暗红色的污渍，有些已经发黑剥落。通风口传来的冷风让你感到阵阵寒意。',
    actions: [
      { 
        id: 'search_bed', label: '搜寻床铺', timeCost: 0.5, variant: 'default', nextSceneId: 'found_note',
        condition: (ctx) => !ctx.game.flags.found_crumpled_note
      },
      { id: 'examine_wall', label: '检查墙壁', timeCost: 0.5, variant: 'default', nextSceneId: 'wall_scratches' },
      { id: 'move_corridor_a', label: '走出牢房', timeCost: 0.25, variant: 'accent' },
    ]
  },
  'found_note': {
    id: 'found_note',
    locationId: 'cell_01',
    type: 'info',
    text: '你在破烂的枕头下面发现了一张揉皱的纸条。上面歪歪扭扭地写着一行小字：“不要相信穿着白色制服的人，他们不是来救你的。”',
    actions: [
      { 
        id: 'keep_note', label: '收起纸条', timeCost: 0.25, variant: 'default', nextSceneId: 'awake',
        effect: (ctx) => {
          ctx.game.flags.found_crumpled_note = true;
          ctx.game.inventory.push({
            id: 'crumpled_note', name: '揉皱的纸条', description: '上面写着：不要相信穿着白色制服的人。', icon: 'document', quantity: 1, category: 'document'
          });
          ctx.game.addLog('你将纸条塞进兜里。', 'info');
        }
      },
      { 
        id: 'tear_note', label: '撕碎纸条', timeCost: 0.25, variant: 'danger', nextSceneId: 'awake',
        effect: (ctx) => {
          ctx.dialog.confirm({
            title: '确认', content: '你确定要撕碎这张唯一的线索吗？', variant: 'danger',
            onConfirm: () => { ctx.game.flags.found_crumpled_note = true; ctx.game.addLog('你愤怒地将纸条撕成了碎片。', 'warning'); }
          });
        }
      },
    ]
  },
  'wall_scratches': {
    id: 'wall_scratches',
    locationId: 'cell_01',
    type: 'story',
    text: '这些抓痕非常深，似乎是某人用指甲硬生生抠出来的。你隐约辨认出一个名字：“林...夕...”。这个名字让你感到莫名的心悸。',
    actions: [
      { id: 'ponder_name', label: '冥想这个名字', timeCost: 1.0, variant: 'accent', nextSceneId: 'awake' },
      { id: 'move_corridor_a', label: '离开这里', timeCost: 0.25, variant: 'default' },
    ]
  }
};

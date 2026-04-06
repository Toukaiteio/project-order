import type { PlotScene } from '../../../types/plot';

export const day01Plots: Record<string, PlotScene> = {
  'awake': {
    id: 'awake',
    locationId: 'cell_01',
    type: 'story',
    text: '你的意识在冰冷的震颤中苏醒。后脑勺传来的钝痛像是有根钉子钉在那里。你躺在坚硬的金属板床上，四周只有排气扇单调的嗡鸣。嘴里残留着铁锈般的血腥味，你甚至不记得自己是谁，为什么会在这儿。',
    onEnter: (ctx) => {
      ctx.game.setObjective('弄清楚当前的处境');
    },
    actions: [
      { 
        id: 'monologue_01', label: '闭上眼整理思绪', timeCost: 0.5, variant: 'accent',
        nextSceneId: 'monologue_intro'
      },
      { 
        id: 'search_bed', label: '摸索床铺周围', timeCost: 0.5, variant: 'default', nextSceneId: 'found_note',
        condition: (ctx) => !ctx.game.flags.found_crumpled_note
      },
      { id: 'examine_wall', label: '检查墙上的痕迹', timeCost: 0.5, variant: 'default', nextSceneId: 'wall_scratches' },
      { id: 'move_corridor_a', label: '尝试推开沉重的铁门', timeCost: 0.25, variant: 'accent', nextSceneId: 'explore_corridor_a' },
    ]
  },
  'monologue_intro': {
    id: 'monologue_intro',
    locationId: 'cell_01',
    type: 'story',
    text: '你在黑暗中深呼吸。混乱的碎片开始闪现：穿着白大褂的人影、刺耳的警报、还有那种被当作某种“资源”的恐惧感。你意识到，留在这里只有死路一条。你需要食物，需要积分，更需要搞清楚这个名为“秩序之眼”的实验到底在选拔什么。',
    onEnter: (ctx) => {
      ctx.game.player.stats.sanity = Math.min(ctx.game.player.stats.maxSanity, ctx.game.player.stats.sanity + 5);
      ctx.game.setObjective('寻找幸存者或食物');
    },
    actions: [
      { id: 'back_to_awake', label: '回到现实', timeCost: 0.1, variant: 'default', nextSceneId: 'awake' }
    ]
  },
  'found_note': {
    id: 'found_note',
    locationId: 'cell_01',
    type: 'info',
    text: '你在破烂的枕头下面发现了一张揉皱的纸条。上面歪歪扭扭地写着一行小字：“不要相信穿着白色制服的人，他们不是来救你的。”这句话让你不寒而栗。',
    actions: [
      { 
        id: 'keep_note', label: '将警告记在心里', timeCost: 0.25, variant: 'default', nextSceneId: 'awake',
        effect: (ctx) => {
          ctx.game.flags.found_crumpled_note = true;
          ctx.game.inventory.push({
            id: 'crumpled_note', name: '揉皱的纸条', description: '警告：不要相信穿白制服的人。', icon: 'document', quantity: 1, category: 'document'
          });
          ctx.game.addLog('你把纸条藏进了袖口。', 'info');
        }
      }
    ]
  },
  'wall_scratches': {
    id: 'wall_scratches',
    locationId: 'cell_01',
    type: 'story',
    text: '墙上的抓痕在昏暗的光线下显得狰狞。你顺着痕迹摸索，指尖触到了一个名字：“林...夕...”。在触碰到这个名字的瞬间，你感到一阵没由来的哀伤，仿佛这个名字曾对你至关重要。',
    actions: [
      { 
        id: 'ponder_name', label: '试图回忆这个名字', timeCost: 1.0, variant: 'accent', nextSceneId: 'awake',
        effect: (ctx) => {
          ctx.game.addLog('除了更剧烈的头痛，你什么也没想起来。但你确定，你必须找到她。', 'warning');
          ctx.game.player.stats.intelligence += 1;
        }
      },
      { id: 'move_corridor_a', label: '不再多想，离开房间', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_corridor_a' },
    ]
  }
};

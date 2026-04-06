import type { PlotScene } from '../../../types/plot';

export const day05Plots: Record<string, PlotScene> = {
  'rainy_night_theft': {
    id: 'rainy_night_theft',
    locationId: 'cell_01',
    type: 'warning',
    text: '外面正下着倾盆大雨，雨水拍打着设施外壳，发出沉闷的响声。你正准备入睡，突然听到门口有轻微的响动。',
    actions: [
      { id: 'check_door', label: '起身查看', timeCost: 0.25, variant: 'accent', nextSceneId: 'thief_shadow' },
      { id: 'pretend_sleep', label: '继续装睡', timeCost: 0.5, variant: 'default', nextSceneId: 'stuff_missing' },
    ]
  },
  'thief_shadow': {
    id: 'thief_shadow',
    locationId: 'cell_01',
    type: 'story',
    text: '你猛地坐起，看到一个瘦小的黑影正从你的储物格里缩回手。是 Sasha P.！她显然没料到你会醒来，整个人僵在了原地。',
    actions: [
      { id: 'confront_sasha', label: '抓住她的手', timeCost: 0.25, variant: 'danger', effect: (ctx) => { ctx.npcs.interact('sasha', -15, -10); ctx.game.addLog('你粗暴地抓住了她，她发出一声惊叫，扔下东西逃跑了。', 'warning'); }, nextSceneId: 'explore_cell_01' },
      { id: 'talk_to_sasha', label: '低声询问她需要什么', timeCost: 0.5, variant: 'accent', effect: (ctx) => { ctx.npcs.interact('sasha', 10, 5); ctx.game.addLog('你平和的态度让她稍微放松了一些。', 'info'); }, nextSceneId: 'sasha_plea' },
    ]
  },
  'sasha_plea': {
    id: 'sasha_plea',
    locationId: 'cell_01',
    type: 'story',
    text: '“我只是……太饿了，”她颤抖着低声说，“他们已经两天没给我发配给了。我以为你会有多余的……”',
    actions: [
      { id: 'give_ration', label: '给她一份口粮', timeCost: 0.25, variant: 'accent', condition: (ctx) => ctx.game.inventory.some((i: any) => i.id === 'ration'), effect: (ctx) => { const idx = ctx.game.inventory.findIndex((i: any) => i.id === 'ration'); ctx.game.inventory.splice(idx, 1); ctx.npcs.interact('sasha', 30, 20); ctx.game.addLog('你分给了她一份珍贵的口粮。她感激涕零，飞快地消失在了夜色中。', 'info'); }, nextSceneId: 'explore_cell_01' },
      { id: 'refuse_sasha', label: '让她离开', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_cell_01' }
    ]
  },
  'stuff_missing': {
    id: 'stuff_missing',
    locationId: 'cell_01',
    type: 'warning',
    text: '第二天醒来，你发现你的储物格被翻动过。虽然没有丢什么大件，但你感觉有些不安。',
    actions: [
      { id: 'continue', label: '该死，必须更警觉一些', timeCost: 0.25, variant: 'default', nextSceneId: 'explore_cell_01' }
    ]
  }
};

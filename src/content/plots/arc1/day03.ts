import type { PlotScene } from '../../../types/plot';

export const day03Plots: Record<string, PlotScene> = {
  'blood_dusk_riot': {
    id: 'blood_dusk_riot',
    locationId: 'hall_main',
    type: 'warning',
    text: '第3天，血色黄昏。大厅里爆发了一场小规模的冲突。几名饥饿的囚犯试图冲击配给站，现场陷入了一片混乱。警卫们正举起电击棍准备镇压。',
    onEnter: (ctx) => {
      ctx.game.setObjective('观察设施的权力结构');
    },
    actions: [
      { 
        id: 'observe_marcus_riot', label: '观察 Marcus T. (力量感)', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你看到 Marcus 站在高处，冷冷地看着混乱。他只是挥了挥手，他的手下就迅速平息了最前排的骚乱。他展现出了绝对的武力统治。', 'info');
          ctx.game.player.stats.intelligence += 1;
        },
        nextSceneId: 'explore_hall_main'
      },
      { 
        id: 'observe_elena_riot', label: '观察 Elena V. (冷静感)', timeCost: 0.5, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('Elena 坐在角落里，手里快速记着什么。她似乎在通过这场暴乱收集关于警卫反应时间的模型。那种理性的冷酷让你感到不寒而栗。', 'info');
          ctx.game.player.stats.intelligence += 2;
        },
        nextSceneId: 'explore_hall_main'
      },
      { 
        id: 'stay_safe_riot', label: '保持距离', timeCost: 0.25, variant: 'default',
        effect: (ctx) => {
          ctx.game.addLog('你躲在柱子后面，直到骚乱平息。虽然没学到什么，但你毫发无损。', 'info');
        },
        nextSceneId: 'explore_hall_main'
      }
    ]
  }
};

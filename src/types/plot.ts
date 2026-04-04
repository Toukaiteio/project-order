import type { ActionChoice } from '../stores/game';

export interface PlotEffectContext {
  game: any;
  dialog: any;
  npcs: any;     // 新增 NPC 存储
  schedule: any; // 新增 日程存储
}

export interface PlotAction extends ActionChoice {
  condition?: (context: PlotEffectContext) => boolean;
  effect?: (context: PlotEffectContext) => void;
  nextSceneId?: string;
  // 留白：允许在行动后插入一段随机的 NPC 独白或环境描写
  postNarrative?: string | ((context: PlotEffectContext) => string); 
}

export interface PlotScene {
  id: string;
  locationId: string;
  type: 'story' | 'info' | 'warning';
  text: string | ((context: PlotEffectContext) => string);
  actions: PlotAction[];
  onEnter?: (context: PlotEffectContext) => void;
}

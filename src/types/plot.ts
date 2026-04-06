import type { ActionChoice } from '../stores/game';

export interface PlotEffectContext {
  game: any;
  dialog: any;
  npcs: any;     // 新增 NPC 存储
  schedule: any; // 新增 日程存储
}

export interface PlotAction extends Omit<ActionChoice, 'label'> {
  label: string | ((context: PlotEffectContext) => string);
  condition?: (context: PlotEffectContext) => boolean;
  isFallback?: boolean; // 新增：是否作为兜底出口（即使带 condition 也会被验证器视为安全出口）
  effect?: (context: PlotEffectContext) => void;
  nextSceneId?: string | ((context: PlotEffectContext) => string);
  defaultNextSceneId?: string; // 新增：用于静态验证函数式 nextSceneId 的默认回退 ID
  // 留白：允许在行动后插入一段随机的 NPC 独白或环境描写
  postNarrative?: string | ((context: PlotEffectContext) => string);
}

export interface PlotScene {
  id: string;
  locationId: string;
  type: 'story' | 'info' | 'warning';
  text: string | ((context: PlotEffectContext) => string);
  actions: PlotAction[] | ((context: PlotEffectContext) => PlotAction[]);
  allowFieldRest?: boolean; // 新增：是否允许在此场景原地休息
  repeatable?: boolean;     // 新增：是否允许重复触发（默认为 false）
  onEnter?: (context: PlotEffectContext) => void;
}

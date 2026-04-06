import { usePlot } from './usePlot';
import type { PlotScene } from '../types/plot';

export interface ValidationError {
  type: 'missing_scene' | 'dead_path' | 'orphan_action' | 'dynamic_transition' | 'conditional_dead_end';
  sceneId: string;
  actionId?: string;
  details: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  totalScenes: number;
  checkedScenes: number;
  duration: number;
}

const TERMINAL_SCENES = new Set([
  'combat_victory',
  'combat_defeat',
  'game_over',
  'finale_resolution',
  'end_elena',
  'end_marcus',
  'end_marcus_slayer',
  'end_order',
  'end_lone_wolf',
  'end_sanctuary',
]);

const SPECIAL_SCENES = new Set([
  'npc_menu_general',
  'rest_menu',
  'shop_broker',
  'ask_about_facility',
]);

// 已知合法的无 nextSceneId action（由宿主系统接管流程，如战斗）
const KNOWN_NO_EXIT_ACTIONS = new Set([
  'npc_attack',
]);

export function useSceneValidator() {
  const { getAllSceneIds, getSceneDetails } = usePlot();

  const validateAll = (): ValidationResult => {
    const startTime = performance.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    const allSceneIds = getAllSceneIds();
    const sceneIdSet = new Set(allSceneIds);
    const checkedScenes = new Set<string>();

    for (const sceneId of allSceneIds) {
      const scene = getSceneDetails(sceneId) as PlotScene | undefined;
      if (!scene) continue;

      checkedScenes.add(sceneId);

      const actions = scene.actions ?? [];

      // ── 检查1：nextSceneId 指向不存在的 scene ──────────────────────────
      for (const action of actions) {
        if (!action.nextSceneId) continue;

        if (typeof action.nextSceneId === 'function') {
          warnings.push({
            type: 'dynamic_transition',
            sceneId,
            actionId: action.id,
            details: `[动态出口] "${sceneId}" → action "${action.id}" 使用函数式 nextSceneId，无法静态验证目标是否存在。`,
          });
          continue;
        }

        if (!sceneIdSet.has(action.nextSceneId)) {
          errors.push({
            type: 'missing_scene',
            sceneId,
            actionId: action.id,
            details: `[断链] "${sceneId}" → action "${action.id}" 指向不存在的 scene "${action.nextSceneId}"`,
          });
        }
      }

      // ── 检查2：action 缺少 nextSceneId 且不在白名单中 ─────────────────
      if (!TERMINAL_SCENES.has(sceneId) && !SPECIAL_SCENES.has(sceneId)) {
        for (const action of actions) {
          if (!action.nextSceneId && !KNOWN_NO_EXIT_ACTIONS.has(action.id)) {
            errors.push({
              type: 'orphan_action',
              sceneId,
              actionId: action.id,
              details: `[孤立行动] "${sceneId}" → action "${action.id}" 缺失 nextSceneId，玩家点击后将卡死（流程中断）`,
            });
          }
        }
      }
    }

    // ── 检查3：场景级别死路检测 ────────────────────────────────────────────
    for (const sceneId of allSceneIds) {
      const scene = getSceneDetails(sceneId) as PlotScene | undefined;
      if (!scene) continue;

      if (TERMINAL_SCENES.has(sceneId) || SPECIAL_SCENES.has(sceneId)) continue;

      const actions = scene.actions ?? [];

      // 3a：完全没有出口
      const hasAnyExit = actions.some(a => !!a.nextSceneId);
      if (!hasAnyExit) {
        warnings.push({
          type: 'dead_path',
          sceneId,
          details: `[无出口] "${sceneId}" 没有任何带 nextSceneId 的 action，场景为终死节点。`,
        });
        continue;
      }

      // 3b：所有有出口的 actions 都有 condition（潜在条件死路）
      const exitActions = actions.filter(a => !!a.nextSceneId && !KNOWN_NO_EXIT_ACTIONS.has(a.id));
      const unconditionalExits = exitActions.filter(a => !a.condition || a.isFallback);

      if (exitActions.length > 0 && unconditionalExits.length === 0) {
        // 所有出口都有条件限制，存在玩家被锁死的风险
        const conditionedIds = exitActions.map(a => `"${a.id}"`).join(', ');
        errors.push({
          type: 'conditional_dead_end',
          sceneId,
          details: `[条件死路] "${sceneId}" 的所有出口 action 均附带 condition（${conditionedIds}），若条件均不满足将导致玩家在运行时卡死。请确保至少有一个无条件兜底出口。`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalScenes: allSceneIds.length,
      checkedScenes: checkedScenes.size,
      duration: Math.round(performance.now() - startTime),
    };
  };

  return {
    validateAll,
  };
}

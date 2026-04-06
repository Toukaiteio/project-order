import { usePlot } from './usePlot';
import type { PlotScene } from '../types/plot';

export interface ValidationError {
  type: 'missing_scene' | 'dead_path' | 'orphan_action';
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

export function useScriptValidator() {
  const { checkSceneExists, getAllSceneIds, getSceneDetails } = usePlot();

  const validateAll = (): ValidationResult => {
    const startTime = performance.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // 获取所有定义的 scene id
    const allSceneIds = getAllSceneIds();
    const checkedScenes = new Set<string>();

    // 步骤1：检查每个 scene 中的所有 nextSceneId 是否存在
    for (const sceneId of allSceneIds) {
      const scene = getSceneDetails(sceneId) as PlotScene | undefined;
      if (!scene) continue;

      checkedScenes.add(sceneId);

      // 检查 scene 本身的逻辑出口
      if (scene.actions && scene.actions.length > 0) {
        for (const action of scene.actions) {
          if (action.nextSceneId) {
            const nextSceneId = typeof action.nextSceneId === 'function'
              ? null  // 函数式的 nextSceneId，无法静态检查
              : action.nextSceneId;

            if (nextSceneId && !checkSceneExists(nextSceneId)) {
              errors.push({
                type: 'missing_scene',
                sceneId,
                actionId: action.id,
                details: `Action "${action.id}" 指向不存在的 scene "${nextSceneId}"`,
              });
            }
          }
        }
      }
    }

    // 步骤2：检查场景是否有死路（没有任何出口）
    for (const sceneId of allSceneIds) {
      const scene = getSceneDetails(sceneId) as PlotScene | undefined;
      if (!scene) continue;

      // 跳过已知的终局 scene 或特殊 scene
      if (TERMINAL_SCENES.has(sceneId) || SPECIAL_SCENES.has(sceneId)) {
        continue;
      }

      // 检查是否有有效的出口
      let hasValidExit = false;

      if (scene.actions && scene.actions.length > 0) {
        for (const action of scene.actions) {
          // 如果有 nextSceneId（无论是字符串还是函数），就认为有出口
          if (action.nextSceneId) {
            hasValidExit = true;
            break;
          }
        }
      }

      if (!hasValidExit) {
        warnings.push({
          type: 'dead_path',
          sceneId,
          details: `Scene "${sceneId}" 没有任何有效的出口 action`,
        });
      }
    }

    const duration = performance.now() - startTime;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalScenes: allSceneIds.length,
      checkedScenes: checkedScenes.size,
      duration: Math.round(duration),
    };
  };

  return {
    validateAll,
  };
}

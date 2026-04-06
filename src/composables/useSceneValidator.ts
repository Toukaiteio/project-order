import { usePlot } from './usePlot';
import type { PlotScene } from '../types/plot';

export interface ValidationError {
  type: 'missing_scene' | 'dead_path' | 'orphan_action' | 'dynamic_transition';
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

      for (const action of scene.actions ?? []) {
        if (!action.nextSceneId) continue;

        if (typeof action.nextSceneId === 'function') {
          warnings.push({
            type: 'dynamic_transition',
            sceneId,
            actionId: action.id,
            details: `Action "${action.id}" uses a dynamic nextSceneId and cannot be fully validated statically.`,
          });
          continue;
        }

        if (!sceneIdSet.has(action.nextSceneId)) {
          errors.push({
            type: 'missing_scene',
            sceneId,
            actionId: action.id,
            details: `Action "${action.id}" points to missing scene "${action.nextSceneId}".`,
          });
        }
      }
    }

    for (const sceneId of allSceneIds) {
      const scene = getSceneDetails(sceneId) as PlotScene | undefined;
      if (!scene) continue;

      if (TERMINAL_SCENES.has(sceneId) || SPECIAL_SCENES.has(sceneId)) {
        continue;
      }

      const hasValidExit = (scene.actions ?? []).some(action => !!action.nextSceneId);
      if (!hasValidExit) {
        warnings.push({
          type: 'dead_path',
          sceneId,
          details: `Scene "${sceneId}" has no outgoing action.`,
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

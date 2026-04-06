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

      let actions: any[] = [];
      if (typeof scene.actions === 'function') {
        // 对于函数式 actions，静态验证暂时跳过深层检查，或使用占位数组
        actions = []; 
      } else {
        actions = scene.actions ?? [];
      }

      // ── 检查1：nextSceneId 指向不存在的 scene ──────────────────────────
      for (const action of actions) {
        if (!action.nextSceneId) continue;

        if (typeof action.nextSceneId === 'function') {
          // 如果提供了默认 ID，则验证默认 ID 而不是报警
          if (action.defaultNextSceneId) {
            if (!sceneIdSet.has(action.defaultNextSceneId)) {
              errors.push({
                type: 'missing_scene',
                sceneId,
                actionId: action.id,
                details: `[断链] "${sceneId}" → action "${action.id}" 的默认出口 "${action.defaultNextSceneId}" 不存在。`,
              });
            }
            continue; // 验证通过，跳过警告
          }

          warnings.push({
            type: 'dynamic_transition',
            sceneId,
            actionId: action.id,
            details: `[动态出口] "${sceneId}" → action "${action.id}" 使用函数式 nextSceneId 且缺失 defaultNextSceneId，无法静态验证。`,
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

      const actionsRaw = scene.actions;
      if (typeof actionsRaw === 'function') {
        // 函数式 actions 默认视为有出口，且跳过死路验证（因为它是动态的）
        continue;
      }
      const actions = actionsRaw ?? [];

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

    // ── 检查4：循环引用与重复进入风险 (Cycle Detection) ──────────────
    // 建立邻接表以便进行路径追踪
    const adjList = new Map<string, Set<string>>();
    for (const id of sceneIdSet) {
      const scene = getSceneDetails(id) as PlotScene | undefined;
      if (!scene) continue;
      
      const targets = new Set<string>();
      // 这里的 actions 解析逻辑需要处理函数式或数组
      const rawActions = typeof scene.actions === 'function' ? [] : (scene.actions ?? []);
      for (const act of rawActions) {
        if (typeof act.nextSceneId === 'string') targets.add(act.nextSceneId);
        if (act.defaultNextSceneId) targets.add(act.defaultNextSceneId);
      }
      if (targets.size > 0) adjList.set(id, targets);
    }

    // 使用简单的 DFS 检测每个场景是否参与了某种形式的回路
    const hasBackReference = (startId: string) => {
      const visited = new Set<string>();
      const stack = [startId];
      while (stack.length > 0) {
        const curr = stack.pop()!;
        const neighbors = adjList.get(curr);
        if (!neighbors) continue;
        for (const next of neighbors) {
          if (next === startId) return true; // 发现回路：A -> ... -> A
          if (!visited.has(next)) {
            visited.add(next);
            stack.push(next);
          }
        }
      }
      return false;
    };

    for (const id of sceneIdSet) {
      const scene = getSceneDetails(id) as PlotScene | undefined;
      if (!scene || scene.repeatable) continue;

      // 规则 A: 地点探索 hub 场景强烈建议可重复
      if (id.startsWith('explore_')) {
        warnings.push({
          type: 'logic_error',
          sceneId: id,
          details: `[高风险] 地点探索场景 "${id}" 未标记为 repeatable。玩家第二次通过正常路径返回该地点时，行动列表将消失。`
        });
        continue;
      }

      // 规则 B: 如果检测到该非重复场景参与了跳转回路，发出警告
      if (hasBackReference(id)) {
        warnings.push({
          type: 'logic_error',
          sceneId: id,
          details: `[循环风险] 场景 "${id}" 参与了跳转回路（例如 A->B->A），但未标记为 repeatable。这会导致第二次进入时产生逻辑死路。`
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

import { defineStore } from 'pinia';
import { useScheduleStore } from './schedule';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  sanity: number;
  maxSanity: number;
  strength: number;
  intelligence: number;
  dexterity: number;
}

export interface PlayerState {
  name: string;
  gender: string;
  traits: string[];
  stats: PlayerStats;
  equippedWeapon: string | null;
}

export interface CombatState {
  active: boolean;
  enemyName: string;
  enemyHp: number;
  enemyMaxHp: number;
  enemyAtk: number;
  log: string[];
}

export interface GameState {
  started: boolean;
  day: number;
  time: number;
  isRestDay: boolean;
  weather: 'sunny' | 'rainy' | 'foggy' | 'blood_mist';
  location: string;
  money: number;
  energy: number;
  hunger: number;
  nextDeadlineDay: number | null;
  objective: string;
}

export interface MapNode {
  id: string;
  col: number;
  row: number;
  label: string;
  state: 'current' | 'visited' | 'locked';
  connections: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  quantity: number;
  category: 'tool' | 'document' | 'key' | 'consumable' | 'misc' | 'weapon';
  damage?: number;
}

export interface ActionChoice {
  id: string;
  label: string;
  timeCost: number;
  variant: 'default' | 'accent' | 'danger';
}

export interface NarrativeEntry {
  id: string;
  time: number;
  text: string;
  type: 'story' | 'info' | 'warning' | 'danger';
}

export interface ActionsEntry {
  id: string;
  time: number;
  type: 'actions';
  choices: ActionChoice[];
  resolvedId?: string;
  resolvedLabel?: string;
}

export type LogEntry = NarrativeEntry | ActionsEntry;

export const useGameStore = defineStore('game', {
  state: () => ({
    player: {
      name: '',
      gender: 'unknown',
      traits: [] as string[],
      stats: {
        hp: 100,
        maxHp: 100,
        sanity: 100,
        maxSanity: 100,
        strength: 5,
        intelligence: 5,
        dexterity: 5,
      } as PlayerStats,
      equippedWeapon: null,
    } as PlayerState,
    game: {
      started: false,
      day: 1,
      time: 8,
      isRestDay: true,
      weather: 'sunny',
      location: 'cell_01',
      money: 0,
      energy: 100,
      hunger: 58,
      nextDeadlineDay: 2,
      objective: '醒来，活下去',
    } as GameState,
    combat: {
      active: false,
      enemyName: '',
      enemyHp: 0,
      enemyMaxHp: 0,
      enemyAtk: 0,
      log: [],
    } as CombatState,
    flags: {
      hoursSinceLastRest: 0,
      exploredLocations: ['cell_01'] as string[], // 新增: 探索过的位置
    } as Record<string, any>,
    inventory: [
      { id: 'ration', name: '合成口粮', description: '一块硬得像石头的压缩饼干。', icon: 'package', quantity: 1, category: 'consumable' },
      { id: 'iron_pipe', name: '生锈的铁管', description: '虽然简陋但致命。', icon: 'zap', quantity: 1, category: 'weapon', damage: 10 }
    ] as InventoryItem[],
    logs: [] as LogEntry[],
    _lastSave: 0, // 新增：记录上次存档时间
    mapNodes: [
      { id: 'cell_01',    col: 2, row: 2, label: '牢房 01', state: 'current', connections: ['corridor_a'] },
      { id: 'corridor_a', col: 4, row: 2, label: '走廊 Alpha', state: 'locked',  connections: ['cell_01', 'hall_main', 'cell_02'] },
      { id: 'cell_02',    col: 4, row: 4, label: '牢房 02', state: 'locked',  connections: ['corridor_a'] },
      { id: 'hall_main',  col: 6, row: 2, label: '设施大厅', state: 'locked',  connections: ['corridor_a', 'med_bay', 'mess_hall', 'warehouse_back'] },
      { id: 'med_bay',    col: 6, row: 0, label: '医疗站', state: 'locked',  connections: ['hall_main'] },
      { id: 'mess_hall',  col: 8, row: 2, label: '公共食堂', state: 'locked',  connections: ['hall_main', 'garbage_chute'] },
      { id: 'garbage_chute', col: 10, row: 2, label: '废料处理区', state: 'locked',  connections: ['mess_hall'] },
      { id: 'warehouse_back', col: 6, row: 4, label: '秘密仓库', state: 'locked',  connections: ['hall_main'] },
    ] as MapNode[],
  }),

  actions: {
    startGame(playerData: any) {
      this.player.name = playerData.name;
      this.player.gender = playerData.gender;
      this.player.traits = playerData.traits;
      this.player.stats = { ...playerData.stats };
      this.game.started = true;
      this.game.energy = 100;
      this.game.hunger = 58;
      this.game.objective = '探索周围的环境';
      this.updateDeadlineInfo();
      this.flags.hoursSinceLastRest = 0;
      this.flags.exploredLocations = ['cell_01'];
      this.addLog(`你在铁锈味中醒来，记忆的碎片拼凑出你的身份：${this.player.name}。`, 'story');
      this.addLog('胃里空得发疼。', 'warning');
    },

    setObjective(text: string) {
      this.game.objective = text;
    },

    addLog(text: string, type: NarrativeEntry['type'] = 'info') {
      const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const entry = { id, time: Date.now(), text, type };
      // 若末尾是未选择的行动条目，将叙事插入其前，避免日志出现在按钮下方
      const last = this.logs[this.logs.length - 1];
      if (last && last.type === 'actions' && !last.resolvedId) {
        this.logs.splice(this.logs.length - 1, 0, entry);
      } else {
        this.logs.push(entry);
      }
      if (this.logs.length > 200) this.logs.splice(0, this.logs.length - 200);
    },

    addActions(choices: ActionChoice[]) {
      const id = `a-${Date.now()}`;
      this.logs.push({ id, time: Date.now(), type: 'actions', choices });
      if (this.logs.length > 200) this.logs.splice(0, this.logs.length - 200);
    },

    resolveAction(entryId: string, choiceId: string, choiceLabel: string) {
      const entry = this.logs.find(l => l.id === entryId);
      if (entry && entry.type === 'actions') {
        entry.resolvedId = choiceId;
        entry.resolvedLabel = choiceLabel;
      }
    },

    consumeTime(hours: number) {
      this.game.time += hours;
      this.applyHungerDecay(hours * 1.6);
      if (typeof this.flags.hoursSinceLastRest === 'number') {
        this.flags.hoursSinceLastRest += hours;
        if (this.flags.hoursSinceLastRest > 18) {
          const sanityLoss = Math.floor((this.flags.hoursSinceLastRest - 18) * 2);
          this.player.stats.sanity = Math.max(0, this.player.stats.sanity - sanityLoss);
          if (this.player.stats.sanity <= 0) {
            this.player.stats.hp = Math.max(1, this.player.stats.hp - 5);
            this.addLog('你已经到了极限，眼前的黑暗正在把你吞没。', 'warning');
          } else {
            this.addLog('你感到极度疲惫，思绪开始变得混乱。', 'warning');
          }
        }
      }
      if (this.player.stats.sanity < 15) {
        this.player.stats.maxSanity = Math.max(30, this.player.stats.maxSanity - 1);
        this.addLog('长期的精神折磨正在永久性地摧毁你的大脑。', 'warning');
      }
      let safety = 0;
      while (this.game.time >= 24 && safety < 10) {
        this.game.time -= 24;
        this.advanceDay();
        safety++;
      }
    },

    advanceDay() {
      const previousDay = this.game.day;
      if (!this.flags[`ate_food_day_${previousDay}`]) {
        this.game.hunger = Math.max(0, this.game.hunger - 12);
        this.player.stats.sanity = Math.max(0, this.player.stats.sanity - 6);
        this.addLog('你昨天几乎没有吃东西。胃部痉挛让你醒来时就已经开始发抖。', 'danger');
      }

      this.game.day += 1;
      const scheduleStore = useScheduleStore();
      const config = scheduleStore.getDayConfig(this.game.day);
      this.game.energy = Math.max(0, this.game.energy - 12);
      if (this.game.energy < 20) {
        this.addLog('警告：设施电力低于临界值。', 'danger');
        this.player.stats.sanity -= 5;
      }
      this.game.isRestDay = config.isRestDay;
      this.updateDeadlineInfo();
      if (config.weather) this.game.weather = config.weather;
      else {
        const weathers: GameState['weather'][] = ['sunny', 'rainy', 'foggy'];
        this.game.weather = weathers[Math.floor(Math.random() * weathers.length)];
      }
      this.addLog(`新的一天开始了。今天是第 ${this.game.day} 天。`, 'info');
      if (this.game.nextDeadlineDay) {
        const remaining = this.game.nextDeadlineDay - this.game.day;
        if (remaining === 0) {
          this.addLog('今天就是系统安排的关键节点。你之前做过的准备，现在都要兑现了。', 'danger');
        } else if (remaining <= 3) {
          this.addLog(`离下一次强制游戏日只剩 ${remaining} 天。这里不会给你慢慢准备的时间。`, 'warning');
        }
      }

      // 处理可选偶遇钩子：如果有mainPlotId则优先触发，否则随机触发可选偶遇
      if (config.optionalHooks && config.optionalHooks.length > 0 && !config.mainPlotId) {
        if (Math.random() < 0.6) {
          const hook = config.optionalHooks[Math.floor(Math.random() * config.optionalHooks.length)];
          this.flags.pendingPlotId = hook;
        }
      }

      if (config.mainPlotId) this.flags.pendingPlotId = config.mainPlotId;
      this.saveGame();
    },

    unlockNode(nodeId: string) {
      const node = this.mapNodes.find(n => n.id === nodeId);
      if (node) node.state = 'visited';
    },

    moveTo(nodeId: string) {
      const prev = this.mapNodes.find(n => n.id === this.game.location);
      if (prev?.state === 'current') prev.state = 'visited';
      const next = this.mapNodes.find(n => n.id === nodeId);
      if (next) { 
        next.state = 'current'; 
        this.game.location = nodeId; 
        // 记录探索
        if (!this.flags.exploredLocations.includes(nodeId)) {
          this.flags.exploredLocations.push(nodeId);
        }
      }
    },

    enterCombat(enemyName: string, hp: number, atk: number) {
      this.combat.active = true;
      this.combat.enemyName = enemyName;
      this.combat.enemyHp = hp;
      this.combat.enemyMaxHp = hp;
      this.combat.enemyAtk = atk;
      this.combat.log = [`战斗开始：${enemyName} 出现了！`];
      this.addLog(`进入战斗状态：对手是 ${enemyName}`, 'danger');
      this.addCombatActions();
    },

    addCombatActions() {
      this.addActions([
        { id: '_combat_atk', label: '攻击', timeCost: 0.5, variant: 'danger' },
        { id: '_combat_def', label: '防御', timeCost: 0.25, variant: 'accent' },
      ]);
    },

    processCombatTurn(actionId: 'atk' | 'def' | 'skill') {
      if (!this.combat.active) return;

      // 玩家回合
      let playerDmg = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      
      if (actionId === 'atk') {
        let weaponDmg = 0;
        if (this.player.equippedWeapon) {
          const w = this.inventory.find(i => i.id === this.player.equippedWeapon);
          if (w && w.damage) weaponDmg = w.damage;
        }
        playerDmg = Math.floor((this.player.stats.strength / 5) + (roll / 2) + weaponDmg);
        if (roll === 20) playerDmg *= 2;
        this.combat.enemyHp -= playerDmg;
        this.addLog(`你${this.player.equippedWeapon ? '挥动武器' : '扑上去'}，对敌人造成了 ${playerDmg} 点伤害。`, 'info');
      } else if (actionId === 'def') {
        this.addLog(`你摆出了防御姿态。`, 'info');
      }

      // 检查胜利
      if (this.combat.enemyHp <= 0) {
        this.combat.active = false;
        this.addLog(`胜利！你击败了 ${this.combat.enemyName}。`, 'info');
        return 'win';
      }

      // 敌人回合
      const enemyRoll = Math.floor(Math.random() * 20) + 1;
      let enemyDmg = Math.floor(this.combat.enemyAtk + (enemyRoll / 4));
      if (actionId === 'def') enemyDmg = Math.floor(enemyDmg / 2);
      
      this.player.stats.hp -= enemyDmg;
      const sanityHit = Math.max(1, Math.ceil(enemyDmg * 0.35));
      this.player.stats.sanity = Math.max(0, this.player.stats.sanity - sanityHit);
      this.addLog(`${this.combat.enemyName} 反击，对你造成了 ${enemyDmg} 点伤害。（SAN -${sanityHit}）`, 'danger');

      // 检查失败
      if (this.player.stats.hp <= 0) {
        this.combat.active = false;
        this.addLog(`你倒下了……`, 'danger');
        return 'lose';
      }
      return 'ongoing';
    },

    saveGame(slot: string = 'auto') {
      const now = Date.now();
      if (now - this._lastSave < 1000) return; // 1秒防抖
      this._lastSave = now;

      const saveData = {
        player: this.player, game: this.game, flags: this.flags,
        inventory: this.inventory, logs: this.logs, mapNodes: this.mapNodes,
        timestamp: now
      };
      try {
        localStorage.setItem(`save_slot_${slot}`, JSON.stringify(saveData));
      } catch (e) {
        console.error('[GameStore] Save failed:', e);
      }
    },

    loadGame(slot: string = 'auto') {
      const raw = localStorage.getItem(`save_slot_${slot}`);
      if (!raw) return false;
      try {
        const data = JSON.parse(raw);
        // 断开旧数据的引用连接，防止响应式污染
        this.player = { ...data.player }; 
        this.game = { ...data.game }; 
        this.flags = { ...data.flags };
        this.inventory = [...data.inventory]; 
        this.logs = [...data.logs]; 
        this.mapNodes = [...data.mapNodes];

        // 核心数值二次校验
        if (typeof this.game.day !== 'number' || isNaN(this.game.day)) this.game.day = 1;
        if (typeof this.game.time !== 'number' || isNaN(this.game.time)) this.game.time = 8;
        if (this.game.time >= 24) this.game.time = 0;

        if (typeof this.game.hunger !== 'number') this.game.hunger = 58;
        if (typeof this.game.nextDeadlineDay !== 'number' && this.game.nextDeadlineDay !== null) this.game.nextDeadlineDay = null;
        this.updateDeadlineInfo();
        return true;
      } catch (e) { 
        console.error('[GameStore] Load failed:', e);
        return false; 
      }
    },

    rollCheck(statValue: number, difficulty: number): { success: boolean; roll: number; total: number } {
      const roll = Math.floor(Math.random() * 20) + 1;
      const hungerPenalty = this.game.hunger <= 15 ? 4 : this.game.hunger <= 30 ? 2 : 0;
      const total = statValue + roll - hungerPenalty;
      return { success: total >= difficulty, roll, total };
    },

    useItem(itemId: string) {
      const index = this.inventory.findIndex(i => i.id === itemId);
      if (index === -1) return;
      const item = this.inventory[index];
      
      if (item.category === 'weapon') {
        this.player.equippedWeapon = item.id;
        this.addLog(`你装备了 ${item.name}。`, 'info');
        return;
      }

      let success = false;
      if (item.id === 'ration') {
        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + 8);
        this.player.stats.sanity = Math.min(this.player.stats.maxSanity, this.player.stats.sanity + 6);
        this.game.hunger = Math.min(100, this.game.hunger + 45);
        this.flags[`ate_food_day_${this.game.day}`] = true;
        this.clearHungerWarningFlags();
        this.addLog('你一点点咽下压缩口粮。胃里的灼痛终于缓了下来，思路也重新稳住了。', 'info');
        success = true;
      } else if (item.id === 'adrenaline') {
        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + 20);
        this.player.stats.strength += 5;
        this.player.stats.dexterity += 5;
        this.addLog('肾上腺素让你充满了力量。', 'warning');
        success = true;
      } else if (item.id === 'painkillers' || item.id === 'pure_painkiller') {
        const amount = item.id === 'pure_painkiller' ? 40 : 20;
        this.player.stats.sanity = Math.min(this.player.stats.maxSanity, this.player.stats.sanity + amount);
        this.addLog('思绪清晰了许多。', 'info');
        success = true;
      }
      if (success) {
        if (item.quantity > 1) item.quantity -= 1;
        else this.inventory.splice(index, 1);
      }
    },

    clearHungerWarningFlags() {
      delete this.flags[`hunger_warn_45_day_${this.game.day}`];
      delete this.flags[`hunger_warn_25_day_${this.game.day}`];
      delete this.flags[`hunger_warn_10_day_${this.game.day}`];
    },

    applyHungerDecay(amount: number) {
      const before = this.game.hunger;
      this.game.hunger = Math.max(0, this.game.hunger - amount);

      if (before > 45 && this.game.hunger <= 45 && !this.flags[`hunger_warn_45_day_${this.game.day}`]) {
        this.flags[`hunger_warn_45_day_${this.game.day}`] = true;
        this.addLog('饥饿开始影响你的判断。你发现自己会下意识地盯着别人的口粮看。', 'warning');
      }

      if (before > 25 && this.game.hunger <= 25 && !this.flags[`hunger_warn_25_day_${this.game.day}`]) {
        this.flags[`hunger_warn_25_day_${this.game.day}`] = true;
        this.player.stats.sanity = Math.max(0, this.player.stats.sanity - 4);
        this.addLog('你已经饿得发虚，动作开始变慢。再这样下去，很多本来能做到的事都会开始失手。', 'danger');
      }

      if (before > 10 && this.game.hunger <= 10 && !this.flags[`hunger_warn_10_day_${this.game.day}`]) {
        this.flags[`hunger_warn_10_day_${this.game.day}`] = true;
        this.player.stats.hp = Math.max(1, this.player.stats.hp - 6);
        this.player.stats.sanity = Math.max(0, this.player.stats.sanity - 8);
        this.addLog('胃部像被刀割一样绞紧。你意识到，今天再吃不到东西，任何冲突都可能把你压垮。', 'danger');
      }

      if (this.game.hunger <= 0) {
        this.player.stats.hp = Math.max(1, this.player.stats.hp - 5);
        this.player.stats.sanity = Math.max(0, this.player.stats.sanity - 5);
        this.addLog('你已经处在断粮状态。视野边缘发黑，连站着都变得困难。', 'danger');
      }
    },

    updateDeadlineInfo() {
      const scheduleStore = useScheduleStore();
      const futureMainDay = Object.keys(scheduleStore.calendar)
        .map(Number)
        .filter(day => day > this.game.day && !!scheduleStore.calendar[day]?.mainPlotId)
        .sort((a, b) => a - b)[0];
      this.game.nextDeadlineDay = futureMainDay ?? null;
    }
  },
});

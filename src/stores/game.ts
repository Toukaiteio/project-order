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
  currentSceneId: string | null;
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
      currentSceneId: 'awake',
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
      exploredLocations: ['cell_01'] as string[],
    } as Record<string, any>,
    inventory: [
      { id: 'ration', name: '合成口粮', description: '一块硬得像石头的压缩饼干。', icon: 'package', quantity: 1, category: 'consumable' },
      { id: 'iron_pipe', name: '生锈的铁管', description: '虽然简陋但致命。', icon: 'zap', quantity: 1, category: 'weapon', damage: 10 }
    ] as InventoryItem[],
    logs: [] as LogEntry[],
    _lastSave: 0,
    plants: [] as any[],
    storage: [] as any[],
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
      this.player.equippedWeapon = null;
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

    fixSceneStuck(sceneId: string) {
      const flagKey = `scene_triggered_${sceneId}`;
      if (this.flags[flagKey]) {
        delete this.flags[flagKey];
        this.addLog('[系统] 检测到剧情阻塞，已尝试重置当前场景触发状态。', 'warning');
      }
    },

    waterPlant(index: number) {
      if (this.plants[index]) {
        this.plants[index].lastWateredDay = this.game.day;
        this.plants[index].health = Math.min(100, this.plants[index].health + 15);
        this.addLog(`你给 ${this.plants[index].name} 浇了水。在那一小圈湿润的泥土中，你感到了某种安宁。`, 'info');
      }
    },

    harvestPlant(index: number) {
      const plant = this.plants[index];
      if (plant && plant.stage === 3) {
        const productMap: Record<string, any> = {
          'mystery_seeds': { id: 'healing_herb', name: '疗愈草', description: '虽然在这暗无天日的地方长大，但它依然充满了生命力。', icon: 'leaf', quantity: 1, category: 'consumable' },
        };
        const product = productMap[plant.seedId] || { id: 'dried_plant', name: '枯萎的残留物', description: '没什么用。', icon: 'trash', quantity: 1, category: 'misc' };
        this.inventory.push(product);
        this.addLog(`你收获了 ${plant.name}。`, 'info');
        this.plants.splice(index, 1);
      }
    },

    plantSeed(seedId: string) {
      const maxSlots = this.flags.planting_slots_expanded ? 4 : 2;
      if (this.plants.length >= maxSlots) {
        this.addLog('没有多余的空位可以种植了。', 'warning');
        return;
      }
      const seedIdx = this.inventory.findIndex(i => i.id === seedId);
      if (seedIdx === -1) return;

      const seedNames: Record<string, string> = { 'mystery_seeds': '神秘的幼苗' };
      this.plants.push({
        id: `p-${Date.now()}`,
        name: seedNames[seedId] || '未知名植物',
        seedId,
        stage: 0,
        growthProgress: 0,
        lastWateredDay: this.game.day,
        health: 100
      });

      if (this.inventory[seedIdx].quantity > 1) this.inventory[seedIdx].quantity--;
      else this.inventory.splice(seedIdx, 1);
      this.addLog(`你将种子埋进了土里。在这个铁笼子里，这看起来像是一场豪赌。`, 'info');
    },

    storeToBox(itemId: string) {
      const idx = this.inventory.findIndex(i => i.id === itemId);
      if (idx === -1) return;
      const item = this.inventory[idx];
      this.storage.push({ ...item, quantity: 1 });
      if (item.quantity > 1) item.quantity--;
      else this.inventory.splice(idx, 1);
      this.addLog(`你把 ${item.name} 藏进了秘密储物槽。`, 'info');
    },

    retrieveFromBox(itemId: string) {
      const idx = this.storage.findIndex(i => i.id === itemId);
      if (idx === -1) return;
      const item = this.storage[idx];
      this.inventory.push({ ...item, quantity: 1 });
      if (item.quantity > 1) item.quantity--;
      else this.storage.splice(idx, 1);
      this.addLog(`你取回了 ${item.name}。`, 'info');
    },

    consumeTime(hours: number) {
      if (isNaN(hours) || hours <= 0) return;
      this.game.time += hours;
      this.applyHungerDecay(hours * 1.6);

      if (this.game.location === 'cell_01' && this.plants.length > 0) {
        const sanityGain = Math.floor(this.plants.filter((p: any) => p.stage > 0).length * (hours * 1.5)); 
        if (sanityGain > 0) {
          this.player.stats.sanity = Math.min(this.player.stats.maxSanity, this.player.stats.sanity + sanityGain);
        }
      }

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

      this.plants.forEach((p: any) => {
        const daysWithoutWater = this.game.day - p.lastWateredDay;
        if (daysWithoutWater > 0) {
          p.health -= 20;
        }
        
        if (p.health <= 0) {
          p.stage = -1;
        } else {
          const growthBonus = daysWithoutWater === 0 ? 35 : 5; 
          p.growthProgress += growthBonus;
          if (p.growthProgress >= 100) {
            p.growthProgress = 0;
            if (p.stage < 3) p.stage++;
          }
        }
      });
      
      const deadCount = this.plants.filter((p: any) => p.stage === -1).length;
      if (deadCount > 0) {
        this.addLog(`你有 ${deadCount} 株植物枯死了。牢房里最后一丝绿色也消失了。`, 'danger');
        this.player.stats.sanity = Math.max(0, this.player.stats.sanity - 10 * deadCount);
        this.plants = this.plants.filter((p: any) => p.stage !== -1);
      }

      if (this.storage.length > 0 && !this.flags.storage_locked) {
        if (Math.random() < 0.15) { 
          const stolenIdx = Math.floor(Math.random() * this.storage.length);
          const item = this.storage[stolenIdx];
          this.addLog(`你回来时发现储物柜被人撬开了。你的 ${item.name} 不见了。`, 'danger');
          this.storage.splice(stolenIdx, 1);
        }
      }

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

      if (this.combat.enemyHp <= 0) {
        this.combat.active = false;
        this.addLog(`胜利！你击败了 ${this.combat.enemyName}。`, 'info');
        return 'win';
      }

      const enemyRoll = Math.floor(Math.random() * 20) + 1;
      let enemyDmg = Math.floor(this.combat.enemyAtk + (enemyRoll / 4));
      if (actionId === 'def') enemyDmg = Math.floor(enemyDmg / 2);
      
      this.player.stats.hp -= enemyDmg;
      const sanityHit = Math.max(1, Math.ceil(enemyDmg * 0.35));
      this.player.stats.sanity = Math.max(0, this.player.stats.sanity - sanityHit);
      this.addLog(`${this.combat.enemyName} 反击，对你造成了 ${enemyDmg} 点伤害。（SAN -${sanityHit}）`, 'danger');

      if (this.player.stats.hp <= 0) {
        this.combat.active = false;
        this.addLog(`你倒下了……`, 'danger');
        return 'lose';
      }
      return 'ongoing';
    },

    saveGame(slot: string = 'auto') {
      const now = Date.now();
      if (now - this._lastSave < 1000) return;
      this._lastSave = now;

      const saveData = {
        player: this.player, game: this.game, flags: this.flags,
        inventory: this.inventory, logs: this.logs, mapNodes: this.mapNodes,
        plants: this.plants, storage: this.storage,
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
        this.player = { ...data.player }; 
        this.game = { ...data.game }; 
        this.flags = { ...data.flags };
        this.inventory = [...data.inventory]; 
        this.logs = [...data.logs]; 
        this.mapNodes = [...data.mapNodes];
        this.plants = data.plants ? [...data.plants] : [];
        this.storage = data.storage ? [...data.storage] : [];

        if (typeof this.game.day !== 'number' || isNaN(this.game.day)) this.game.day = 1;
        if (typeof this.game.time !== 'number' || isNaN(this.game.time)) this.game.time = 8;
        if (this.game.time >= 24) this.game.time = 0;

        if (typeof this.game.hunger !== 'number') this.game.hunger = 58;
        this.updateDeadlineInfo();

        const lastEntry = this.logs[this.logs.length - 1];
        if (lastEntry && lastEntry.type === 'actions' && !lastEntry.resolvedId && lastEntry.choices.length === 0) {
           if (this.game.currentSceneId) {
             this.fixSceneStuck(this.game.currentSceneId);
           }
        }
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
        if (this.player.equippedWeapon === item.id) {
          this.player.equippedWeapon = null;
          this.addLog(`你卸下了 ${item.name}。`, 'info');
        } else {
          this.player.equippedWeapon = item.id;
          this.addLog(`你装备了 ${item.name}。`, 'info');
        }
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

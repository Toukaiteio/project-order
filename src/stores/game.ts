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
    } as Record<string, any>,
    inventory: [
      { id: 'ration', name: '合成口粮', description: '一块硬得像石头的压缩饼干，能维持基本生命。', icon: 'package', quantity: 1, category: 'consumable' },
      { id: 'iron_pipe', name: '生锈的铁管', description: '从床板上拆下来的铁管，可以作为防身武器。附加伤害: 10', icon: 'zap', quantity: 1, category: 'weapon', damage: 10 }
    ] as InventoryItem[],
    logs: [] as LogEntry[],
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
      this.flags.hoursSinceLastRest = 0;
      this.addLog(`你在铁锈味中醒来，记忆的碎片拼凑出你的身份：${this.player.name}。`, 'story');
    },

    addLog(text: string, type: NarrativeEntry['type'] = 'info') {
      const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      this.logs.push({ id, time: Date.now(), text, type });
      if (this.logs.length > 300) this.logs.shift();
    },

    addActions(choices: ActionChoice[]) {
      const id = `a-${Date.now()}`;
      this.logs.push({ id, time: Date.now(), type: 'actions', choices });
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
      while (this.game.time >= 24) {
        this.game.time -= 24;
        this.advanceDay();
      }
    },

    advanceDay() {
      this.game.day += 1;
      const scheduleStore = useScheduleStore();
      const config = scheduleStore.getDayConfig(this.game.day);
      this.game.energy = Math.max(0, this.game.energy - 12);
      if (this.game.energy < 20) {
        this.addLog('警告：设施电力低于临界值。', 'danger');
        this.player.stats.sanity -= 5;
      }
      this.game.isRestDay = config.isRestDay;
      if (config.weather) this.game.weather = config.weather;
      else {
        const weathers: GameState['weather'][] = ['sunny', 'rainy', 'foggy'];
        this.game.weather = weathers[Math.floor(Math.random() * weathers.length)];
      }
      this.addLog(`新的一天开始了。今天是第 ${this.game.day} 天。`, 'info');
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
      if (next) { next.state = 'current'; this.game.location = nodeId; }
    },

    enterCombat(enemyName: string, hp: number, atk: number) {
      this.combat.active = true;
      this.combat.enemyName = enemyName;
      this.combat.enemyHp = hp;
      this.combat.enemyMaxHp = hp;
      this.combat.enemyAtk = atk;
      this.combat.log = [`战斗开始：${enemyName} 出现了！`];
      this.addLog(`进入战斗状态：对手是 ${enemyName}`, 'danger');
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
        this.addLog(`（力量检定：${roll}）你使用${this.player.equippedWeapon ? '武器' : '徒手'}对敌人造成了 ${playerDmg} 点伤害。`, 'info');
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
      this.addLog(`${this.combat.enemyName} 反击，对你造成了 ${enemyDmg} 点伤害。`, 'danger');

      // 检查失败
      if (this.player.stats.hp <= 0) {
        this.combat.active = false;
        this.addLog(`你倒下了……`, 'danger');
        return 'lose';
      }
      return 'ongoing';
    },

    saveGame(slot: string = 'auto') {
      const saveData = {
        player: this.player, game: this.game, flags: this.flags,
        inventory: this.inventory, logs: this.logs, mapNodes: this.mapNodes,
        timestamp: Date.now()
      };
      localStorage.setItem(`save_slot_${slot}`, JSON.stringify(saveData));
    },

    loadGame(slot: string = 'auto') {
      const raw = localStorage.getItem(`save_slot_${slot}`);
      if (!raw) return false;
      try {
        const data = JSON.parse(raw);
        this.player = data.player; this.game = data.game; this.flags = data.flags;
        this.inventory = data.inventory; this.logs = data.logs; this.mapNodes = data.mapNodes;
        return true;
      } catch (e) { return false; }
    },

    rollCheck(statValue: number, difficulty: number): { success: boolean; roll: number; total: number } {
      const roll = Math.floor(Math.random() * 20) + 1;
      const total = statValue + roll;
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
        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + 15);
        this.addLog('你吃掉了压缩口粮，体力恢复了一些。', 'info');
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
    }
  },
});

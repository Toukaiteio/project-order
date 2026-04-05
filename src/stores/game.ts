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

export interface GameState {
  started: boolean;
  day: number;
  time: number; // 0-24
  isRestDay: boolean;
  weather: 'sunny' | 'rainy' | 'foggy' | 'blood_mist';
  location: string;
  money: number;
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
  category: 'tool' | 'document' | 'key' | 'consumable' | 'misc';
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
  type: 'story' | 'info' | 'warning';
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
    },
    game: {
      started: false,
      day: 1,
      time: 8,
      isRestDay: true,
      weather: 'sunny',
      location: 'cell_01',
      money: 0,
    } as GameState,
    flags: {
      hoursSinceLastRest: 0,
    } as Record<string, any>,
    inventory: [
      { id: 'ration', name: '合成口粮', description: '一块硬得像石头的压缩饼干，能维持基本生命。', icon: 'package', quantity: 1, category: 'consumable' }
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
      console.log('Starting game with data:', playerData);
      this.player.name = playerData.name;
      this.player.gender = playerData.gender;
      this.player.traits = playerData.traits;
      this.player.stats = { ...playerData.stats };
      this.game.started = true;
      this.flags.hoursSinceLastRest = 0;
      
      this.addLog(
        `你在头痛欲裂中醒来，记忆的碎片逐渐拼凑出你的身份：${this.player.name}。空气里弥漫着消毒水与铁锈的气味。`,
        'story'
      );
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
        entry.resolvedId    = choiceId;
        entry.resolvedLabel = choiceLabel;
      }
    },

    consumeTime(hours: number) {
      this.game.time += hours;
      
      // 疲劳度逻辑
      if (typeof this.flags.hoursSinceLastRest === 'number') {
        this.flags.hoursSinceLastRest += hours;
        
        // 惩罚逻辑：熬夜（超过 18 小时不休息）开始掉理智
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

      // 惩罚逻辑：低理智导致理智上限永久萎缩
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
      
      this.game.isRestDay = config.isRestDay;
      if (config.weather) {
        this.game.weather = config.weather;
      } else {
        const weathers: GameState['weather'][] = ['sunny', 'rainy', 'foggy'];
        if (Math.random() < 0.2) {
          this.game.weather = weathers[Math.floor(Math.random() * weathers.length)];
        } else {
          this.game.weather = 'sunny';
        }
      }

      this.addLog(`新的一天开始了。今天是第 ${this.game.day} 天。`, 'info');
      
      if (config.mainPlotId) {
        this.flags.pendingPlotId = config.mainPlotId;
      }
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

    useItem(itemId: string) {
      const index = this.inventory.findIndex(i => i.id === itemId);
      if (index === -1) return;

      const item = this.inventory[index];
      let success = false;

      if (item.id === 'ration') {
        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + 15);
        this.addLog('你吃掉了压缩口粮，虽然口感极差，但体力恢复了一些。', 'info');
        success = true;
      } else if (item.id === 'adrenaline') {
        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + 20);
        this.player.stats.strength += 5;
        this.player.stats.dexterity += 5;
        this.addLog('肾上腺素让你的心脏狂跳，你感到体内充满了爆发性的力量。', 'warning');
        success = true;
      } else if (item.id === 'painkillers') {
        this.player.stats.sanity = Math.min(this.player.stats.maxSanity, this.player.stats.sanity + 20);
        this.addLog('药物缓解了神经的抽痛，你的思绪清晰了许多。', 'info');
        success = true;
      }

      if (success) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          this.inventory.splice(index, 1);
        }
      }
    }
  },
});

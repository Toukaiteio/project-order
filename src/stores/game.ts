import { defineStore } from 'pinia';

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

// ── 日志条目类型（判别联合）─────────────────────────────────────

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
  resolvedId?: string;      // 玩家选择后填入
  resolvedLabel?: string;
}

export type LogEntry = NarrativeEntry | ActionsEntry;

// ─────────────────────────────────────────────────────────────────

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
      day: 1,
      time: 8,
      isRestDay: true,
      weather: 'sunny',
      location: 'cell_01',
      money: 0,
    } as GameState,
    flags: {} as Record<string, boolean | number | string>,
    inventory: [] as InventoryItem[],
    logs: [] as LogEntry[],
    mapNodes: [
      { id: 'cell_01',    col: 2, row: 2, label: '牢房 01', state: 'current', connections: ['corridor_a', 'cell_02'] },
      { id: 'corridor_a', col: 4, row: 2, label: '走廊',    state: 'locked',  connections: ['cell_01', 'hall_main'] },
      { id: 'cell_02',    col: 2, row: 4, label: '牢房 02', state: 'locked',  connections: ['cell_01']              },
      { id: 'hall_main',  col: 6, row: 2, label: '主厅',    state: 'locked',  connections: ['corridor_a', 'outside']},
      { id: 'outside',    col: 8, row: 2, label: '???',     state: 'locked',  connections: ['hall_main']            },
    ] as MapNode[],
  }),

  actions: {
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
      if (this.game.time >= 24) {
        this.game.time -= 24;
        this.game.day  += 1;
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
  },
});

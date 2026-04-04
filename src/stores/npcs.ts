import { defineStore } from 'pinia'

export interface NPC {
  id: string;
  name: string;
  originLabel: string;
  role: string;
  description: string;
  favorability: number; 
  trust: number;
  alignment: 'Lawful' | 'Neutral' | 'Chaotic';
  state: 'Alive' | 'Dead' | 'Missing' | 'Transformed';
  met: boolean;
  tags: string[];
  location?: string; // 当前所在位置
  metadata: Record<string, any>; 
}

export const useNPCStore = defineStore('npcs', {
  state: () => ({
    npcs: {
      'elena': {
        id: 'elena', name: 'Elena V.', originLabel: 'Northern Spire', role: 'Record Keeper',
        description: '冷静且危险，她似乎对这里的监控系统了如指掌。',
        favorability: 0, trust: 15, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['信息源', '怀疑者'], location: 'hall_main', metadata: { secretFound: false }
      },
      'marcus': {
        id: 'marcus', name: 'Marcus T.', originLabel: 'Industrial Belt', role: 'Enforcer',
        description: '这里的非官方头目，崇尚秩序，即便这种秩序是建立在恐惧之上的。',
        favorability: -20, trust: 5, alignment: 'Lawful', state: 'Alive', met: true,
        tags: ['强权', '武力'], location: 'corridor_a', metadata: { debt: 0 }
      },
      'aris': {
        id: 'aris', name: 'Dr. Aris', originLabel: 'Central Academgorodok', role: 'Med-Tech',
        description: '组织的边缘人，他的眼神里藏着对实验体的深深同情。',
        favorability: 10, trust: 30, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['医疗', '脆弱'], location: 'med_bay', metadata: { medsAvailable: 3 }
      },
      'satoshi': {
        id: 'satoshi', name: 'Satoshi K.', originLabel: 'Neon District', role: 'Logic Diver',
        description: '虽然胆小，但他能解读墙壁里的电信号。',
        favorability: 0, trust: 10, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['技术', '辅助'], location: 'cell_02', metadata: { hackingSkill: 1 }
      },
      'fatima': {
        id: 'fatima', name: 'Fatima A.', originLabel: 'Southern Oasis', role: 'Counselor',
        description: '她是这里的道德支柱，总是试图阻止暴力发生。',
        favorability: 20, trust: 40, alignment: 'Lawful', state: 'Alive', met: false,
        tags: ['希望', '治愈'], location: 'hall_main', metadata: { moralSupport: 5 }
      },
      'viktor': {
        id: 'viktor', name: 'Viktor R.', originLabel: 'The Iron Grids', role: 'Ex-Gladiator',
        description: '他认为只有最强的人才配活到第90天。',
        favorability: -30, trust: 0, alignment: 'Chaotic', state: 'Alive', met: false,
        tags: ['暴力', '掠夺者'], location: 'corridor_a', metadata: { violenceLevel: 10 }
      },
      'zoe': {
        id: 'zoe', name: 'Zoe L.', originLabel: 'Ivory Heights', role: 'Scavenger',
        description: '她总能从垃圾堆里翻出有用的东西。',
        favorability: 5, trust: 20, alignment: 'Chaotic', state: 'Alive', met: false,
        tags: ['潜行', '贸易'], location: 'warehouse_back', metadata: { itemsToTrade: ['lockpick', 'battery'] }
      }
      // 后续内容量扩充... 预留 8 个 NPC 槽位
    } as Record<string, NPC>
  }),
  actions: {
    // 逻辑：更新 NPC 状态
    interact(id: string, fDelta: number, tDelta: number) {
      if (this.npcs[id]) {
        this.npcs[id].favorability += fDelta;
        this.npcs[id].trust += tDelta;
        this.npcs[id].met = true;
      }
    }
  }
})

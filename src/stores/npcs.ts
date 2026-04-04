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
        id: 'elena', name: 'Elena V.', originLabel: '北境高塔', role: '记录员',
        description: '冷静且危险，她似乎对这里的监控系统了如指掌。',
        favorability: 0, trust: 15, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['信息源', '怀疑者'], location: 'hall_main', metadata: { secretFound: false }
      },
      'marcus': {
        id: 'marcus', name: 'Marcus T.', originLabel: '工业地带', role: '执法者',
        description: '这里的非官方头目，崇尚秩序，即便这种秩序是建立在恐惧之上的。',
        favorability: -20, trust: 5, alignment: 'Lawful', state: 'Alive', met: true,
        tags: ['强权', '武力'], location: 'corridor_a', metadata: { debt: 0 }
      },
      'aris': {
        id: 'aris', name: 'Dr. Aris', originLabel: '中央学城', role: '医技官',
        description: '组织的边缘人，他的眼神里藏着对实验体的深深同情。',
        favorability: 10, trust: 30, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['医疗', '脆弱'], location: 'med_bay', metadata: { medsAvailable: 3 }
      },
      'satoshi': {
        id: 'satoshi', name: 'Satoshi K.', originLabel: '霓虹区', role: '逻辑潜水员',
        description: '虽然胆小，但他能解读墙壁里的电信号。',
        favorability: 0, trust: 10, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['技术', '辅助'], location: 'cell_02', metadata: { hackingSkill: 1 }
      },
      'fatima': {
        id: 'fatima', name: 'Fatima A.', originLabel: '南部绿洲', role: '心理咨询师',
        description: '她是这里的道德支柱，总是试图阻止暴力发生。',
        favorability: 20, trust: 40, alignment: 'Lawful', state: 'Alive', met: false,
        tags: ['希望', '治愈'], location: 'hall_main', metadata: { moralSupport: 5 }
      },
      'viktor': {
        id: 'viktor', name: 'Viktor R.', originLabel: '铁格区', role: '前角斗士',
        description: '他认为只有最强的人才配活到第90天。',
        favorability: -30, trust: 0, alignment: 'Chaotic', state: 'Alive', met: false,
        tags: ['暴力', '掠夺者'], location: 'corridor_a', metadata: { violenceLevel: 10 }
      },
      'zoe': {
        id: 'zoe', name: 'Zoe L.', originLabel: '象牙高地', role: '清道夫',
        description: '她总能从垃圾堆里翻出有用的东西。',
        favorability: 5, trust: 20, alignment: 'Chaotic', state: 'Alive', met: false,
        tags: ['潜行', '贸易'], location: 'warehouse_back', metadata: { itemsToTrade: ['lockpick', 'battery'] }
      },
      'julian': {
        id: 'julian', name: 'Julian V.', originLabel: '水晶尖塔', role: '经纪人',
        description: '即便落魄也保持着优雅，擅长交换情报与配额。',
        favorability: -5, trust: 15, alignment: 'Lawful', state: 'Alive', met: false,
        tags: ['情报', '交易'], location: 'mess_hall', metadata: { informationLevel: 5 }
      },
      'sasha': {
        id: 'sasha', name: 'Sasha P.', originLabel: '霜冻扇区', role: '信使',
        description: '年纪很小，但动作极快，对这里的通风管道了如指掌。',
        favorability: 10, trust: 25, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['速度', '管道'], location: 'garbage_chute', metadata: { shortcutUnlocked: false }
      },
      'liam': {
        id: 'liam', name: 'Liam O.', originLabel: '迷雾山谷', role: '药草师',
        description: '沉默寡言，总是在摆弄一些不知名的苔藓和菌类。',
        favorability: 0, trust: 20, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['药物', '自然'], location: 'med_bay', metadata: { toxinLevel: 0 }
      },
      'kaito': {
        id: 'kaito', name: 'Kaito S.', originLabel: '沉没港口', role: '机械师',
        description: '能用最简单的工具修复复杂的机械。',
        favorability: 5, trust: 15, alignment: 'Lawful', state: 'Alive', met: false,
        tags: ['修理', '工具'], location: 'warehouse_back', metadata: { toolsRepair: 3 }
      },
      'lara': {
        id: 'lara', name: 'Lara M.', originLabel: '回声峡谷', role: '声学工程师',
        description: '能够通过回声判断设施的结构。',
        favorability: 0, trust: 10, alignment: 'Neutral', state: 'Alive', met: false,
        tags: ['侦听', '地理'], location: 'corridor_a', metadata: { echoMap: false }
      }
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

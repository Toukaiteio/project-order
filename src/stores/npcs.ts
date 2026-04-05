import { defineStore } from 'pinia'

export type NPCState = 'Alive' | 'Dead' | 'Missing' | 'Escaped'

export interface NPC {
  id: string
  name: string
  origin: string
  originLabel: string
  role: string
  roleLabel: string
  description: string
  favorability: number // -100 to 100
  trust: number // 0 to 100
  met: boolean
  state: NPCState
  tags: string[]
  location: string
  metadata?: Record<string, any>
}

export const useNPCStore = defineStore('npcs', {
  state: () => ({
    npcs: {
      'marcus': {
        id: 'marcus', name: 'Marcus T.', origin: 'industrial', originLabel: '工业扇区',
        role: 'leader', roleLabel: '秩序领袖', description: '身材魁梧，眼神阴鸷，曾是帮派首领。',
        favorability: 0, trust: 10, met: false, state: 'Alive', tags: ['秩序', '力量'], location: 'hall_main'
      },
      'elena': {
        id: 'elena', name: 'Elena V.', origin: 'research', originLabel: '科研扇区',
        role: 'strategist', roleLabel: '真相追踪者', description: '总是戴着厚重的眼镜，不停地记录着。',
        favorability: 0, trust: 20, met: false, state: 'Alive', tags: ['真相', '理性'], location: 'hall_main'
      },
      'sasha': {
        id: 'sasha', name: 'Sasha P.', origin: 'unknown', originLabel: '未知扇区',
        role: 'survivor', roleLabel: '幸存者', description: '瘦弱的少女，眼神中充满了恐惧。',
        favorability: 0, trust: 30, met: false, state: 'Alive', tags: ['情感', '弱者'], location: 'mess_hall'
      },
      'satoshi': {
        id: 'satoshi', name: 'Satoshi K.', origin: 'tech', originLabel: '技术扇区',
        role: 'hacker', roleLabel: '黑客', description: '对电子零件有着超乎寻常的狂热。',
        favorability: 0, trust: 15, met: false, state: 'Alive', tags: ['工具', '逃离'], location: 'cell_02'
      },
      'aris': {
        id: 'aris', name: 'Dr. Aris', origin: 'medical', originLabel: '医疗扇区',
        role: 'doctor', roleLabel: '医生', description: '疲惫的医者，试图在杀戮中救人。',
        favorability: 0, trust: 25, met: false, state: 'Alive', tags: ['仁慈', '补给'], location: 'med_bay'
      },
      'grey': {
        id: 'grey', name: '灰 (Grey)', origin: 'shadow', originLabel: '阴影扇区',
        role: 'companion', roleLabel: '影子伙伴', description: '神出鬼没的引导者，似乎对这里了如指掌。',
        favorability: 20, trust: 40, met: false, state: 'Alive', tags: ['引导', '主线'], location: 'untracked' // 初始设为隐藏
      },
      'broker': {
        id: 'broker', name: '掮客 (Broker)', origin: 'black_market', originLabel: '黑市',
        role: 'merchant', roleLabel: '商人', description: '只要有积分，他能弄到任何东西。',
        favorability: 0, trust: 10, met: false, state: 'Alive', tags: ['贸易', '物资'], location: 'warehouse_back'
      }
    } as Record<string, NPC>
  }),
  actions: {
    interact(npcId: string, favChange: number, trustChange: number) {
      const npc = this.npcs[npcId]
      if (npc) {
        npc.favorability = Math.max(-100, Math.min(100, npc.favorability + favChange))
        npc.trust = Math.max(0, Math.min(100, npc.trust + trustChange))
        npc.met = true
      }
    }
  }
})

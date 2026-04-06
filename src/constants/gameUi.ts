import {
  Navigation,
  Moon,
  Search,
  Eye,
  Zap,
  Ear,
  MapPin,
  ChevronRight,
  MessageSquare,
  Package,
  BookOpen,
  Users,
  Shield,
  Swords,
  Plus,
  Image,
  Target,
  Clock,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export type TabId = 'story' | 'inventory' | 'status'

export interface NavItem {
  id: TabId
  label: string
  icon: Component
  sidebar: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'story', label: '剧情', icon: BookOpen, sidebar: false },
  { id: 'inventory', label: '背包', icon: Package, sidebar: false },
  { id: 'status', label: '状态', icon: Users, sidebar: true },
]

const ACTION_ICONS: Record<string, Component> = {
  explore: Navigation,
  rest: Moon,
  search: Search,
  examine: Eye,
  move: ChevronRight,
  train: Zap,
  eavesdrop: Ear,
  ask: MessageSquare,
  talk: MessageSquare,
  interact: Users,
  grab: Zap,
  pick: Plus,
  buy: Package,
  attack: Shield,
  // 战斗行动图标（匹配 _combat_atk / _combat_def）
  '_combat_atk': Swords,
  '_combat_def': Shield,
}

export const resolveActionIcon = (actionId: string): Component => {
  // 精确匹配优先（用于 _combat_atk / _combat_def 等特殊 ID）
  if (ACTION_ICONS[actionId]) return ACTION_ICONS[actionId]
  // 模糊匹配
  for (const [key, icon] of Object.entries(ACTION_ICONS)) {
    if (actionId.toLowerCase().includes(key)) return icon
  }
  return ChevronRight
}

export const LOCATION_NAMES: Record<string, string> = {
  cell_01: '牢房 01',
  cell_02: '牢房 02',
  corridor_a: '走廊 Alpha',
  hall_main: '设施大厅',
  med_bay: '医疗站',
  mess_hall: '公共食堂',
  garbage_chute: '废料处理区',
  warehouse_back: '秘密仓库',
}

export const WEATHER_NAMES: Record<string, string> = {
  sunny: '晴朗',
  rainy: '大雨',
  foggy: '浓雾',
  blood_mist: '血雾',
}

export const resolveWeatherIcon = (weather: string): Component => {
  return Clock // 占位
}

/**
 * 格式化持续时间 (小时 -> xxhxxm)
 */
export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, '0')}m`;
}

/**
 * 格式化日志时间 (毫秒 -> hh:mm)
 */
export const formatLogTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

/**
 * 格式化游戏内时钟 (0-24 -> hh:mm)
 */
export const formatClockTime = (gameTime: number): string => {
  const h = Math.floor(gameTime).toString().padStart(2, '0')
  const m = Math.floor((gameTime % 1) * 60)
    .toString()
    .padStart(2, '0')
  return `${h}:${m}`
}

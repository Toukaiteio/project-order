import {
  BookOpen,
  Brain,
  CloudRain,
  Ear,
  Eye,
  Heart,
  MessageSquare,
  Moon,
  Navigation,
  Package,
  Skull,
  Sun,
  Users,
  Wind,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export type TabId = 'story' | 'inventory'

export interface NavItem {
  id: TabId | 'status'
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
  shout: MessageSquare,
  investigate: Skull,
  search_bed: Navigation,
  examine_wall: Eye,
  shout_help: MessageSquare,
  keep_note: Package,
  tear_note: Skull,
  ponder_name: Brain,
  ignore_name: Moon,
  listen_carefully: Ear,
  back_to_bed: Moon,
  hide_corner: Wind,
  confront: Skull,
  move_corridor_a: Navigation,
  move_hall_main: Navigation,
  move_med_bay: Navigation,
  move_mess_hall: Navigation,
  move_warehouse_back: Navigation,
  move_garbage_chute: Navigation,
  move_cell_01: Navigation,
  elena_ask_plan: MessageSquare,
  elena_offer_help: Users,
  marcus_pay_toll: Package,
  marcus_confront: Skull,
  aris_ask_meds: Heart,
  search_hall: Eye,
}

export const WEATHER_NAMES: Record<string, string> = {
  sunny: '晴朗',
  rainy: '大雨',
  foggy: '浓雾',
  blood_mist: '血雾',
}

export const LOCATION_NAMES: Record<string, string> = {
  cell_01: '牢房 01',
  corridor_a: '走廊 Alpha',
  cell_02: '牢房 02',
  hall_main: '设施大厅',
  med_bay: '医疗站',
  mess_hall: '公共食堂',
  warehouse_back: '秘密仓库',
  garbage_chute: '废料处理区',
}

export function formatClockTime(value: number) {
  const h = Math.floor(value).toString().padStart(2, '0')
  const m = Math.floor((value % 1) * 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

export function formatLogTime(ts: number) {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function resolveWeatherIcon(weather: string) {
  if (weather === 'rainy') return CloudRain
  if (weather === 'foggy') return Wind
  return Sun
}

export function resolveActionIcon(actionId: string) {
  return ACTION_ICONS[actionId] ?? Navigation
}

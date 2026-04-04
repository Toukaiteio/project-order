import {
  BookOpen,
  Brain,
  CloudRain,
  Ear,
  Eye,
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
  { id: 'story', label: '鍓ф儏', icon: BookOpen, sidebar: false },
  { id: 'inventory', label: '鑳屽寘', icon: Package, sidebar: false },
  { id: 'status', label: '鐘舵€?', icon: Users, sidebar: true },
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
  move_corridor: Navigation,
  move_hall: Navigation,
  elena_ask_plan: MessageSquare,
  elena_offer_help: Users,
  marcus_pay_toll: Package,
  marcus_confront: Skull,
}

export const WEATHER_NAMES: Record<string, string> = {
  sunny: '鏅存湕',
  rainy: '澶ч洦',
  foggy: '娴撻浘',
  blood_mist: '琛€闆?',
}

export const LOCATION_NAMES: Record<string, string> = {
  cell_01: '鐗㈡埧 01',
  corridor_a: '璧板粖',
  cell_02: '鐗㈡埧 02',
  hall_main: '涓诲巺',
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

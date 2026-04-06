import { defineStore } from 'pinia'

export interface DayConfig {
  weather?: 'sunny' | 'rainy' | 'foggy' | 'blood_mist';
  isRestDay: boolean;
  mainPlotId?: string; // 强制触发的主线剧情 ID
  optionalHooks: string[]; // 预留留白：可触发的支线任务或偶遇 ID
}

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    // 90天日程映射表
    calendar: {
      1: { isRestDay: true, mainPlotId: 'awake', optionalHooks: [] },
      2: { isRestDay: true, mainPlotId: 'daily_inspection', weather: 'foggy', optionalHooks: [] },
      3: { isRestDay: true, mainPlotId: 'blood_dusk_riot', optionalHooks: [] },
      4: { isRestDay: true, optionalHooks: ['daily_d04_isolation', 'grey_first_notice'] },
      5: { weather: 'rainy', isRestDay: true, mainPlotId: 'rainy_night_theft', optionalHooks: [] },
      6: { isRestDay: true, optionalHooks: [] },
      7: { isRestDay: true, weather: 'sunny', optionalHooks: [] },
      8: { isRestDay: true, optionalHooks: [] },
      9: { isRestDay: true, optionalHooks: [] },
      10: { isRestDay: true, weather: 'foggy', optionalHooks: [] },
      11: { isRestDay: false, mainPlotId: 'game_01_dilemma', optionalHooks: [] },
      15: { isRestDay: false, mainPlotId: 'faction_split_vote', optionalHooks: [] },
      20: { isRestDay: true, mainPlotId: 'aftermath_reaction', optionalHooks: [] },
      30: { isRestDay: false, mainPlotId: 'game_02_death_race', optionalHooks: [] },
      45: { isRestDay: false, mainPlotId: 'energy_crisis_start', optionalHooks: [] },
      60: { isRestDay: false, mainPlotId: 'the_great_purge_start', optionalHooks: [] },
      75: { isRestDay: false, mainPlotId: 'the_last_supper_start', optionalHooks: [] },
      // 16-89天 可以在日后开发中动态补充
      // 预留大规模留白区...
      90: { isRestDay: false, mainPlotId: 'grand_finale', optionalHooks: [] }
    } as Record<number, DayConfig>
  }),
  getters: {
    getDayConfig: (state) => (day: number): DayConfig => {
      return state.calendar[day] || { isRestDay: true, optionalHooks: [] }; // 默认留白
    }
  }
})

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
      21: { isRestDay: true, mainPlotId: 'day21_ration_audit', optionalHooks: [] },
      22: { isRestDay: true, mainPlotId: 'day22_faction_claim', optionalHooks: [] },
      23: { isRestDay: true, mainPlotId: 'day23_infirmary_overflow', optionalHooks: [] },
      24: { isRestDay: true, mainPlotId: 'day24_corridor_shakedown', optionalHooks: [] },
      25: { isRestDay: true, mainPlotId: 'day25_black_market_whisper', optionalHooks: [] },
      26: { isRestDay: true, mainPlotId: 'day26_lockdown_night', optionalHooks: [] },
      27: { isRestDay: true, mainPlotId: 'day27_screening_notice', optionalHooks: [] },
      28: { isRestDay: true, mainPlotId: 'day28_qualifier_run', optionalHooks: [] },
      29: { isRestDay: true, mainPlotId: 'day29_last_meal', optionalHooks: [] },
      30: { isRestDay: false, mainPlotId: 'game_02_death_race', optionalHooks: [] },
      31: { isRestDay: true, mainPlotId: 'day31_recovery_triage', optionalHooks: [] },
      32: { isRestDay: true, mainPlotId: 'day32_winner_tax', optionalHooks: [] },
      33: { isRestDay: true, mainPlotId: 'day33_power_flicker', optionalHooks: [] },
      34: { isRestDay: true, mainPlotId: 'day34_missing_runner', optionalHooks: [] },
      35: { isRestDay: true, mainPlotId: 'day35_terminal_whisper', optionalHooks: [] },
      36: { isRestDay: true, mainPlotId: 'day36_supply_fire', optionalHooks: [] },
      37: { isRestDay: true, mainPlotId: 'day37_false_sun', optionalHooks: [] },
      38: { isRestDay: true, mainPlotId: 'day38_air_thin', optionalHooks: [] },
      39: { isRestDay: true, mainPlotId: 'day39_quarantine_order', optionalHooks: [] },
      40: { isRestDay: true, mainPlotId: 'day40_blackout_barter', optionalHooks: [] },
      41: { isRestDay: true, mainPlotId: 'day41_names_on_wall', optionalHooks: [] },
      42: { isRestDay: true, mainPlotId: 'day42_reactor_hum', optionalHooks: [] },
      43: { isRestDay: true, mainPlotId: 'day43_final_shortage', optionalHooks: [] },
      44: { isRestDay: true, mainPlotId: 'day44_vote_warning', optionalHooks: [] },
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

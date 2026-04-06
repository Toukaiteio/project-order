import type { PlotScene } from '../../../types/plot';
import { companionPlots } from '../shared/companion';
import { encounterPlots } from '../shared/encounters';

export const day14Plots: Record<string, PlotScene> = {
  'daily_d14_pre_vote_pressure': encounterPlots['daily_d14_pre_vote_pressure'],
  'grey_day14_secret': companionPlots['grey_day14_secret'],
};

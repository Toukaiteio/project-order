import type { PlotScene } from '../../../types/plot';
import { companionPlots } from '../shared/companion';
import { encounterPlots } from '../shared/encounters';

export const day07Plots: Record<string, PlotScene> = {
  'daily_d07_nightmare': encounterPlots['daily_d07_nightmare'],
  'grey_day07_check': companionPlots['grey_day07_check'],
};

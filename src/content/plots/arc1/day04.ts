import type { PlotScene } from '../../../types/plot';
import { companionPlots } from '../shared/companion';
import { encounterPlots } from '../shared/encounters';

export const day04Plots: Record<string, PlotScene> = {
  'daily_d04_isolation': encounterPlots['daily_d04_isolation'],
  'grey_first_notice': companionPlots['grey_first_notice'],
  'grey_first_notice_choice': companionPlots['grey_first_notice_choice'],
  'grey_first_approach_preamble': companionPlots['grey_first_approach_preamble'],
  'grey_first_approach': companionPlots['grey_first_approach'],
  'grey_mechanics_guide': companionPlots['grey_mechanics_guide'],
};

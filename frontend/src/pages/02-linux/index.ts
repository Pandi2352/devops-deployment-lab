import type { ComponentType } from 'react'
import type { Phase2PageId } from '../../config/phases/phase-2'
import { BreakIt } from './BreakIt'
import { Commands } from './Commands'
import { Day1 } from './Day1'
import { Day2 } from './Day2'
import { Day3 } from './Day3'
import { Day4 } from './Day4'
import { Day5 } from './Day5'
import { Day6 } from './Day6'
import { Day7 } from './Day7'
import { FinalCheck } from './FinalCheck'
import { Mistakes } from './Mistakes'
import { Overview } from './Overview'
import { Setup } from './Setup'

export const LINUX_PAGES: Record<Phase2PageId, ComponentType> = {
  'linux-overview': Overview,
  'linux-setup': Setup,
  'day-1': Day1,
  'day-2': Day2,
  'day-3': Day3,
  'day-4': Day4,
  'day-5': Day5,
  'day-6': Day6,
  'day-7': Day7,
  'linux-commands': Commands,
  'linux-mistakes': Mistakes,
  'linux-break-it': BreakIt,
  'linux-final-check': FinalCheck,
}

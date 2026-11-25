import type { ComponentType } from 'react'
import type { Phase1PageId } from '../../config/phases/phase-1'
import { BreakIt } from './BreakIt'
import { Commands } from './Commands'
import { FinalCheck } from './FinalCheck'
import { Overview } from './Overview'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'
import { Step4 } from './Step4'
import { Step5 } from './Step5'
import { Step6 } from './Step6'
import { Step7 } from './Step7'
import { Step8 } from './Step8'
import { Step9 } from './Step9'
import { Step10 } from './Step10'

export const APP_AND_GIT_PAGES: Record<Phase1PageId, ComponentType> = {
  overview: Overview,
  'step-1': Step1,
  'step-2': Step2,
  'step-3': Step3,
  'step-4': Step4,
  'step-5': Step5,
  'step-6': Step6,
  'step-7': Step7,
  'step-8': Step8,
  'step-9': Step9,
  'step-10': Step10,
  commands: Commands,
  'break-it': BreakIt,
  'final-check': FinalCheck,
}

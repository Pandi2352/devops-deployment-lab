import type { ComponentType } from 'react'
import type { Phase4PageId } from '../../config/phases/phase-4'
import { BreakIt } from './BreakIt'
import { FinalCheck } from './FinalCheck'
import { Mistakes } from './Mistakes'
import { Overview } from './Overview'
import { Setup } from './Setup'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'
import { Step4 } from './Step4'
import { Step5 } from './Step5'
import { Step6 } from './Step6'
import { Words } from './Words'

export const ACTIONS_PAGES: Record<Phase4PageId, ComponentType> = {
  'actions-overview': Overview,
  'actions-setup': Setup,
  'actions-step-1': Step1,
  'actions-step-2': Step2,
  'actions-step-3': Step3,
  'actions-step-4': Step4,
  'actions-step-5': Step5,
  'actions-step-6': Step6,
  'actions-words': Words,
  'actions-mistakes': Mistakes,
  'actions-break-it': BreakIt,
  'actions-final-check': FinalCheck,
}

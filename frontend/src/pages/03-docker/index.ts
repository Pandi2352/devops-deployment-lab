import type { ComponentType } from 'react'
import type { Phase3PageId } from '../../config/phases/phase-3'
import { BreakIt } from './BreakIt'
import { Commands } from './Commands'
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
import { Step7 } from './Step7'

export const DOCKER_PAGES: Record<Phase3PageId, ComponentType> = {
  'docker-overview': Overview,
  'docker-setup': Setup,
  'docker-step-1': Step1,
  'docker-step-2': Step2,
  'docker-step-3': Step3,
  'docker-step-4': Step4,
  'docker-step-5': Step5,
  'docker-step-6': Step6,
  'docker-step-7': Step7,
  'docker-commands': Commands,
  'docker-mistakes': Mistakes,
  'docker-break-it': BreakIt,
  'docker-final-check': FinalCheck,
}

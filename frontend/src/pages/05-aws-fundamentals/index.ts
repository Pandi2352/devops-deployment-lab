import type { ComponentType } from 'react'
import type { Phase5PageId } from '../../config/phases/phase-5'
import { BreakIt } from './BreakIt'
import { Cleanup } from './Cleanup'
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
import { Step8 } from './Step8'
import { Step9 } from './Step9'

export const AWS_PAGES: Record<Phase5PageId, ComponentType> = {
  'aws-overview': Overview,
  'aws-setup': Setup,
  'aws-step-1': Step1,
  'aws-step-2': Step2,
  'aws-step-3': Step3,
  'aws-step-4': Step4,
  'aws-step-5': Step5,
  'aws-step-6': Step6,
  'aws-step-7': Step7,
  'aws-step-8': Step8,
  'aws-step-9': Step9,
  'aws-commands': Commands,
  'aws-mistakes': Mistakes,
  'aws-break-it': BreakIt,
  'aws-cleanup': Cleanup,
  'aws-final-check': FinalCheck,
}

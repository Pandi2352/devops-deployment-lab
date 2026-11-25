import type { GuidePage, Phase } from '../guide.types'

export type Phase4PageId =
  | 'actions-overview'
  | 'actions-setup'
  | 'actions-step-1'
  | 'actions-step-2'
  | 'actions-step-3'
  | 'actions-step-4'
  | 'actions-step-5'
  | 'actions-step-6'
  | 'actions-words'
  | 'actions-mistakes'
  | 'actions-break-it'
  | 'actions-final-check'

const PATH = '/phase-4'

function createStep(
  id: Phase4PageId,
  step: number,
  title: string,
  summary: string,
): GuidePage<Phase4PageId> {
  return {
    id,
    path: `${PATH}/step-${step}`,
    label: `Step ${step}`,
    title,
    summary,
  }
}

export const PHASE_4: Phase<Phase4PageId> = {
  label: 'Phase 4',
  name: 'GitHub Actions',
  path: PATH,
  overview: {
    id: 'actions-overview',
    path: PATH,
    title: 'Phase 4: GitHub Actions CI/CD (Free on a public repo)',
    summary: 'Goal and all steps',
  },
  groups: [
    {
      title: 'Prepare',
      pages: [
        {
          id: 'actions-setup',
          path: `${PATH}/setup`,
          title: 'Create the branch',
          summary: 'Start from the latest main.',
        },
      ],
    },
    {
      title: 'Part A: Check every change (CI)',
      pages: [
        createStep('actions-step-1', 1, 'CI workflow', 'Run lint, test and build on GitHub.'),
        createStep('actions-step-2', 2, 'Pull request checks', 'Read green and red results.'),
        createStep('actions-step-3', 3, 'Block bad code', 'Make the check required.'),
      ],
    },
    {
      title: 'Part B: Publish the image (CD)',
      pages: [
        createStep('actions-step-4', 4, 'Build the image', 'Build and upload after each merge.'),
        createStep('actions-step-5', 5, 'Test the image', 'Download it and check the version.'),
        createStep('actions-step-6', 6, 'Variables, secrets, environments', 'Prepare for AWS.'),
      ],
    },
    {
      title: 'Practice and check',
      pages: [
        {
          id: 'actions-words',
          path: `${PATH}/words`,
          title: 'YAML words to remember',
          summary: 'Workflow words and expressions in one place.',
        },
        {
          id: 'actions-mistakes',
          path: `${PATH}/mistakes`,
          title: 'Common mistakes',
          summary: 'Errors you will see, and how to fix them.',
        },
        {
          id: 'actions-break-it',
          path: `${PATH}/break-it`,
          title: 'Break it',
          summary: 'Fail the test, the build and the YAML.',
        },
        {
          id: 'actions-final-check',
          path: `${PATH}/final-check`,
          title: 'Final check',
          summary: 'Save your work and finish the phase.',
        },
      ],
    },
  ],
}

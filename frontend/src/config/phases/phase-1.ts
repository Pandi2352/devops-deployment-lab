import type { GuidePage, Phase } from '../guide.types'

export type Phase1PageId =
  | 'overview'
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'step-5'
  | 'step-6'
  | 'step-7'
  | 'step-8'
  | 'step-9'
  | 'step-10'
  | 'commands'
  | 'break-it'
  | 'final-check'

const PATH = '/phase-1'

function createStep(
  id: Phase1PageId,
  step: number,
  title: string,
  summary: string,
): GuidePage<Phase1PageId> {
  return {
    id,
    path: `${PATH}/step-${step}`,
    label: `Step ${step}`,
    title,
    summary,
  }
}

export const PHASE_1: Phase<Phase1PageId> = {
  label: 'Phase 1',
  name: 'App and Git',
  path: PATH,
  overview: {
    id: 'overview',
    path: PATH,
    title: 'Phase 1: App and Git (Free)',
    summary: 'Goal and all steps',
  },
  groups: [
    {
      title: 'Part A: Create the app',
      pages: [
        createStep('step-1', 1, 'Create the project', 'Make the React + TypeScript app.'),
        createStep('step-2', 2, 'Configure Tailwind', 'Turn on Tailwind CSS.'),
        createStep('step-3', 3, 'Landing page', 'Show a title and the version.'),
        createStep('step-4', 4, 'Add one test', 'Check that the page shows its title.'),
        createStep('step-5', 5, 'Run everything', 'Run dev, lint, test, build and preview.'),
      ],
    },
    {
      title: 'Part B: Git and GitHub',
      pages: [
        createStep('step-6', 6, 'Root files', 'Add the ignore, format and readme files.'),
        createStep('step-7', 7, 'First commit', 'Save the project with Git.'),
        createStep(
          'step-8',
          8,
          'Create the GitHub repo (on the website)',
          'Create the repo and push your code.',
        ),
        createStep(
          'step-9',
          9,
          'Branch and pull request',
          'Change code safely and merge it into main.',
        ),
        createStep('step-10', 10, 'Protect main', 'Block direct changes to main.'),
      ],
    },
    {
      title: 'Practice and check',
      pages: [
        {
          id: 'commands',
          path: `${PATH}/commands`,
          title: 'Commands to remember',
          summary: 'Git and npm commands in one place.',
        },
        {
          id: 'break-it',
          path: `${PATH}/break-it`,
          title: 'Break it',
          summary: 'Fix a merge conflict and undo a commit.',
        },
        {
          id: 'final-check',
          path: `${PATH}/final-check`,
          title: 'Final check',
          summary: 'Make sure everything works.',
        },
      ],
    },
  ],
}

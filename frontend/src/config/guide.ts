export type GuidePageId =
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

export interface GuidePage {
  id: GuidePageId
  path: string
  title: string
  step?: number
}

export interface GuideGroup {
  title: string
  pages: GuidePage[]
}

export const GUIDE_GROUPS: GuideGroup[] = [
  {
    title: 'Phase 1',
    pages: [{ id: 'overview', path: '/', title: 'Phase 1: App and Git (Free)' }],
  },
  {
    title: 'Part A: Create the app',
    pages: [
      { id: 'step-1', path: '/step-1', step: 1, title: 'Create the project' },
      { id: 'step-2', path: '/step-2', step: 2, title: 'Configure Tailwind' },
      { id: 'step-3', path: '/step-3', step: 3, title: 'Landing page' },
      { id: 'step-4', path: '/step-4', step: 4, title: 'Add one test' },
      { id: 'step-5', path: '/step-5', step: 5, title: 'Run everything' },
    ],
  },
  {
    title: 'Part B: Git and GitHub',
    pages: [
      { id: 'step-6', path: '/step-6', step: 6, title: 'Root files' },
      { id: 'step-7', path: '/step-7', step: 7, title: 'First commit' },
      {
        id: 'step-8',
        path: '/step-8',
        step: 8,
        title: 'Create the GitHub repo (on the website)',
      },
      { id: 'step-9', path: '/step-9', step: 9, title: 'Branch and pull request' },
      { id: 'step-10', path: '/step-10', step: 10, title: 'Protect main' },
    ],
  },
  {
    title: 'Practice and check',
    pages: [
      { id: 'commands', path: '/commands', title: 'Commands to remember' },
      { id: 'break-it', path: '/break-it', title: 'Break it' },
      { id: 'final-check', path: '/final-check', title: 'Final check' },
    ],
  },
]

export const GUIDE_PAGES: GuidePage[] = GUIDE_GROUPS.flatMap((group) => group.pages)

export function getPageName(page: GuidePage) {
  return page.step ? `Step ${page.step}: ${page.title}` : page.title
}

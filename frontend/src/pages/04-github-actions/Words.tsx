import { InlineCode, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

interface WordGroup {
  title: string
  items: { word: string; use: string }[]
}

const GROUPS: WordGroup[] = [
  {
    title: 'When it runs',
    items: [
      { word: 'on: pull_request', use: 'On every pull request' },
      { word: 'on: push', use: 'After a push or merge' },
      { word: 'on: workflow_dispatch', use: 'By hand, from the Actions tab' },
      { word: 'on: workflow_call', use: 'When another workflow calls it' },
      { word: 'on: schedule', use: 'At a fixed time' },
    ],
  },
  {
    title: 'What it runs',
    items: [
      { word: 'jobs', use: 'List of jobs' },
      { word: 'runs-on', use: 'Which machine' },
      { word: 'steps', use: 'List of steps in a job' },
      { word: 'uses', use: 'Run a ready-made action' },
      { word: 'run', use: 'Run a command' },
      { word: 'with', use: 'Values for an action' },
      { word: 'env', use: 'Environment variables' },
    ],
  },
  {
    title: 'Rules',
    items: [
      { word: 'needs', use: 'Wait for another job' },
      { word: 'if', use: 'Run only when this is true' },
      { word: 'permissions', use: 'What the job may do. Give as little as possible' },
      { word: 'environment', use: 'Use an environment and its approval' },
      { word: 'timeout-minutes', use: 'Stop a run that hangs' },
      { word: 'concurrency', use: 'Do not run two at the same time' },
    ],
  },
  {
    title: 'Values',
    items: [
      { word: '${{ github.sha }}', use: 'The commit id' },
      { word: '${{ github.ref }}', use: 'The branch or tag' },
      { word: '${{ github.actor }}', use: 'Who started it' },
      { word: '${{ github.repository }}', use: 'Owner and repo name' },
      { word: '${{ vars.NAME }}', use: 'A variable' },
      { word: '${{ secrets.NAME }}', use: 'A secret' },
    ],
  },
]

export function Words() {
  return (
    <StepPage id="actions-words">
      {GROUPS.map(({ title, items }) => (
        <section key={title} className="space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <ReferenceTable
            caption={title}
            headers={['Word', 'Use']}
            rows={items.map(({ word, use }) => ({
              key: word,
              label: <InlineCode>{word}</InlineCode>,
              value: use,
            }))}
          />
        </section>
      ))}
    </StepPage>
  )
}

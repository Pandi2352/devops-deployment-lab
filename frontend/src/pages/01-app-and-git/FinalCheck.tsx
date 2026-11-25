import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { PageLink } from '../../components/PageLink'
import { StepPage } from '../../components/StepPage'
import { PHASE_2 } from '../../config/phases/phase-2'

const CHECKS = [
  { key: 'styling', text: 'Page shows with Tailwind styling' },
  { key: 'scripts', text: 'lint, test and build all pass' },
  {
    key: 'protected',
    text: (
      <>
        One pull request merged, and a direct push to <InlineCode>main</InlineCode> is blocked
      </>
    ),
  },
]

const CHECK_COMMANDS: Command[] = [
  {
    command: 'cd D:\\devops\\react-devops\\frontend',
    purpose: 'Go to the app folder.',
  },
  { command: 'npm run lint', purpose: 'Must finish with no errors.' },
  { command: 'npm test', purpose: 'All tests must pass.' },
  { command: 'npm run build', purpose: 'Must create the dist folder with no errors.' },
  {
    command: 'git log --oneline --graph',
    purpose: 'Must show at least one "Merge pull request" line.',
  },
]

export function FinalCheck() {
  return (
    <StepPage id="final-check">
      <ul className="divide-y divide-line rounded-md border border-line bg-surface">
        {CHECKS.map(({ key, text }) => (
          <li key={key} className="px-4 py-3 leading-7">
            {text}
          </li>
        ))}
      </ul>
      <SectionTitle>Commands to check it</SectionTitle>
      <CommandBlock commands={CHECK_COMMANDS} />
      <Paragraph>
        Next: <PageLink to={PHASE_2.path}>Phase 2</PageLink>
      </Paragraph>
    </StepPage>
  )
}

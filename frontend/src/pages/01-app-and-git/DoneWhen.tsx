import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle, TextLink } from '../../components/Content'
import { StepPage } from '../../components/StepPage'
import { SITE } from '../../config/site'

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

export function DoneWhen() {
  return (
    <StepPage id="done-when">
      <ul className="divide-y divide-line rounded-md border border-line bg-surface">
        {CHECKS.map(({ key, text }) => (
          <li key={key} className="flex items-start justify-between gap-4 px-4 py-3 leading-7">
            <span className="min-w-0">{text}</span>
            <span className="shrink-0 text-sm leading-7 font-medium text-success">Done</span>
          </li>
        ))}
      </ul>
      <SectionTitle>Commands to check it</SectionTitle>
      <CommandBlock commands={CHECK_COMMANDS} />
      <Paragraph>
        Next: <TextLink href={SITE.phase2Url}>Phase 2</TextLink>
      </Paragraph>
    </StepPage>
  )
}

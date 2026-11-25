import { CommandBlock, type Command } from '../../components/CommandBlock'
import {
  InlineCode,
  Note,
  NumberedList,
  Paragraph,
  SectionTitle,
  TextLink,
} from '../../components/Content'
import { StepPage } from '../../components/StepPage'
import { SITE } from '../../config/site'

const CHECKS = [
  {
    key: 'chmod',
    text: (
      <>
        You can explain <InlineCode>chmod 640</InlineCode>
      </>
    ),
  },
  { key: 'port', text: 'You can find which program uses a port' },
  { key: 'logs', text: 'You can find why a service failed from its logs' },
  { key: 'script', text: 'The script works' },
]

const SAVE: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch phase-2-linux', purpose: 'Use the branch of this phase.' },
  { command: 'git status', purpose: 'See what is not saved yet.' },
  { command: 'git add .', purpose: 'Choose all changes.' },
  { command: 'git commit -m "Complete phase 2"', purpose: 'Save them.' },
  { command: 'git push', purpose: 'Upload the branch.' },
]

const TAG: Command[] = [
  { command: 'git switch main', purpose: 'Go to main.' },
  { command: 'git pull', purpose: 'Get the merged work.' },
  { command: 'git tag -a v0.2.0 -m "Phase 2: Linux"', purpose: 'Mark the end of this phase.' },
  { command: 'git push origin v0.2.0', purpose: 'Upload the tag.' },
]

export function FinalCheck() {
  return (
    <StepPage id="linux-final-check">
      <ul className="divide-y divide-line rounded-md border border-line bg-surface">
        {CHECKS.map(({ key, text }) => (
          <li key={key} className="px-4 py-3 leading-7">
            {text}
          </li>
        ))}
      </ul>
      <SectionTitle>Save the phase</SectionTitle>
      <CommandBlock commands={SAVE} />
      <Paragraph>Then on the GitHub website:</Paragraph>
      <NumberedList>
        <li>
          Create a pull request from <InlineCode>phase-2-linux</InlineCode> to{' '}
          <InlineCode>main</InlineCode>.
        </li>
        <li>
          Click <strong>Merge pull request</strong>.
        </li>
        <li>Keep the branch.</li>
      </NumberedList>
      <SectionTitle>Add the tag</SectionTitle>
      <Note>Do this only after the pull request is merged.</Note>
      <CommandBlock commands={TAG} />
      <Paragraph>
        Next: <TextLink href={SITE.phase3Url}>Phase 3</TextLink>
      </Paragraph>
    </StepPage>
  )
}

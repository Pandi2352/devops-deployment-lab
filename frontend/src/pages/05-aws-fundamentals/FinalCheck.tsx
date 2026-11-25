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
  { key: 'url', text: 'CloudFront URL shows the Git commit version' },
  { key: 'private', text: 'S3 direct URL is denied' },
  { key: 'keys', text: 'No AWS access key exists anywhere' },
  { key: 'vpc', text: 'You can draw a VPC from memory' },
]

const SAVE: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch phase-5-aws-basics', purpose: 'Use the branch of this phase.' },
  { command: 'git pull origin main', purpose: 'Bring in the latest main.' },
  { command: 'git add .', purpose: 'Choose all changes.' },
  { command: 'git status', purpose: 'There must be no key or account number.' },
  { command: 'git commit -m "Complete phase 5"', purpose: 'Save them.' },
  { command: 'git push', purpose: 'Upload the branch.' },
]

const TAG: Command[] = [
  { command: 'git switch main', purpose: 'Go to main.' },
  { command: 'git pull', purpose: 'Get the merged work.' },
  {
    command: 'git tag -a v0.5.0 -m "Phase 5: AWS basics"',
    purpose: 'Mark the end of this phase.',
  },
  { command: 'git push origin v0.5.0', purpose: 'Upload the tag.' },
]

export function FinalCheck() {
  return (
    <StepPage id="aws-final-check">
      <ul className="divide-y divide-line rounded-md border border-line bg-surface">
        {CHECKS.map(({ key, text }) => (
          <li key={key} className="px-4 py-3 leading-7">
            {text}
          </li>
        ))}
      </ul>
      <Note>
        If CloudFront waits for AWS to verify your account, go on with phase 6 and come back.
      </Note>
      <SectionTitle>Save the phase</SectionTitle>
      <CommandBlock commands={SAVE} />
      <Paragraph>Then on the GitHub website:</Paragraph>
      <NumberedList>
        <li>
          Create a pull request from <InlineCode>phase-5-aws-basics</InlineCode> to{' '}
          <InlineCode>main</InlineCode>.
        </li>
        <li>
          Wait until <InlineCode>verify</InlineCode> is green, then click{' '}
          <strong>Merge pull request</strong>.
        </li>
        <li>Keep the branch.</li>
      </NumberedList>
      <SectionTitle>Add the tag</SectionTitle>
      <Note>Do this only after the pull request is merged.</Note>
      <CommandBlock commands={TAG} />
      <Paragraph>
        Next: <TextLink href={SITE.phase6Url}>Phase 6</TextLink>
      </Paragraph>
    </StepPage>
  )
}

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
  { key: 'blocks', text: 'A failing test blocks the merge' },
  {
    key: 'image',
    text: (
      <>
        Merging to <InlineCode>main</InlineCode> publishes an image with the commit SHA tag
      </>
    ),
  },
  { key: 'words', text: 'You can explain trigger, job, step, runner, secret' },
]

const SAVE: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch phase-4-github-actions', purpose: 'Use the branch of this phase.' },
  { command: 'git status', purpose: 'See what is not saved yet.' },
  { command: 'git add .', purpose: 'Choose all changes.' },
  { command: 'git commit -m "Complete phase 4"', purpose: 'Save them.' },
  { command: 'git push', purpose: 'Upload the branch.' },
]

const TAG: Command[] = [
  { command: 'git switch main', purpose: 'Go to main.' },
  { command: 'git pull', purpose: 'Get the merged work.' },
  {
    command: 'git tag -a v0.4.0 -m "Phase 4: GitHub Actions"',
    purpose: 'Mark the end of this phase.',
  },
  { command: 'git push origin v0.4.0', purpose: 'Upload the tag.' },
]

export function FinalCheck() {
  return (
    <StepPage id="actions-final-check">
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
          Create a pull request from <InlineCode>phase-4-github-actions</InlineCode> to{' '}
          <InlineCode>main</InlineCode>.
        </li>
        <li>
          Wait until <InlineCode>verify</InlineCode> is green, then click{' '}
          <strong>Merge pull request</strong>.
        </li>
        <li>Keep the branch.</li>
        <li>
          In the <strong>Actions</strong> tab, check that the image job on main is green.
        </li>
      </NumberedList>
      <SectionTitle>Add the tag</SectionTitle>
      <Note>Do this only after the pull request is merged.</Note>
      <CommandBlock commands={TAG} />
      <Paragraph>
        Next: <TextLink href={SITE.phase5Url}>Phase 5</TextLink>
      </Paragraph>
    </StepPage>
  )
}

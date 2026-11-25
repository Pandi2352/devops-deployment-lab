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
  { key: 'version', text: 'The app runs at http://localhost:8080 with the correct version' },
  {
    key: 'user',
    text: (
      <>
        <InlineCode>docker exec lab id</InlineCode> does not show uid 0 (root)
      </>
    ),
  },
  { key: 'words', text: 'You can explain image vs container vs volume vs network' },
  { key: 'saved', text: 'All files are committed through a pull request' },
]

const SAVE: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch phase-3-docker', purpose: 'Use the branch of this phase.' },
  { command: 'git status', purpose: 'See what is not saved yet.' },
  { command: 'git add .', purpose: 'Choose all changes.' },
  { command: 'git commit -m "Complete phase 3"', purpose: 'Save them.' },
  { command: 'git push', purpose: 'Upload the branch.' },
]

const TAG: Command[] = [
  { command: 'git switch main', purpose: 'Go to main.' },
  { command: 'git pull', purpose: 'Get the merged work.' },
  { command: 'git tag -a v0.3.0 -m "Phase 3: Docker"', purpose: 'Mark the end of this phase.' },
  { command: 'git push origin v0.3.0', purpose: 'Upload the tag.' },
]

export function FinalCheck() {
  return (
    <StepPage id="docker-final-check">
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
          Create a pull request from <InlineCode>phase-3-docker</InlineCode> to{' '}
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
        Next: <TextLink href={SITE.phase4Url}>Phase 4</TextLink>
      </Paragraph>
    </StepPage>
  )
}

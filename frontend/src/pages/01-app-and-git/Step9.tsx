import { CommandBlock, type Command } from '../../components/CommandBlock'
import {
  InlineCode,
  Note,
  NumberedList,
  Paragraph,
  SectionTitle,
} from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const CREATE_BRANCH: Command[] = [
  {
    command: 'git switch -c feat/change-title',
    purpose: 'Create a new branch and move to it. main stays unchanged while you work.',
  },
]

const PUSH_BRANCH: Command[] = [
  {
    command: 'git diff',
    purpose: 'See exactly what you changed before saving it.',
  },
  {
    command: 'git add .',
    purpose: 'Choose all changes for the next commit.',
  },
  {
    command: 'git commit -m "Change landing page text"',
    purpose: 'Save the change on your branch, with a message.',
  },
  {
    command: 'git push -u origin feat/change-title',
    purpose: 'Upload the branch to GitHub, so you can open a pull request.',
  },
]

const UPDATE_MAIN: Command[] = [
  {
    command: 'git switch main',
    purpose: 'Go back to the main branch.',
  },
  {
    command: 'git pull',
    purpose: 'Download the merged change from GitHub.',
  },
]

const DELETE_BRANCH: Command[] = [
  {
    command: 'git branch -d feat/change-title',
    purpose: 'Delete the merged branch from your laptop. Skip this to keep it for learning.',
  },
]

export function Step9() {
  return (
    <StepPage id="step-9">
      <CommandBlock commands={CREATE_BRANCH} />
      <Paragraph>
        Change the paragraph text in <InlineCode>App.tsx</InlineCode>, then:
      </Paragraph>
      <CommandBlock commands={PUSH_BRANCH} />

      <SectionTitle>Then on the GitHub website:</SectionTitle>
      <NumberedList>
        <li>
          Open your repo and click <strong>Compare & pull request</strong> (or Pull requests → New).
        </li>
        <li>
          Base: <InlineCode>main</InlineCode>, compare: <InlineCode>feat/change-title</InlineCode>.
        </li>
        <li>
          Click <strong>Create pull request</strong>.
        </li>
        <li>
          Read your own diff in <strong>Files changed</strong>.
        </li>
        <li>
          Click <strong>Merge pull request</strong>, then <strong>Delete branch</strong>.
        </li>
      </NumberedList>

      <SectionTitle>Back in PowerShell:</SectionTitle>
      <CommandBlock commands={UPDATE_MAIN} />
      <Note>
        Deleting the branch is optional. To keep it for learning, skip{' '}
        <strong>Delete branch</strong> on the website and the command below.
      </Note>
      <CommandBlock commands={DELETE_BRANCH} />
    </StepPage>
  )
}

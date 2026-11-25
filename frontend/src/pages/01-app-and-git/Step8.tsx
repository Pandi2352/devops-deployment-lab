import { CommandBlock, type Command } from '../../components/CommandBlock'
import {
  InlineCode,
  NumberedList,
  Paragraph,
  SectionTitle,
  TextLink,
} from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'
import { SITE } from '../../config/site'

const PUSH_COMMANDS: Command[] = [
  {
    command: 'git remote add origin https://github.com/<GITHUB_USER>/devops-deployment-lab.git',
    purpose: 'Connect your laptop repo to the GitHub repo. origin is its short name.',
  },
  {
    command: 'git branch -M main',
    purpose: 'Rename the current branch to main.',
  },
  {
    command: 'git remote -v',
    purpose: 'Show the connected GitHub address, to check it is correct.',
  },
  {
    command: 'git push -u origin main',
    purpose: 'Upload your commits. -u links the branch, so next time git push is enough.',
  },
]

const SET_URL_COMMAND =
  'git remote set-url origin https://github.com/<GITHUB_USER>/devops-deployment-lab.git'

const PUSH_ERRORS = [
  {
    key: 'remote-exists',
    label: <InlineCode>remote origin already exists</InlineCode>,
    value: (
      <>
        <InlineCode>{SET_URL_COMMAND}</InlineCode>
        <span className="block text-muted">Purpose: change the saved GitHub address.</span>
      </>
    ),
  },
  {
    key: 'no-commit',
    label: <InlineCode>src refspec main does not match any</InlineCode>,
    value: 'You have no commit yet. Do step 7',
  },
  {
    key: 'not-found',
    label: <InlineCode>Repository not found</InlineCode>,
    value: 'Check the username, repo name, and which GitHub account you logged in with',
  },
  {
    key: 'fetch-first',
    label: <InlineCode>rejected ... fetch first</InlineCode>,
    value:
      'The repo was not empty. If it has only the files GitHub created, delete it on GitHub and create it again empty',
  },
]

export function Step8() {
  return (
    <StepPage id="step-8">
      <SectionTitle>Create it:</SectionTitle>
      <NumberedList>
        <li>
          Log in to <TextLink href="https://github.com">github.com</TextLink> and open{' '}
          <TextLink href="https://github.com/new">https://github.com/new</TextLink>
        </li>
        <li>
          Repository name: <InlineCode>devops-deployment-lab</InlineCode> (lowercase, because
          container image names must be lowercase)
        </li>
        <li>
          Visibility: <strong>Public</strong>. For a private repo, first read the GitHub rows in{' '}
          <TextLink href={SITE.costGuideUrl}>COST-GUIDE.md</TextLink>.
        </li>
        <li>
          Leave <strong>README, .gitignore and license off</strong>. The repo must be empty, or your
          first push is rejected.
        </li>
        <li>
          Click <strong>Create repository</strong>.
        </li>
      </NumberedList>

      <SectionTitle>
        Push your code (PowerShell, in <InlineCode>D:\devops\react-devops</InlineCode>):
      </SectionTitle>
      <CommandBlock commands={PUSH_COMMANDS} />
      <Paragraph>
        Replace <InlineCode>{'<GITHUB_USER>'}</InlineCode> with your GitHub username. On the first
        push, a browser window may ask you to log in to GitHub.
      </Paragraph>
      <ReferenceTable
        caption="Push errors and fixes"
        headers={['Error', 'Fix']}
        rows={PUSH_ERRORS}
      />
      <Paragraph>Refresh the GitHub page. You should see your files.</Paragraph>
    </StepPage>
  )
}

import { CommandBlock, type Command } from '../../components/CommandBlock'
import { Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const CHECK_IDENTITY: Command[] = [
  {
    command: 'git config --global user.name',
    purpose: 'Show the name Git writes in your commits.',
  },
  {
    command: 'git config --global user.email',
    purpose: 'Show the email Git writes in your commits. It is public in a public repo.',
  },
]

const SET_IDENTITY: Command[] = [
  {
    command: 'git config --global user.name "Your Name"',
    purpose: 'Set your name. Needed only once on a laptop.',
  },
  {
    command: 'git config --global user.email "your-github-email"',
    purpose: 'Set your email. Use the same email as your GitHub account.',
  },
]

const FIRST_COMMIT: Command[] = [
  {
    command: 'cd D:\\devops\\react-devops',
    purpose: 'Go to the project root.',
  },
  {
    command: 'git init',
    purpose: 'Start Git in this folder. It creates a hidden .git folder.',
  },
  {
    command: 'git status',
    purpose: 'Show new and changed files. node_modules and dist must not be listed.',
  },
  {
    command: 'git add .',
    purpose: 'Choose all changes for the next commit.',
  },
  {
    command: 'git commit -m "Create React app and docs"',
    purpose: 'Save the chosen changes on your laptop, with a message.',
  },
  {
    command: 'git log --oneline',
    purpose: 'Show your commits, one per line, to confirm it worked.',
  },
]

export function Step7() {
  return (
    <StepPage id="step-7">
      <SectionTitle>Check your Git name and email</SectionTitle>
      <CommandBlock commands={CHECK_IDENTITY} />
      <Paragraph>If one of them prints nothing, set it:</Paragraph>
      <CommandBlock commands={SET_IDENTITY} />
      <SectionTitle>Make the commit</SectionTitle>
      <CommandBlock commands={FIRST_COMMIT} />
    </StepPage>
  )
}

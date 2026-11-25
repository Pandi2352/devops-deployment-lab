import { InlineCode, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

interface CommandGroup {
  title: string
  items: { commands: string[]; use: string }[]
}

const GROUPS: CommandGroup[] = [
  {
    title: 'Git: every day',
    items: [
      { commands: ['git status'], use: 'What changed' },
      { commands: ['git diff'], use: 'Exact changes' },
      { commands: ['git add .'], use: 'Choose all changes for the next commit' },
      { commands: ['git commit -m "message"'], use: 'Save the chosen changes' },
      { commands: ['git push'], use: 'Upload commits to GitHub' },
      { commands: ['git pull'], use: 'Get remote changes' },
      { commands: ['git log --oneline --graph'], use: 'History' },
    ],
  },
  {
    title: 'Git: branches',
    items: [
      { commands: ['git branch -a'], use: 'List all branches, on your laptop and GitHub' },
      { commands: ['git switch -c name'], use: 'New branch' },
      { commands: ['git switch main'], use: 'Move to an existing branch' },
      { commands: ['git merge name'], use: 'Bring another branch into the current branch' },
      { commands: ['git merge --abort'], use: 'Cancel a merge that has a conflict' },
    ],
  },
  {
    title: 'Git: undo and put aside',
    items: [
      { commands: ['git revert <commit>'], use: 'Safely undo a commit' },
      {
        commands: ['git reset --soft HEAD~1'],
        use: 'Remove the last commit that is not pushed yet, and keep its changes',
      },
      { commands: ['git stash', 'git stash pop'], use: 'Put work aside' },
    ],
  },
  {
    title: 'Git: setup',
    items: [
      { commands: ['git init'], use: 'Start Git in a folder' },
      { commands: ['git config --global user.name "Your Name"'], use: 'Set your commit name' },
      { commands: ['git remote -v'], use: 'Show the connected GitHub address' },
      { commands: ['git branch -M main'], use: 'Rename the current branch to main' },
    ],
  },
  {
    title: 'npm',
    items: [
      { commands: ['npm install'], use: 'Download the packages of a project' },
      { commands: ['npm install name'], use: 'Add a package' },
      { commands: ['npm install -D name'], use: 'Add a package only for development' },
      { commands: ['npm run dev'], use: 'Start the app while you work' },
      { commands: ['npm run lint'], use: 'Check the code for mistakes' },
      { commands: ['npm test'], use: 'Run the tests' },
      { commands: ['npm run build'], use: 'Create the production files in dist' },
      { commands: ['npm run preview'], use: 'Open the built files' },
    ],
  },
]

function getRows(items: CommandGroup['items']) {
  return items.map(({ commands, use }) => ({
    key: commands[0],
    label: commands.map((command, index) => (
      <span key={command}>
        {index > 0 && ' / '}
        <InlineCode>{command}</InlineCode>
      </span>
    )),
    value: use,
  }))
}

export function Commands() {
  return (
    <StepPage id="commands">
      {GROUPS.map(({ title, items }) => (
        <section key={title} className="space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <ReferenceTable caption={title} headers={['Command', 'Use']} rows={getRows(items)} />
        </section>
      ))}
    </StepPage>
  )
}

import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCommand } from '../../components/CommandText'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const START_A: Command[] = [
  { command: 'git switch main', purpose: 'Start from main.' },
  { command: 'git pull', purpose: 'Get the latest main.' },
  { command: 'git switch -c practice/conflict-a', purpose: 'Create the first branch.' },
]

const COMMIT_A: Command[] = [
  { command: 'git add README.md', purpose: 'Choose only this file.' },
  { command: 'git commit -m "Change line in branch A"', purpose: 'Save the first version.' },
  { command: 'git switch main', purpose: 'Go back, so branch B also starts from main.' },
  { command: 'git switch -c practice/conflict-b', purpose: 'Create the second branch.' },
]

const COMMIT_B: Command[] = [
  { command: 'git add README.md', purpose: 'Choose only this file.' },
  { command: 'git commit -m "Change line in branch B"', purpose: 'Save the second version.' },
  {
    command: 'git merge practice/conflict-a',
    purpose: 'Bring branch A into branch B. Git reports CONFLICT, because both changed one line.',
  },
  { command: 'git status', purpose: 'Show which file has the conflict.' },
]

const FINISH_MERGE: Command[] = [
  { command: 'git add README.md', purpose: 'Tell Git the conflict in this file is fixed.' },
  { command: 'git commit -m "Fix merge conflict"', purpose: 'Finish the merge.' },
  { command: 'git log --oneline --graph --all', purpose: 'See both branches join.' },
]

const CANCEL_MERGE: Command[] = [
  { command: 'git merge --abort', purpose: 'Cancel the merge and go back to before it.' },
]

const START_MISTAKE: Command[] = [
  { command: 'git switch main', purpose: 'Start from main.' },
  { command: 'git pull', purpose: 'Get the latest main.' },
  { command: 'git switch -c practice/mistake', purpose: 'Create a branch for the mistake.' },
]

const PUSH_MISTAKE: Command[] = [
  { command: 'git add README.md', purpose: 'Choose only this file.' },
  { command: 'git commit -m "Add a mistake"', purpose: 'Save the mistake.' },
  { command: 'git push -u origin practice/mistake', purpose: 'Upload it for a pull request.' },
]

const FIND_MISTAKE: Command[] = [
  { command: 'git switch main', purpose: 'Go back to main.' },
  { command: 'git pull', purpose: 'Get the merged mistake.' },
  {
    command: 'git log --oneline -5',
    purpose: 'Find the id of the commit named "Add a mistake". Do not use the merge commit.',
  },
  { command: 'git switch -c practice/revert', purpose: 'Create a branch for the fix.' },
]

const REVERT_MISTAKE: Command[] = [
  {
    command: 'git revert --no-edit <commit>',
    purpose: 'Make a new commit that undoes the mistake. The history stays complete.',
  },
  { command: 'git push -u origin practice/revert', purpose: 'Upload it for a pull request.' },
]

const UPDATE_MAIN: Command[] = [
  { command: 'git switch main', purpose: 'Go back to main.' },
  { command: 'git pull', purpose: 'Get the fix. The mistake is gone.' },
]

export function BreakIt() {
  return (
    <StepPage id="break-it">
      <NumberedList>
        <li>
          Make two branches that edit the same line. Merge both and fix the{' '}
          <strong>merge conflict</strong>.
        </li>
        <li>
          Commit a mistake, merge it, then undo it with <InlineCommand command="git revert" />.
        </li>
      </NumberedList>
      <Note>
        Before you start, run <InlineCommand command="git status" />. Commit your other work first, so
        it does not mix with the practice.
      </Note>

      <SectionTitle>Practice 1: merge conflict</SectionTitle>
      <CommandBlock commands={START_A} />
      <Paragraph>
        Change the second line of text in <InlineCode>README.md</InlineCode> (A small React app...),
        save it, then:
      </Paragraph>
      <CommandBlock commands={COMMIT_A} />
      <Paragraph>Change the same line to different text, save it, then:</Paragraph>
      <CommandBlock commands={COMMIT_B} />
      <Paragraph>
        Open <InlineCode>README.md</InlineCode>. Keep the text you want and delete the three marker
        lines that start with <InlineCode>{'<<<<<<<'}</InlineCode>,{' '}
        <InlineCode>=======</InlineCode> and <InlineCode>{'>>>>>>>'}</InlineCode>. Save it, then:
      </Paragraph>
      <CommandBlock commands={FINISH_MERGE} />
      <Paragraph>If you get lost before the last commit:</Paragraph>
      <CommandBlock commands={CANCEL_MERGE} />

      <SectionTitle>Practice 2: undo with git revert</SectionTitle>
      <CommandBlock commands={START_MISTAKE} />
      <Paragraph>
        Add a wrong line in <InlineCode>README.md</InlineCode>, save it, then:
      </Paragraph>
      <CommandBlock commands={PUSH_MISTAKE} />
      <Paragraph>Create and merge the pull request on the GitHub website, then:</Paragraph>
      <CommandBlock commands={FIND_MISTAKE} />
      <Paragraph>
        Replace <InlineCode>{'<commit>'}</InlineCode> with the id you found:
      </Paragraph>
      <CommandBlock commands={REVERT_MISTAKE} />
      <Paragraph>Create and merge this pull request too, then:</Paragraph>
      <CommandBlock commands={UPDATE_MAIN} />
    </StepPage>
  )
}

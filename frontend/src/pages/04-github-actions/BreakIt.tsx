import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const START: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch phase-4-github-actions', purpose: 'Use the branch of this phase.' },
  { command: 'git pull origin main', purpose: 'Bring in the latest main.' },
]

const BREAK_BUILD: Command[] = [
  {
    command: 'Add-Content frontend\\src\\config\\site.ts "export const size: number = \'big\'"',
    purpose: 'Add a line with a type mistake: text in a number.',
  },
  { command: 'git add .', purpose: 'Choose the change.' },
  { command: 'git commit -m "Practice: break the build"', purpose: 'Save it.' },
  { command: 'git push', purpose: 'Let CI check it. Open a pull request once.' },
]

const FIX_BUILD: Command[] = [
  {
    command: 'git restore --source origin/main frontend/src/config/site.ts',
    purpose: 'Bring back the working file from main.',
  },
  { command: 'cd frontend', purpose: 'Go to the app folder.' },
  { command: 'npm run build', purpose: 'Check on your laptop before you push.' },
  { command: 'cd ..', purpose: 'Go back to the project root.' },
  { command: 'git add .', purpose: 'Choose the fix.' },
  { command: 'git commit -m "Fix the build"', purpose: 'Save it.' },
  { command: 'git push', purpose: 'CI runs again and turns green.' },
  {
    command: 'git diff origin/main --stat',
    purpose: 'It must print nothing: the branch equals main.',
  },
]

const FAILURES = [
  {
    key: 'lint',
    label: 'Unused variable in a file',
    value: 'npm run lint fails',
  },
  {
    key: 'test',
    label: (
      <>
        <InlineCode>DevOps Lab</InlineCode> → <InlineCode>Wrong title</InlineCode> in App.test.tsx
      </>
    ),
    value: 'npm test fails',
  },
  {
    key: 'build',
    label: 'Text in a number variable',
    value: 'npm run build fails with TS2322',
  },
  {
    key: 'yaml',
    label: 'One extra space before steps in ci.yml',
    value: 'Invalid workflow file. No job runs',
  },
  {
    key: 'permission',
    label: (
      <>
        Remove <InlineCode>packages: write</InlineCode>
      </>
    ),
    value: 'The image job cannot upload. You see it only after a merge',
  },
]

export function BreakIt() {
  return (
    <StepPage id="actions-break-it">
      <Note>Do not merge a broken change, and do not use a bypass option.</Note>
      <SectionTitle>Ways to break it</SectionTitle>
      <ReferenceTable caption="Failures" headers={['Change', 'Result']} rows={FAILURES} />
      <SectionTitle>Example: break the build</SectionTitle>
      <CommandBlock commands={START} />
      <CommandBlock commands={BREAK_BUILD} />
      <Paragraph>On GitHub, open the red check and answer:</Paragraph>
      <NumberedList>
        <li>Which step is red: lint, test or build?</li>
        <li>Which file and line does the error show?</li>
        <li>Is the merge button blocked?</li>
      </NumberedList>
      <SectionTitle>Fix it</SectionTitle>
      <CommandBlock commands={FIX_BUILD} />
    </StepPage>
  )
}

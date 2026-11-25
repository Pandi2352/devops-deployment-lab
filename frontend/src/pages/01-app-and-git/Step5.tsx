import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const GO_TO_APP: Command[] = [
  {
    command: 'cd D:\\devops\\react-devops\\frontend',
    purpose: 'Go to the app folder. npm reads the scripts from its package.json.',
  },
]

const RUN_COMMANDS: Command[] = [
  {
    command: 'npm run dev',
    purpose: 'Start the app at http://localhost:5173. The page updates when you save a file.',
  },
  {
    command: 'npm run lint',
    purpose: 'Check the code for mistakes.',
  },
  {
    command: 'npm test',
    purpose: 'Run the tests.',
  },
  {
    command: 'npm run build',
    purpose: 'Check the types and create the production files in dist.',
  },
  {
    command: 'npm run preview',
    purpose: 'Open the built files from dist at http://localhost:4173, to check them before deploy.',
  },
]

export function Step5() {
  return (
    <StepPage id="step-5">
      <CommandBlock commands={GO_TO_APP} />
      <Note>Run these one by one, not all together.</Note>
      <CommandBlock commands={RUN_COMMANDS} />
      <Paragraph>
        <InlineCode>dev</InlineCode> and <InlineCode>preview</InlineCode> keep running; stop them
        with Ctrl+C. After <InlineCode>build</InlineCode>, look inside{' '}
        <InlineCode>dist</InlineCode>: <strong>this folder is what we deploy</strong>.
      </Paragraph>
    </StepPage>
  )
}

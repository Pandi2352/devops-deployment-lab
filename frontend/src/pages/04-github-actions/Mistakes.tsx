import { InlineCommand } from '../../components/CommandText'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const WORK_ERRORS = [
  {
    key: 'identical',
    label: <InlineCode>main and phase-4 are identical</InlineCode>,
    value: (
      <>
        Your change is not pushed. Check <InlineCommand command="git status" />, then save, commit
        and push
      </>
    ),
  },
  {
    key: 'nothing',
    label: <InlineCode>nothing to commit</InlineCode>,
    value: 'The file was not saved in VS Code. Press Ctrl+S',
  },
  {
    key: 'sed',
    label: <InlineCode>The term 'sed' is not recognized</InlineCode>,
    value: 'sed is a Linux command. Run it in Ubuntu, not PowerShell',
  },
  {
    key: 'split',
    label: <InlineCode>docker run requires at least 1 argument</InlineCode>,
    value: 'The command was split into two lines. Save the long name in a variable',
  },
  {
    key: 'rules',
    label: 'No edit button on the ruleset page',
    value: 'It is the read-only page. Open it through Settings, Rules, Rulesets',
  },
  {
    key: 'gh013',
    label: <InlineCode>GH013: Repository rule violations</InlineCode>,
    value: 'You pushed to main. Use the phase branch and a pull request',
  },
]

const RUN_ERRORS = [
  {
    key: 'invalid',
    label: <InlineCode>Invalid workflow file</InlineCode>,
    value: 'Wrong spaces or a tab in the YAML. The message shows the line',
  },
  {
    key: 'lock',
    label: <InlineCode>npm ci ... not in sync</InlineCode>,
    value: 'Run npm install in frontend, then commit package-lock.json',
  },
  {
    key: 'ts',
    label: <InlineCode>error TS2322</InlineCode>,
    value: 'Type mistake. Only npm run build finds it, not lint or test here',
  },
  {
    key: 'assert',
    label: <InlineCode>AssertionError</InlineCode>,
    value: 'A test failed. It shows what it expected and what it got',
  },
  {
    key: 'denied',
    label: <InlineCode>denied: permission_denied: write_package</InlineCode>,
    value: 'packages: write is missing in the job or in the job that calls it',
  },
  {
    key: 'skipped',
    label: 'image is skipped',
    value: 'Normal in a pull request. It runs only on main, after verify passes',
  },
  {
    key: 'expected',
    label: 'Required check waits forever',
    value: 'The job name does not match. It must be exactly verify',
  },
  {
    key: 'unauthorized',
    label: <InlineCode>unauthorized</InlineCode>,
    value: 'The image is private, or its name is wrong. Use lowercase',
  },
]

export function Mistakes() {
  return (
    <StepPage id="actions-mistakes">
      <Paragraph>Open the red step and read its last lines first.</Paragraph>
      <SectionTitle>On your laptop and the website</SectionTitle>
      <ReferenceTable
        caption="Laptop and website mistakes"
        headers={['You see', 'Fix']}
        rows={WORK_ERRORS}
      />
      <SectionTitle>In a workflow run</SectionTitle>
      <ReferenceTable caption="Workflow errors" headers={['You see', 'Fix']} rows={RUN_ERRORS} />
    </StepPage>
  )
}

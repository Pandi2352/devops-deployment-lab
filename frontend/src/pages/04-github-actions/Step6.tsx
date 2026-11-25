import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const TYPES = [
  {
    key: 'variable',
    label: (
      <>
        Variable <InlineCode>vars.NAME</InlineCode>
      </>
    ),
    value: 'Not secret, such as region or bucket name',
  },
  {
    key: 'secret',
    label: (
      <>
        Secret <InlineCode>secrets.NAME</InlineCode>
      </>
    ),
    value: 'Hidden in logs, such as a token',
  },
  {
    key: 'environment',
    label: 'Environment',
    value: 'Group with rules, such as aws with approval',
  },
]

const SETTINGS = [
  { key: 'reviewer', label: 'Required reviewers', value: 'You. A deploy waits for your approval' },
  { key: 'self', label: 'Prevent self-review', value: 'Off, because you work alone' },
  { key: 'branch', label: 'Deployment branches', value: 'Only main can deploy' },
]

export function Step6() {
  return (
    <StepPage id="actions-step-6">
      <ReferenceTable caption="Settings types" headers={['Type', 'Use']} rows={TYPES} />
      <SectionTitle>Create the aws environment</SectionTitle>
      <NumberedList>
        <li>
          Repo → <strong>Settings</strong> → <strong>Environments</strong> →{' '}
          <strong>New environment</strong>.
        </li>
        <li>
          Name: <InlineCode>aws</InlineCode> → <strong>Configure environment</strong>.
        </li>
        <li>
          Tick <strong>Required reviewers</strong>. Type your GitHub username and click your name in
          the list.
        </li>
        <li>
          Leave <strong>Prevent self-review</strong> unticked.
        </li>
        <li>
          Click <strong>Save protection rules</strong>.
        </li>
        <li>
          Under <strong>Deployment branches and tags</strong>, choose{' '}
          <strong>Selected branches and tags</strong> → <strong>Add rule</strong> →{' '}
          <InlineCode>main</InlineCode>.
        </li>
      </NumberedList>
      <SectionTitle>Check it</SectionTitle>
      <ReferenceTable caption="Environment" headers={['Setting', 'Value']} rows={SETTINGS} />
      <Note>
        If the branch rule is missing, a workflow on any branch could ask to deploy to AWS.
      </Note>
      <Paragraph>You use this environment in phase 5.</Paragraph>
    </StepPage>
  )
}

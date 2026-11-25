import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const GET_ARN: Command[] = [
  {
    command:
      'aws iam get-role --role-name github-devops-lab \\\n  --query Role.Arn --output text',
    purpose: 'Show the address (ARN) of the role. Copy the whole line.',
  },
]

const VARIABLES = [
  { key: 'region', label: <InlineCode>AWS_REGION</InlineCode>, value: 'ap-southeast-2' },
  { key: 'bucket', label: <InlineCode>S3_BUCKET</InlineCode>, value: 'Your bucket name' },
]

const SECRETS = [
  {
    key: 'role',
    label: <InlineCode>AWS_ROLE_ARN</InlineCode>,
    value: 'The line from the command above',
  },
]

export function Step8() {
  return (
    <StepPage id="aws-step-8">
      <SectionTitle>1. Get the role address</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={GET_ARN} />
      <SectionTitle>2. Add the settings</SectionTitle>
      <NumberedList>
        <li>
          Repo → <strong>Settings</strong> → <strong>Environments</strong> →{' '}
          <InlineCode>aws</InlineCode>.
        </li>
        <li>
          <strong>Environment secrets</strong> → <strong>Add environment secret</strong>:
        </li>
      </NumberedList>
      <ReferenceTable caption="Secrets" headers={['Secret', 'Value']} rows={SECRETS} />
      <Paragraph>
        <strong>Environment variables</strong> → <strong>Add environment variable</strong>:
      </Paragraph>
      <ReferenceTable caption="Variables" headers={['Variable', 'Value']} rows={VARIABLES} />
      <Note>
        The role address is not a password. It is a secret here because logs of a public repo can be
        read by everyone, and it contains your account number.
      </Note>
      <Paragraph>
        Use the <InlineCode>aws</InlineCode> environment, not the repository secrets. Then only an
        approved deploy from main can use them.
      </Paragraph>
    </StepPage>
  )
}

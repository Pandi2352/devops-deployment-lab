import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const BREAK: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the project root.' },
  { command: 'R=github-devops-lab', purpose: 'The role name.' },
  { command: 'N=s3-deploy', purpose: 'The policy name.' },
  {
    command: 'S=\'s/"s3:PutObject", "s3:DeleteObject"/"s3:GetObject"/\'',
    purpose: 'What to replace.',
  },
  {
    command: 'sed "$S" aws/s3-deploy-policy.json > /tmp/broken.json',
    purpose: 'Make a broken copy. The real file is not changed.',
  },
  { command: 'grep s3:GetObject /tmp/broken.json', purpose: 'Check that it is broken.' },
  { command: 'P=file:///tmp/broken.json', purpose: 'Use the broken copy.' },
  {
    command:
      'aws iam put-role-policy --role-name $R \\\n  --policy-name $N --policy-document $P',
    purpose: 'Take away the upload right.',
  },
]

const FIX: Command[] = [
  { command: 'P=file://aws/s3-deploy-policy.json', purpose: 'Use the correct file.' },
  {
    command:
      'aws iam put-role-policy --role-name $R \\\n  --policy-name $N --policy-document $P',
    purpose: 'Give the right back.',
  },
  {
    command:
      "aws iam get-role-policy --role-name $R --policy-name $N \\\n  --query 'PolicyDocument.Statement[].Action'",
    purpose: 'Check it: ListBucket, PutObject and DeleteObject.',
  },
]

export function BreakIt() {
  return (
    <StepPage id="aws-break-it">
      <SectionTitle>1. Wrong branch</SectionTitle>
      <NumberedList>
        <li>
          <strong>Actions</strong> → <strong>Deploy</strong> → <strong>Run workflow</strong>.
        </li>
        <li>
          Choose the branch <InlineCode>phase-5-aws-basics</InlineCode>, target{' '}
          <InlineCode>s3</InlineCode>.
        </li>
        <li>It must fail at once, because only main may deploy.</li>
      </NumberedList>
      <SectionTitle>2. Missing permission</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={BREAK} />
      <Paragraph>
        Wait one minute. Run Deploy from main and approve it. Upload turns red with{' '}
        <InlineCode>AccessDenied</InlineCode> and <InlineCode>PutObject</InlineCode>.
      </Paragraph>
      <SectionTitle>Fix it</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={FIX} />
      <Paragraph>Wait one minute and run Deploy again. It must be green.</Paragraph>
      <Note>
        AWS tells you which permission is missing. Add only that one, never admin access.
      </Note>
    </StepPage>
  )
}

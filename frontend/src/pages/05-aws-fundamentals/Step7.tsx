import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const PROVIDER: Command[] = [
  { command: 'export AWS_PAGER=""', purpose: 'Print directly.' },
  {
    command: 'aws iam list-open-id-connect-providers',
    purpose: 'Is GitHub already there? An empty list means no.',
  },
  {
    command: 'U=https://token.actions.githubusercontent.com',
    purpose: 'The address of GitHub.',
  },
  { command: 'C=sts.amazonaws.com', purpose: 'Who the identity is for.' },
  {
    command: 'aws iam create-open-id-connect-provider \\\n  --url $U --client-id-list $C',
    purpose: 'Tell AWS to trust GitHub.',
  },
]

const IDS: Command[] = [
  {
    command: 'API=https://api.github.com/repos/<GITHUB_USER>/devops-deployment-lab',
    purpose: 'Save the address of your repo.',
  },
  {
    command: "curl -s $API | grep -m2 '\"id\"'",
    purpose: 'The first number is the repo id, the second is your owner id. Both are public.',
  },
]

const TRUST = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_USER>@<OWNER_ID>/devops-deployment-lab@<REPO_ID>:environment:aws"
        }
      }
    }
  ]
}`

const POLICY = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::<BUCKET>"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::<BUCKET>/*"
    }
  ]
}`

const ROLE: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the project root.' },
  {
    command: 'A=$(aws sts get-caller-identity \\\n  --query Account --output text)',
    purpose: 'Save your account number, without showing it.',
  },
  {
    command: 'sed "s/ACCOUNT_ID/$A/" aws/github-trust.json > /tmp/trust.json',
    purpose: 'Put it in a temporary copy. The file in Git stays clean.',
  },
  { command: 'R=github-devops-lab', purpose: 'The role name.' },
  { command: 'P=file:///tmp/trust.json', purpose: 'The trust file.' },
  {
    command:
      'aws iam create-role --role-name $R \\\n  --assume-role-policy-document $P --query Role.RoleName',
    purpose: 'Create the role GitHub uses.',
  },
  { command: 'N=s3-deploy', purpose: 'The policy name.' },
  { command: 'P=file://aws/s3-deploy-policy.json', purpose: 'The permission file.' },
  {
    command:
      'aws iam put-role-policy --role-name $R \\\n  --policy-name $N --policy-document $P',
    purpose: 'Give the role its permissions.',
  },
  { command: 'aws iam list-role-policies --role-name $R', purpose: 'Check: s3-deploy.' },
]

const FILES = [
  {
    key: 'trust',
    label: <InlineCode>github-trust.json</InlineCode>,
    value: 'Who may log in: only your repo, only its aws environment',
  },
  {
    key: 'policy',
    label: <InlineCode>s3-deploy-policy.json</InlineCode>,
    value: 'What it may do: only this one bucket',
  },
]

export function Step7() {
  return (
    <StepPage id="aws-step-7">
      <Paragraph>
        GitHub shows AWS a signed identity, and AWS gives a temporary login. Nothing is stored.
        This is called OIDC.
      </Paragraph>
      <SectionTitle>1. Trust GitHub</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PROVIDER} />
      <SectionTitle>2. Get your GitHub ids</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={IDS} />
      <Note>
        Repos created after 15 July 2026 have these numbers in their identity. Older tutorials miss
        them and fail.
      </Note>
      <SectionTitle>3. Two files</SectionTitle>
      <ReferenceTable caption="IAM files" headers={['File', 'Purpose']} rows={FILES} />
      <CodeBlock
        language="JSON"
        file="aws/github-trust.json"
        note="replace every <...>, keep the word ACCOUNT_ID"
        purpose="Who may use the role."
        code={TRUST}
      />
      <CodeBlock
        language="JSON"
        file="aws/s3-deploy-policy.json"
        note="replace <BUCKET>"
        purpose="What the role may do."
        code={POLICY}
      />
      <SectionTitle>4. Create the role</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={ROLE} />
    </StepPage>
  )
}

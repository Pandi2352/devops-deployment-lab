import { InlineCommand } from '../../components/CommandText'
import { SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

interface CommandGroup {
  title: string
  items: { command: string; use: string }[]
}

const GROUPS: CommandGroup[] = [
  {
    title: 'Login',
    items: [
      { command: 'aws login --remote', use: 'Log in' },
      { command: 'aws logout', use: 'Log out' },
      { command: 'aws configure list', use: 'Region and login type' },
      { command: 'aws sts get-caller-identity', use: 'Who am I. It shows your account number' },
    ],
  },
  {
    title: 'S3',
    items: [
      { command: 'aws s3 ls', use: 'List buckets' },
      { command: 'aws s3 ls s3://<BUCKET> --recursive', use: 'List files' },
      { command: 'aws s3 mb s3://<BUCKET>', use: 'Make a bucket' },
      { command: 'aws s3 cp <FILE> s3://<BUCKET>/', use: 'Upload one file' },
      { command: 'aws s3 sync <FOLDER> s3://<BUCKET>', use: 'Upload a folder' },
    ],
  },
  {
    title: 'Network and servers',
    items: [
      { command: 'aws ec2 describe-vpcs', use: 'List networks' },
      { command: 'aws ec2 describe-subnets', use: 'List subnets' },
      { command: 'aws ec2 describe-security-groups', use: 'List firewalls' },
      { command: 'aws ec2 describe-instances', use: 'List servers' },
    ],
  },
  {
    title: 'IAM',
    items: [
      { command: 'aws iam get-role --role-name <ROLE>', use: 'Show a role' },
      { command: 'aws iam list-role-policies --role-name <ROLE>', use: 'List its policies' },
      { command: 'aws iam list-open-id-connect-providers', use: 'List trusted logins' },
    ],
  },
  {
    title: 'Useful options',
    items: [
      { command: 'aws s3 ls --region <REGION>', use: 'Use another region once' },
      { command: 'aws ec2 describe-vpcs --output table', use: 'Show a table' },
      { command: 'aws ec2 describe-vpcs --query "Vpcs[].VpcId"', use: 'Show only some values' },
    ],
  },
]

export function Commands() {
  return (
    <StepPage id="aws-commands">
      {GROUPS.map(({ title, items }) => (
        <section key={title} className="space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <ReferenceTable
            caption={title}
            headers={['Command', 'Use']}
            rows={items.map(({ command, use }) => ({
              key: command,
              label: <InlineCommand command={command} />,
              value: use,
            }))}
          />
        </section>
      ))}
    </StepPage>
  )
}

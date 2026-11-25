import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const KEEP = [
  { key: 's3', label: 'S3 bucket', value: 'Keep. Costs cents' },
  { key: 'cf', label: 'CloudFront', value: 'Keep. Free at this size' },
  { key: 'role', label: 'Role and OIDC provider', value: 'Keep. Free, used in phase 6' },
  { key: 'budget', label: 'Budget alert', value: 'Keep. Free' },
  { key: 'vpc', label: 'lab-vpc', value: 'Delete after practice' },
]

const CHECK: Command[] = [
  { command: 'export AWS_PAGER=""', purpose: 'Print directly.' },
  { command: 'aws s3 ls', purpose: 'Your buckets. Do not touch other projects.' },
  {
    command: "Q='Reservations[].Instances[].[InstanceId,State.Name]'",
    purpose: 'Choose the columns.',
  },
  {
    command: 'aws ec2 describe-instances --query "$Q" --output table',
    purpose: 'Servers. Nothing printed means none.',
  },
  {
    command: "Q='NatGateways[].[NatGatewayId,State]'",
    purpose: 'Choose the columns.',
  },
  {
    command: 'aws ec2 describe-nat-gateways --query "$Q" --output table',
    purpose: 'NAT gateways. There must be none.',
  },
]

const DELETE: Command[] = [
  { command: 'B=<BUCKET>', purpose: 'Only the lab bucket.' },
  { command: 'echo $B', purpose: 'Check the name again.' },
  { command: 'aws s3 rb s3://$B --force', purpose: 'Delete all files and the bucket. No undo.' },
]

export function Cleanup() {
  return (
    <StepPage id="aws-cleanup">
      <SectionTitle>Keep or delete</SectionTitle>
      <ReferenceTable caption="Resources" headers={['Resource', 'What to do']} rows={KEEP} />
      <SectionTitle>Check for costs</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHECK} />
      <Paragraph>
        Once a week, look at Billing → <strong>Credits</strong>.
      </Paragraph>
      <SectionTitle>Delete everything (only at the end)</SectionTitle>
      <NumberedList>
        <li>CloudFront: disable the distribution, wait, then delete it.</li>
        <li>Then delete the bucket:</li>
      </NumberedList>
      <Note>
        <InlineCode>--force</InlineCode> deletes all files. Never use it with the bucket of another
        project.
      </Note>
      <CommandBlock terminal="Ubuntu" commands={DELETE} />
    </StepPage>
  )
}

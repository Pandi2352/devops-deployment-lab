import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const CHECK: Command[] = [
  { command: 'F=Name=tag:Name,Values=lab-vpc', purpose: 'Search for the name lab-vpc.' },
  {
    command:
      "VPC=$(aws ec2 describe-vpcs --filters $F \\\n  --query 'Vpcs[0].VpcId' --output text)",
    purpose: 'Save the id of your VPC.',
  },
  { command: 'echo $VPC', purpose: 'Show it. None means a wrong name or region.' },
  {
    command: "Q='RouteTables[].Routes[].[DestinationCidrBlock,GatewayId]'",
    purpose: 'Choose the columns.',
  },
  { command: 'V=Name=vpc-id,Values=$VPC', purpose: 'Only your VPC.' },
  {
    command: 'aws ec2 describe-route-tables --filters $V \\\n  --query "$Q" --output table',
    purpose: 'You must see 0.0.0.0/0 with igw. local appears twice, this is normal.',
  },
]

const AFTER: Command[] = [
  { command: "Q='Vpcs[].[CidrBlock,IsDefault]'", purpose: 'Choose the columns.' },
  {
    command: 'aws ec2 describe-vpcs --query "$Q" --output table',
    purpose: 'Only the default network (True) must remain.',
  },
]

export function Step4() {
  return (
    <StepPage id="aws-step-4">
      <Paragraph>
        Build it once by hand, and the Terraform code in phase 10 makes sense. It is free.
      </Paragraph>
      <SectionTitle>Create it in the VPC console</SectionTitle>
      <NumberedList>
        <li>
          <strong>Create VPC</strong> → <strong>VPC only</strong>. Name{' '}
          <InlineCode>lab-vpc</InlineCode>, IPv4 <InlineCode>10.0.0.0/16</InlineCode>.
        </li>
        <li>
          <strong>Create subnet</strong> in lab-vpc. Name <InlineCode>lab-public</InlineCode>, IPv4{' '}
          <InlineCode>10.0.1.0/24</InlineCode>.
        </li>
        <li>
          <strong>Create internet gateway</strong> <InlineCode>lab-igw</InlineCode> → Actions →
          Attach to lab-vpc.
        </li>
        <li>
          <strong>Create route table</strong> <InlineCode>lab-rt</InlineCode> in lab-vpc → Edit
          routes → add <InlineCode>0.0.0.0/0</InlineCode> to lab-igw.
        </li>
        <li>
          In lab-rt → <strong>Subnet associations</strong> → tick lab-public. Now it is public.
        </li>
        <li>
          <strong>Create security group</strong> <InlineCode>lab-web</InlineCode> in lab-vpc, inbound
          HTTP from anywhere.
        </li>
      </NumberedList>
      <Note>Choose VPC only, not VPC and more. Do not create a NAT gateway.</Note>
      <SectionTitle>Check it</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHECK} />
      <SectionTitle>Delete it</SectionTitle>
      <Paragraph>
        Your VPCs → tick only <InlineCode>lab-vpc</InlineCode> → Actions → Delete VPC. Never delete
        the default VPC (<InlineCode>172.31.0.0/16</InlineCode>). Phase 6 uses it.
      </Paragraph>
      <CommandBlock terminal="Ubuntu" commands={AFTER} />
      <SectionTitle>Small test</SectionTitle>
      <NumberedList>
        <li>What made lab-public public?</li>
        <li>Which one says where traffic goes: route table or security group?</li>
        <li>Which one says if it is allowed?</li>
      </NumberedList>
    </StepPage>
  )
}

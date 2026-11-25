import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const WORDS = [
  { key: 'vpc', label: 'VPC', value: 'Your private network' },
  { key: 'subnet', label: 'Subnet', value: 'One part of that network, in one zone' },
  { key: 'igw', label: 'Internet gateway', value: 'Door to the internet' },
  { key: 'route', label: 'Route table', value: 'Map of where traffic goes' },
  { key: 'public', label: 'Public subnet', value: 'Has a route to the internet gateway' },
  { key: 'private', label: 'Private subnet', value: 'Has no such route' },
  { key: 'sg', label: 'Security group', value: 'Firewall for one resource' },
  { key: 'eip', label: 'Elastic IP', value: 'Fixed public IP (paid)' },
]

const LOOK: Command[] = [
  { command: 'export AWS_PAGER=""', purpose: 'Print directly.' },
  { command: "Q='Vpcs[].[VpcId,CidrBlock,IsDefault]'", purpose: 'Choose the columns.' },
  {
    command: 'aws ec2 describe-vpcs --query "$Q" --output table',
    purpose: 'Your networks. True means the default one.',
  },
  { command: "Q='Subnets[].[AvailabilityZone,CidrBlock]'", purpose: 'Choose the columns.' },
  {
    command: 'aws ec2 describe-subnets --query "$Q" --output table',
    purpose: 'One subnet for each zone.',
  },
  {
    command: "Q='RouteTables[].Routes[].[DestinationCidrBlock,GatewayId]'",
    purpose: 'Choose the columns.',
  },
  {
    command: 'aws ec2 describe-route-tables --query "$Q" --output table',
    purpose: 'Where traffic goes. 0.0.0.0/0 to igw means the internet.',
  },
  { command: "Q='SecurityGroups[].[GroupName,Description]'", purpose: 'Choose the columns.' },
  {
    command: 'aws ec2 describe-security-groups --query "$Q" --output table',
    purpose: 'Your firewalls.',
  },
]

const PATH = [
  { key: '1', label: '1. Internet gateway', value: 'The door of the network' },
  { key: '2', label: '2. Route table', value: 'Where does the traffic go?' },
  { key: '3', label: '3. Subnet', value: 'The part where the server is' },
  { key: '4', label: '4. Security group', value: 'Is this port allowed?' },
  { key: '5', label: '5. Server', value: 'Docker and your app' },
]

export function Step3() {
  return (
    <StepPage id="aws-step-3">
      <Paragraph>
        In phase 6 your server lives in this network. Most problems where a site does not open are
        network problems. This step only looks, and it is free.
      </Paragraph>
      <SectionTitle>Words</SectionTitle>
      <ReferenceTable caption="Network words" headers={['Word', 'Meaning']} rows={WORDS} />
      <SectionTitle>Look at it</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={LOOK} />
      <Paragraph>
        <InlineCode>0.0.0.0/0</InlineCode> means everywhere. A subnet is{' '}
        <strong>public</strong> when its route table sends <InlineCode>0.0.0.0/0</InlineCode> to an
        internet gateway.
      </Paragraph>
      <SectionTitle>The way of a request</SectionTitle>
      <ReferenceTable caption="Request path" headers={['Stop', 'Question']} rows={PATH} />
    </StepPage>
  )
}

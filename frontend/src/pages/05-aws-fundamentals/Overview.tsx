import { CommandLegend } from '../../components/CommandLegend'
import { Note, Paragraph, SectionTitle, TextLink } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'
import { Timeline } from '../../components/Timeline'
import { PHASE_5 } from '../../config/phases/phase-5'
import { SITE } from '../../config/site'

const WORDS = [
  { key: 'region', label: 'Region', value: 'A place with AWS data centers, such as Sydney' },
  { key: 'iam', label: 'IAM', value: 'Who may do what' },
  { key: 'role', label: 'IAM role', value: 'A temporary identity' },
  { key: 'policy', label: 'IAM policy', value: 'A list of permissions' },
  { key: 'oidc', label: 'OIDC', value: 'GitHub proves its identity to AWS, without a stored key' },
  { key: 'vpc', label: 'VPC', value: 'Your private network' },
  { key: 's3', label: 'S3', value: 'Stores files in buckets' },
  { key: 'cloudfront', label: 'CloudFront', value: 'Gives the files to users, fast and with HTTPS' },
]

const COST = [
  { key: 'account', label: 'MFA, IAM, OIDC, budget alerts', value: 'Free' },
  { key: 'vpc', label: 'VPC, subnets, security groups', value: 'Free' },
  { key: 's3', label: 'S3 for this small site', value: 'Cents' },
  { key: 'cloudfront', label: 'CloudFront', value: 'Free up to 1 TB per month' },
  { key: 'nat', label: 'NAT gateway', value: 'About 33 USD per month. Do not create it' },
]

export function Overview() {
  return (
    <StepPage id="aws-overview">
      <Paragraph>
        <strong>Goal:</strong> a safe AWS account, the basic ideas, and{' '}
        <strong>Deployment 1</strong>: a live HTTPS website that updates from GitHub.
      </Paragraph>
      <Note>
        This is the first phase that can cost money. Read the{' '}
        <TextLink href={SITE.costGuideUrl}>cost guide</TextLink> first.
      </Note>
      <Timeline phase={PHASE_5} />
      <SectionTitle>Cost</SectionTitle>
      <ReferenceTable caption="Cost" headers={['What', 'Cost']} rows={COST} />
      <SectionTitle>Words to know</SectionTitle>
      <ReferenceTable caption="AWS words" headers={['Word', 'Meaning']} rows={WORDS} />
      <SectionTitle>Command colors</SectionTitle>
      <CommandLegend />
    </StepPage>
  )
}

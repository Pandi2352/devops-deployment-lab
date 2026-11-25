import { CommandBlock, type Command } from '../../components/CommandBlock'
import { BulletList, Note, NumberedList, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const BRANCH: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch main', purpose: 'Start from main.' },
  { command: 'git pull', purpose: 'Get the latest code.' },
  { command: 'git switch -c phase-5-aws-basics', purpose: 'Create the branch.' },
  { command: 'git push -u origin phase-5-aws-basics', purpose: 'Upload the branch.' },
]

const PLANS = [
  {
    key: 'free',
    label: 'Free plan',
    value: 'Credits pay. It ends after 6 months, or when the credits finish',
  },
  { key: 'paid', label: 'Paid plan', value: 'After the credits, your card is charged' },
]

const GOOGLE = [
  { key: 'region', label: 'Region', value: 'Fixed by AWS, here Sydney (ap-southeast-2)' },
  { key: 'root', label: 'Root user', value: 'There is none. Your Google login owns the account' },
  { key: 'user', label: 'IAM admin user', value: 'Skip it. IAM users cannot use the console' },
  { key: 'waf', label: 'CloudFront with WAF', value: 'Not available. Use CloudFront without WAF' },
  { key: 'oidc', label: 'GitHub login (OIDC)', value: 'Works' },
]

export function Setup() {
  return (
    <StepPage id="aws-setup">
      <SectionTitle>Create the branch</SectionTitle>
      <CommandBlock commands={BRANCH} />
      <SectionTitle>Check your account</SectionTitle>
      <NumberedList>
        <li>Free plan or Paid plan? Look at the console home or Billing.</li>
        <li>How many credits are left, and when do they expire? Billing → Credits.</li>
        <li>Email login, or Google, GitHub, Apple or Amazon login?</li>
        <li>Which region is at the top right?</li>
      </NumberedList>
      <ReferenceTable caption="Plans" headers={['Plan', 'Meaning']} rows={PLANS} />
      <SectionTitle>If you signed up with Google</SectionTitle>
      <ReferenceTable caption="New sign-up" headers={['Topic', 'For you']} rows={GOOGLE} />
      <SectionTitle>Never do these</SectionTitle>
      <BulletList>
        <li>Upgrade to the Paid plan, or activate advanced features. Both cannot be undone.</li>
        <li>Enable AWS Organizations, Control Tower or IAM Identity Center.</li>
        <li>Create access keys.</li>
        <li>Create a NAT gateway or an EKS cluster now.</li>
        <li>Share your account number, keys or login codes.</li>
      </BulletList>
      <Note>
        If other projects use this account, never touch their resources. Give lab resources names
        that start with devops-lab or lab-.
      </Note>
    </StepPage>
  )
}

import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const VALUES = [
  {
    key: 'plan',
    label: 'Plan',
    value: 'Free if it works. Otherwise pay as you go (1 TB per month free)',
  },
  { key: 'domain', label: 'Domain', value: 'Skip' },
  { key: 'origin', label: 'Origin', value: 'Amazon S3, your bucket' },
  { key: 'access', label: 'Private bucket access', value: 'Yes. CloudFront updates the bucket policy' },
  { key: 'cache', label: 'Cache settings', value: 'Recommended' },
  { key: 'waf', label: 'Security (WAF)', value: 'Do not enable' },
]

const ERROR_PAGES = [
  { key: '403', label: 'HTTP 403', value: 'Page /index.html, response code 200' },
  { key: '404', label: 'HTTP 404', value: 'Page /index.html, response code 200' },
]

const SUPPORT_TEXT = `Hello,

I cannot create a CloudFront distribution. Error:

"Your account must be verified before you can add new CloudFront resources.
To verify your account, please contact AWS Support and include this error message."

Region: ap-southeast-2. Origin: a private S3 bucket. Use: a small static website for learning.
Please verify my account for CloudFront. Thank you.`

const CHECK: Command[] = [
  {
    command: 'D=<DISTRIBUTION_DOMAIN>',
    purpose: 'Save the address, without the signs and without https://.',
  },
  { command: 'curl -I https://$D', purpose: 'Home page: 200.' },
  { command: 'curl -I https://$D/phase-2/day-1', purpose: 'A React page: 200.' },
  { command: 'curl -I http://$D', purpose: 'Not secure: 301, sent to HTTPS.' },
]

export function Step6() {
  return (
    <StepPage id="aws-step-6">
      <SectionTitle>Create the distribution</SectionTitle>
      <Paragraph>
        Open CloudFront in the AWS console → <strong>Create distribution</strong>.
      </Paragraph>
      <ReferenceTable caption="CloudFront values" headers={['Question', 'Choose']} rows={VALUES} />

      <SectionTitle>If AWS says: account must be verified</SectionTitle>
      <Paragraph>
        New accounts can see this error. It is not your mistake, and the Support case is free.
      </Paragraph>
      <NumberedList>
        <li>
          Open AWS Support → <strong>Create case</strong> → <strong>Account and billing</strong>.
        </li>
        <li>
          Subject: <InlineCode>CloudFront: account must be verified</InlineCode>.
        </li>
        <li>Paste the text below and send it.</li>
        <li>Continue with step 7. It works without CloudFront.</li>
      </NumberedList>
      <CodeBlock
        language="Text"
        purpose="Text for the support case. Never send a password or key."
        code={SUPPORT_TEXT}
      />
      <Note>Do not make the bucket public to get around it.</Note>

      <SectionTitle>Settings for React</SectionTitle>
      <NumberedList>
        <li>
          General → Settings → Edit → Default root object: <InlineCode>index.html</InlineCode>.
        </li>
        <li>Error pages → create these two custom error responses:</li>
      </NumberedList>
      <ReferenceTable caption="Error pages" headers={['Error', 'Answer']} rows={ERROR_PAGES} />
      <Paragraph>
        S3 does not know React pages and answers 403. These settings open the app instead. In
        Behaviors, check <strong>Redirect HTTP to HTTPS</strong>.
      </Paragraph>

      <SectionTitle>Open your site</SectionTitle>
      <Paragraph>Wait about 5 minutes until it is deployed.</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={CHECK} />
      <Paragraph>HTTPS is free. A custom domain is optional and paid.</Paragraph>
    </StepPage>
  )
}

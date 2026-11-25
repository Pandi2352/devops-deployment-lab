import { CommandBlock, type Command } from '../../components/CommandBlock'
import { Note, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const INSTALL: Command[] = [
  { command: 'sudo apt install -y unzip', purpose: 'Install the tool that opens zip files.' },
  { command: 'cd /tmp', purpose: 'Work in the temporary folder.' },
  {
    command: 'URL=https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip',
    purpose: 'Save the long address.',
  },
  { command: 'curl -fsSL $URL -o awscli.zip', purpose: 'Download the AWS CLI.' },
  { command: 'unzip -q awscli.zip', purpose: 'Open the zip file.' },
  { command: 'sudo ./aws/install', purpose: 'Install it.' },
  { command: 'aws --version', purpose: 'Check it. You need 2.32.0 or newer.' },
]

const LOGIN: Command[] = [
  { command: 'aws configure set region ap-southeast-2', purpose: 'Always use your region.' },
  {
    command: 'aws login --remote',
    purpose: 'Open the link in your browser, log in, and paste the code back.',
  },
  { command: 'aws configure list', purpose: 'Check the region. The type must be login.' },
  { command: 'aws s3 ls', purpose: 'List your buckets. No error means the login works.' },
]

const PAGER: Command[] = [
  { command: 'export AWS_PAGER=""', purpose: 'Print directly, without a page viewer.' },
]

export function Step2() {
  return (
    <StepPage id="aws-step-2">
      <SectionTitle>Install</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={INSTALL} />
      <SectionTitle>Log in</SectionTitle>
      <Paragraph>
        This login is temporary, up to 12 hours. No access key is saved, so nothing can leak.
      </Paragraph>
      <CommandBlock terminal="Ubuntu" commands={LOGIN} />
      <Note>Do not share the login link, the code or your account number.</Note>
      <SectionTitle>Make output easier to read</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PAGER} />
      <Paragraph>If a command says the login expired, run aws login --remote again.</Paragraph>
    </StepPage>
  )
}

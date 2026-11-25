import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const BUILD: Command[] = [
  { command: 'cd D:\\devops\\react-devops\\frontend', purpose: 'Go to the app folder.' },
  { command: '$env:VITE_APP_VERSION = "s3-1"', purpose: 'The version shown on the page.' },
  { command: 'npm run build', purpose: 'Create the dist folder.' },
  { command: 'Remove-Item Env:VITE_APP_VERSION', purpose: 'Clear the version again.' },
]

const BUCKET: Command[] = [
  {
    command: 'B=<BUCKET>',
    purpose: 'Save your bucket name, such as devops-lab-yourname-1234. It is unique in the world.',
  },
  { command: 'aws s3 mb s3://$B --region ap-southeast-2', purpose: 'Make the bucket.' },
  {
    command: "T='TagSet=[{Key=project,Value=devops-lab}]'",
    purpose: 'A label for lab resources.',
  },
  {
    command: 'aws s3api put-bucket-tagging --bucket $B --tagging "$T"',
    purpose: 'Put the label on the bucket.',
  },
  {
    command: 'aws s3api get-public-access-block --bucket $B',
    purpose: 'Is it private? You must see true four times.',
  },
]

const UPLOAD: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the project root.' },
  { command: 'echo $B', purpose: 'Check the name before you upload.' },
  {
    command: 'aws s3 sync frontend/dist s3://$B --delete',
    purpose: 'Upload the site. --delete removes other files in this bucket.',
  },
  { command: 'aws s3 ls s3://$B --recursive', purpose: 'List the files.' },
  {
    command: 'curl -I https://$B.s3.ap-southeast-2.amazonaws.com/index.html',
    purpose: '403 Forbidden is correct. Users come through CloudFront only.',
  },
]

export function Step5() {
  return (
    <StepPage id="aws-step-5">
      <Paragraph>
        S3 stores your built files. CloudFront gives them to users. No server is needed.
      </Paragraph>
      <SectionTitle>Build the site</SectionTitle>
      <CommandBlock commands={BUILD} />
      <SectionTitle>Create a private bucket</SectionTitle>
      <Paragraph>
        Replace <InlineCode>{'<BUCKET>'}</InlineCode>, without the signs. Keep{' '}
        <strong>Block all public access</strong> on.
      </Paragraph>
      <CommandBlock terminal="Ubuntu" commands={BUCKET} />
      <SectionTitle>Upload</SectionTitle>
      <Note>
        Never use --delete with a bucket of another project. Always run echo $B first.
      </Note>
      <CommandBlock terminal="Ubuntu" commands={UPLOAD} />
    </StepPage>
  )
}

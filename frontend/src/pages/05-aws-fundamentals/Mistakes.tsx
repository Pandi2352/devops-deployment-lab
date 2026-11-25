import { InlineCommand } from '../../components/CommandText'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const CLI_ERRORS = [
  {
    key: 'param',
    label: <InlineCode>expected one argument</InlineCode>,
    value: 'The command was split into two lines. Use \\ at the end, or save values in variables',
  },
  {
    key: 'expired',
    label: 'Login or token expired',
    value: (
      <>
        Run <InlineCommand command="aws login --remote" />
      </>
    ),
  },
  {
    key: 'none',
    label: <InlineCode>None</InlineCode>,
    value: 'Nothing was found. Check the name and the region',
  },
  {
    key: 'bucket',
    label: <InlineCode>BucketAlreadyExists</InlineCode>,
    value: 'Someone in the world has this name. Use another number',
  },
  {
    key: 'denied',
    label: <InlineCode>AccessDenied</InlineCode>,
    value: 'A permission is missing. The message names it. Add only that one',
  },
]

const WEB_ERRORS = [
  {
    key: 'verify',
    label: 'Account must be verified (CloudFront)',
    value: 'Send a free case to AWS Support. See step 6',
  },
  {
    key: 'direct',
    label: '403 on the S3 address',
    value: 'Correct. The bucket is private',
  },
  {
    key: 'refresh',
    label: '403 on CloudFront after refresh',
    value: 'The two custom error responses are missing. See step 6',
  },
  {
    key: 'old',
    label: 'CloudFront shows the old version',
    value: 'index.html must have no-cache. Wait a moment, then press Ctrl+F5',
  },
]

const DEPLOY_ERRORS = [
  {
    key: 'assume',
    label: <InlineCode>Not authorized to perform sts:AssumeRoleWithWebIdentity</InlineCode>,
    value: 'The trust file does not match: ids, repo name or environment name',
  },
  {
    key: 'load',
    label: <InlineCode>Credentials could not be loaded</InlineCode>,
    value: 'id-token: write is missing, or AWS_ROLE_ARN is empty',
  },
  {
    key: 'branch',
    label: 'Fails at once on another branch',
    value: 'Correct. Only main may deploy to aws',
  },
  {
    key: 'put',
    label: <InlineCode>AccessDenied ... PutObject</InlineCode>,
    value: 'The role has no s3:PutObject for this bucket',
  },
  {
    key: 'missing',
    label: 'Deploy is not in the Actions list',
    value: 'Merge deploy.yml into main first',
  },
  {
    key: 'waiting',
    label: 'Run stays at Waiting',
    value: 'Open it, click Review deployments and approve',
  },
]

export function Mistakes() {
  return (
    <StepPage id="aws-mistakes">
      <Paragraph>AWS errors usually name the missing permission or the wrong value.</Paragraph>
      <SectionTitle>AWS CLI</SectionTitle>
      <ReferenceTable caption="CLI errors" headers={['Error', 'Fix']} rows={CLI_ERRORS} />
      <SectionTitle>Website and console</SectionTitle>
      <ReferenceTable caption="Website errors" headers={['You see', 'Fix']} rows={WEB_ERRORS} />
      <SectionTitle>Deploy workflow</SectionTitle>
      <ReferenceTable caption="Deploy errors" headers={['You see', 'Fix']} rows={DEPLOY_ERRORS} />
    </StepPage>
  )
}

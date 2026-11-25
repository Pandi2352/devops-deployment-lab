import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const DEPLOY_YML = `name: Deploy

on:
  workflow_dispatch:
    inputs:
      target:
        description: Where to deploy
        type: choice
        options: [s3]
        required: true

permissions:
  contents: read
  id-token: write

jobs:
  s3:
    if: inputs.target == 's3'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    environment: aws
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - name: Build
        working-directory: frontend
        env:
          VITE_APP_VERSION: \${{ github.sha }}
        run: |
          npm ci
          npm run build
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: \${{ secrets.AWS_ROLE_ARN }}
          aws-region: \${{ vars.AWS_REGION }}
          mask-aws-account-id: true
      - name: Upload
        env:
          BUCKET: \${{ vars.S3_BUCKET }}
        run: |
          test -n "$BUCKET"
          aws s3 sync frontend/dist/assets "s3://$BUCKET/assets" --cache-control "public,max-age=31536000,immutable"
          aws s3 sync frontend/dist "s3://$BUCKET" --exclude "assets/*" --cache-control "no-cache" --delete`

const LINES = [
  {
    key: 'dispatch',
    label: <InlineCode>workflow_dispatch</InlineCode>,
    value: 'You start it by hand',
  },
  {
    key: 'token',
    label: <InlineCode>id-token: write</InlineCode>,
    value: 'Lets GitHub prove its identity to AWS',
  },
  {
    key: 'environment',
    label: <InlineCode>environment: aws</InlineCode>,
    value: 'Waits for your approval. Must match the trust file',
  },
  {
    key: 'credentials',
    label: <InlineCode>configure-aws-credentials</InlineCode>,
    value: 'Gets a temporary AWS login',
  },
  {
    key: 'mask',
    label: <InlineCode>mask-aws-account-id</InlineCode>,
    value: 'Hides your account number in the log',
  },
  {
    key: 'test',
    label: <InlineCode>{'test -n "$BUCKET"'}</InlineCode>,
    value: 'Stops if the bucket name is empty',
  },
  {
    key: 'assets',
    label: 'First sync',
    value: 'Files whose names change. Browsers may keep them, and old ones stay',
  },
  {
    key: 'index',
    label: 'Second sync',
    value: 'index.html and others. Browsers always check for a new one',
  },
]

const PUSH: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git add .', purpose: 'Choose the files.' },
  { command: 'git status', purpose: 'You should see deploy.yml and two files in aws.' },
  { command: 'git commit -m "Add S3 deploy with OIDC"', purpose: 'Save them.' },
  { command: 'git push', purpose: 'Upload them. Then merge the pull request.' },
]

const CHECK: Command[] = [
  { command: 'aws s3 ls s3://<BUCKET> --recursive', purpose: 'The times must be new.' },
]

export function Step9() {
  return (
    <StepPage id="aws-step-9">
      <CodeBlock
        language="YAML"
        file=".github/workflows/deploy.yml"
        purpose="Builds the site and uploads it to S3, without any key."
        code={DEPLOY_YML}
      />
      <SectionTitle>What each part does</SectionTitle>
      <ReferenceTable caption="Deploy workflow" headers={['Part', 'Purpose']} rows={LINES} />
      <SectionTitle>Push and merge</SectionTitle>
      <CommandBlock commands={PUSH} />
      <Paragraph>
        The Deploy workflow appears in Actions only after the merge, because GitHub reads it from
        main.
      </Paragraph>
      <SectionTitle>Run it</SectionTitle>
      <NumberedList>
        <li>
          <strong>Actions</strong> → <strong>Deploy</strong> → <strong>Run workflow</strong> →
          branch <InlineCode>main</InlineCode>, target <InlineCode>s3</InlineCode>.
        </li>
        <li>
          Open the run → <strong>Review deployments</strong> → tick <InlineCode>aws</InlineCode> →{' '}
          <strong>Approve and deploy</strong>.
        </li>
        <li>Wait about one minute until it is green.</li>
      </NumberedList>
      <SectionTitle>Check it</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHECK} />
    </StepPage>
  )
}

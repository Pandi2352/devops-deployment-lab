import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const CI_YML = `name: CI

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: \${{ github.event_name == 'pull_request' }}

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`

const LINES = [
  {
    key: 'pr',
    label: <InlineCode>pull_request</InlineCode>,
    value: 'Run on every pull request',
  },
  {
    key: 'push',
    label: <InlineCode>push: branches: [main]</InlineCode>,
    value: 'Run after a merge',
  },
  {
    key: 'dispatch',
    label: <InlineCode>workflow_dispatch</InlineCode>,
    value: 'Lets you start it by hand',
  },
  {
    key: 'permissions',
    label: <InlineCode>contents: read</InlineCode>,
    value: 'The job may only read your code',
  },
  {
    key: 'concurrency',
    label: <InlineCode>concurrency</InlineCode>,
    value: 'Cancel the old run when you push again',
  },
  {
    key: 'runner',
    label: <InlineCode>runs-on: ubuntu-latest</InlineCode>,
    value: 'A Linux machine from GitHub',
  },
  {
    key: 'timeout',
    label: <InlineCode>timeout-minutes</InlineCode>,
    value: 'Stop a run that hangs',
  },
  {
    key: 'folder',
    label: <InlineCode>working-directory</InlineCode>,
    value: 'Run commands in the app folder',
  },
  {
    key: 'checkout',
    label: <InlineCode>actions/checkout</InlineCode>,
    value: 'Download your code to the machine',
  },
  {
    key: 'node',
    label: <InlineCode>actions/setup-node</InlineCode>,
    value: 'Install Node, the same version as in the Docker image',
  },
  {
    key: 'ci',
    label: <InlineCode>npm ci</InlineCode>,
    value: 'Install exactly what is in package-lock.json',
  },
]

const PUSH: Command[] = [
  { command: 'git add .', purpose: 'Choose the new file.' },
  { command: 'git status', purpose: 'You should see .github/workflows/ci.yml.' },
  { command: 'git commit -m "Add CI workflow"', purpose: 'Save it.' },
  { command: 'git push', purpose: 'Upload it.' },
]

export function Step1() {
  return (
    <StepPage id="actions-step-1">
      <CodeBlock
        language="YAML"
        file=".github/workflows/ci.yml"
        purpose="Checks every change: install, lint, test and build."
        code={CI_YML}
      />
      <Note>In YAML, spaces matter. Use 2 spaces for each level, never tabs.</Note>
      <SectionTitle>What each part does</SectionTitle>
      <ReferenceTable caption="CI workflow" headers={['Part', 'Purpose']} rows={LINES} />
      <SectionTitle>Push it</SectionTitle>
      <CommandBlock commands={PUSH} />
    </StepPage>
  )
}

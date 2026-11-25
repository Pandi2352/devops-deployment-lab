import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const IMAGE_JOB = `  image:
    needs: verify
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    permissions:
      contents: read
      packages: write
    uses: ./.github/workflows/docker-build.yml`

const DOCKER_YML = `name: Docker build

on:
  workflow_call:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v6
        with:
          images: ghcr.io/\${{ github.repository }}
          tags: |
            type=sha,format=long,prefix=
            type=raw,value=latest
      - uses: docker/build-push-action@v7
        with:
          context: .
          file: frontend/Dockerfile
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          build-args: VITE_APP_VERSION=\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max`

const LINES = [
  {
    key: 'needs',
    label: <InlineCode>needs: verify</InlineCode>,
    value: 'Build only if the checks pass',
  },
  {
    key: 'if',
    label: <InlineCode>if: ... main</InlineCode>,
    value: 'Only after a merge, never from a pull request',
  },
  {
    key: 'uses',
    label: <InlineCode>uses: ./.github/...</InlineCode>,
    value: 'Call the second file',
  },
  {
    key: 'call',
    label: <InlineCode>workflow_call</InlineCode>,
    value: 'This file runs only when another workflow calls it',
  },
  {
    key: 'packages',
    label: <InlineCode>packages: write</InlineCode>,
    value: 'May upload images to GHCR',
  },
  {
    key: 'token',
    label: <InlineCode>GITHUB_TOKEN</InlineCode>,
    value: 'Created automatically for each run. You do not create it',
  },
  {
    key: 'sha',
    label: <InlineCode>type=sha</InlineCode>,
    value: 'Tag the image with the commit id',
  },
  {
    key: 'args',
    label: <InlineCode>VITE_APP_VERSION</InlineCode>,
    value: 'The page shows the commit id',
  },
  {
    key: 'cache',
    label: <InlineCode>cache-from / cache-to</InlineCode>,
    value: 'Reuse layers, so builds are faster',
  },
]

const PUSH: Command[] = [
  { command: 'git add .', purpose: 'Choose both files.' },
  { command: 'git status', purpose: 'You should see ci.yml and docker-build.yml.' },
  { command: 'git commit -m "Build and publish the Docker image"', purpose: 'Save them.' },
  { command: 'git push', purpose: 'Upload them. In the pull request, image is skipped.' },
]

export function Step4() {
  return (
    <StepPage id="actions-step-4">
      <CodeBlock
        language="YAML"
        file=".github/workflows/ci.yml"
        note="add this at the end, under jobs"
        purpose="Calls the Docker workflow after verify passes. Line it up with verify: 2 spaces."
        code={IMAGE_JOB}
      />
      <CodeBlock
        language="YAML"
        file=".github/workflows/docker-build.yml"
        purpose="Builds the Docker image and uploads it to GHCR."
        code={DOCKER_YML}
      />
      <SectionTitle>What each part does</SectionTitle>
      <ReferenceTable caption="Image workflow" headers={['Part', 'Purpose']} rows={LINES} />
      <SectionTitle>Push it</SectionTitle>
      <CommandBlock commands={PUSH} />
      <Paragraph>
        When verify is green, merge the pull request and keep the branch. In the{' '}
        <strong>Actions</strong> tab, the run on main shows <InlineCode>verify</InlineCode> →{' '}
        <InlineCode>image / build</InlineCode>.
      </Paragraph>
      <SectionTitle>Why tag images with the commit id</SectionTitle>
      <Paragraph>
        <InlineCode>latest</InlineCode> changes all the time, so you cannot know what is running or
        roll back safely. Always <strong>deploy the SHA tag</strong>.
      </Paragraph>
    </StepPage>
  )
}

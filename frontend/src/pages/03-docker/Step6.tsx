import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const COMPOSE = `name: devops-lab

services:
  frontend:
    build:
      context: ..
      dockerfile: frontend/Dockerfile
      args:
        VITE_APP_VERSION: compose
    image: devops-lab:compose
    ports:
      - "8080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/healthz"]
      interval: 10s
      timeout: 3s
      retries: 3`

const LINES = [
  {
    key: 'name',
    label: <InlineCode>name</InlineCode>,
    value: 'Keeps this separate from your other projects',
  },
  {
    key: 'context',
    label: <InlineCode>context: ..</InlineCode>,
    value: 'Build from the repo root',
  },
  {
    key: 'ports',
    label: <InlineCode>ports</InlineCode>,
    value: 'Laptop port 8080 → container port 8080',
  },
  {
    key: 'restart',
    label: <InlineCode>restart</InlineCode>,
    value: 'Start again if the app crashes',
  },
  {
    key: 'health',
    label: <InlineCode>healthcheck</InlineCode>,
    value: 'Docker checks the app every 10 seconds',
  },
]

const COMPOSE_COMMANDS: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the repo root.' },
  {
    command: 'docker compose -f docker/docker-compose.yml up -d --build',
    purpose: 'Build and start everything in the file.',
  },
  {
    command: 'docker compose -f docker/docker-compose.yml ps',
    purpose: 'Show the state. It becomes healthy after about 10 seconds.',
  },
  {
    command: './scripts/health-check.sh http://localhost:8080/healthz',
    purpose: 'Use your script from phase 2. It prints OK.',
  },
  { command: 'docker compose -f docker/docker-compose.yml logs', purpose: 'Show the logs.' },
  {
    command: 'docker compose -f docker/docker-compose.yml down',
    purpose: 'Stop and remove only this project.',
  },
]

const BUILD_SCRIPT = `#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
version="\${1:?Usage: ./scripts/build.sh <version>}"
docker build -f frontend/Dockerfile -t "devops-lab:$version" --build-arg "VITE_APP_VERSION=$version" .`

const BUILD_COMMANDS: Command[] = [
  { command: 'bash scripts/build.sh 2.0', purpose: 'Build any version with a short command.' },
  { command: 'docker images devops-lab', purpose: 'List your versions.' },
]

const SAVE: Command[] = [
  { command: 'git add .', purpose: 'Choose the new files.' },
  {
    command: 'git update-index --chmod=+x scripts/build.sh',
    purpose: 'Save the run permission in Git.',
  },
  { command: 'git commit -m "Add Docker Compose and build script"', purpose: 'Save them.' },
  { command: 'git push', purpose: 'Upload them.' },
]

export function Step6() {
  return (
    <StepPage id="docker-step-6">
      <Paragraph>Compose saves all the options of docker run in one file.</Paragraph>
      <CodeBlock
        language="YAML"
        file="docker/docker-compose.yml"
        purpose="Describes how to build and run the app."
        code={COMPOSE}
      />
      <ReferenceTable caption="Compose lines" headers={['Line', 'Purpose']} rows={LINES} />
      <CommandBlock terminal="Ubuntu" commands={COMPOSE_COMMANDS} />
      <SectionTitle>Build script</SectionTitle>
      <CodeBlock
        language="Bash"
        file="scripts/build.sh"
        note="save it with LF line endings"
        purpose="Builds the image for the version you give."
        code={BUILD_SCRIPT}
      />
      <CommandBlock terminal="Ubuntu" commands={BUILD_COMMANDS} />
      <SectionTitle>Save it in Git</SectionTitle>
      <CommandBlock commands={SAVE} />
    </StepPage>
  )
}

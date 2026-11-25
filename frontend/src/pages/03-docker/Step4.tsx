import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

function getBuildCommand(version: string) {
  return `docker build \\
  -f frontend/Dockerfile \\
  -t devops-lab:${version} \\
  --build-arg VITE_APP_VERSION=${version} .`
}

const BUILD: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the repo root.' },
  {
    command: getBuildCommand('1.0'),
    purpose: 'Build the image. -f is the recipe, -t the name, the dot is this folder.',
  },
]

const RUN: Command[] = [
  {
    command: 'docker run -d --name lab -p 8080:8080 devops-lab:1.0',
    purpose: 'Start your app.',
  },
  { command: 'docker ps --filter name=lab', purpose: 'It must show Up, not Exited.' },
  { command: 'curl http://localhost:8080/healthz', purpose: 'Health check. It prints ok.' },
  { command: 'docker exec lab id', purpose: 'Which user runs it? Not uid=0(root).' },
  { command: 'docker images devops-lab', purpose: 'Size of your image, about 90 MB.' },
  { command: 'docker history devops-lab:1.0', purpose: 'Show the layers of the image.' },
]

const UPDATE: Command[] = [
  {
    command: getBuildCommand('2.0'),
    purpose: 'Build a second version. npm ci is CACHED, so it is fast.',
  },
  { command: 'docker rm -f lab', purpose: 'Stop and delete the old container.' },
  {
    command: 'docker run -d --name lab -p 8080:8080 devops-lab:2.0',
    purpose: 'Start the new version. The page shows Version: 2.0.',
  },
]

const ROLLBACK: Command[] = [
  { command: 'docker rm -f lab', purpose: 'Remove version 2.0.' },
  {
    command: 'docker run -d --name lab -p 8080:8080 devops-lab:1.0',
    purpose: 'Run the old image again. The page shows Version: 1.0.',
  },
]

const RULES: Command[] = [
  {
    command: 'curl -I http://localhost:8080/phase-2/day-1',
    purpose: '200: React addresses work.',
  },
  {
    command: 'curl -I http://localhost:8080/assets/missing.js',
    purpose: '404: a missing file is an error.',
  },
  { command: 'docker rm -f lab', purpose: 'Remove the container when finished.' },
]

export function Step4() {
  return (
    <StepPage id="docker-step-4">
      <SectionTitle>Build</SectionTitle>
      <Note>
        Copy the whole command. <InlineCode>\</InlineCode> means it continues on the next line.
      </Note>
      <CommandBlock terminal="Ubuntu" commands={BUILD} />
      <Paragraph>
        If <InlineCode>npm ci</InlineCode> complains that the lock file does not match, run{' '}
        <InlineCode>npm install</InlineCode> in PowerShell inside <InlineCode>frontend</InlineCode>{' '}
        and build again.
      </Paragraph>
      <SectionTitle>Run</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={RUN} />
      <Paragraph>
        Open http://localhost:8080. It must show <strong>Version: 1.0</strong>.
      </Paragraph>
      <SectionTitle>Update to 2.0</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={UPDATE} />
      <SectionTitle>Roll back</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={ROLLBACK} />
      <Paragraph>This is why you never reuse a tag for different code.</Paragraph>
      <SectionTitle>Check the Nginx rules</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={RULES} />
    </StepPage>
  )
}

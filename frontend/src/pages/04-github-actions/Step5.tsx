import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const TEST: Command[] = [
  {
    command: 'IMAGE=ghcr.io/<GITHUB_USER>/devops-deployment-lab',
    purpose: 'Save the long name. Use lowercase, without the < and > signs.',
  },
  { command: 'echo $IMAGE', purpose: 'Check the name.' },
  { command: 'docker pull $IMAGE:latest', purpose: 'Download the image GitHub built.' },
  {
    command: 'docker run -d --name lab -p 8080:8080 $IMAGE:latest',
    purpose: 'Start it.',
  },
  { command: 'docker ps --filter name=lab', purpose: 'It must show Up.' },
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the project, for the script.' },
  {
    command: './scripts/health-check.sh http://localhost:8080/healthz',
    purpose: 'It prints OK.',
  },
]

const COMPARE: Command[] = [
  { command: 'git fetch', purpose: 'Get the latest information from GitHub.' },
  {
    command: 'git rev-parse origin/main',
    purpose: 'Show the latest commit id of main. The page must show the same id.',
  },
]

const CLEAN: Command[] = [
  { command: 'docker rm -f lab', purpose: 'Remove the test container.' },
]

export function Step5() {
  return (
    <StepPage id="actions-step-5">
      <SectionTitle>Make the image public</SectionTitle>
      <NumberedList>
        <li>
          On GitHub, open your profile → <strong>Packages</strong> →{' '}
          <InlineCode>devops-deployment-lab</InlineCode>.
        </li>
        <li>
          If it is private: <strong>Package settings</strong> → <strong>Change visibility</strong> →{' '}
          <strong>Public</strong>.
        </li>
      </NumberedList>
      <Note>
        Later, EC2 and Kubernetes can pull it without a password. A public package cannot be made
        private again.
      </Note>
      <SectionTitle>Test it like a server</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={TEST} />
      <Paragraph>
        Open http://localhost:8080. The page shows the Git commit as its version.
      </Paragraph>
      <SectionTitle>Compare the version</SectionTitle>
      <CommandBlock commands={COMPARE} />
      <SectionTitle>Clean up</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CLEAN} />
    </StepPage>
  )
}

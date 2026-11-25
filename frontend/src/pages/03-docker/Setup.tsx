import { CommandBlock, type Command } from '../../components/CommandBlock'
import { Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const BRANCH: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch main', purpose: 'Start from main.' },
  { command: 'git pull', purpose: 'Get the latest code.' },
  { command: 'git switch -c phase-3-docker', purpose: 'Create the branch of this phase.' },
  { command: 'git push -u origin phase-3-docker', purpose: 'Upload the branch.' },
]

const FREE_PORT: Command[] = [
  {
    command: 'sudo systemctl disable --now nginx',
    purpose: 'Stop the Nginx from phase 2, so it does not use port 80.',
  },
  { command: 'systemctl is-active nginx', purpose: 'It must print inactive.' },
]

const CHECK: Command[] = [
  {
    command: 'docker version',
    purpose: 'Check the connection. You must see both Client and Server.',
  },
  {
    command: 'docker run --rm hello-world',
    purpose: 'Download and run a test image. --rm deletes the container afterwards.',
  },
]

export function Setup() {
  return (
    <StepPage id="docker-setup">
      <SectionTitle>Create the branch</SectionTitle>
      <CommandBlock commands={BRANCH} />
      <SectionTitle>Stop the old Nginx</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={FREE_PORT} />
      <SectionTitle>Connect Docker Desktop</SectionTitle>
      <NumberedList>
        <li>
          Open <strong>Docker Desktop</strong> and wait for <strong>Engine running</strong>.
        </li>
        <li>
          Open <strong>Settings</strong> → <strong>Resources</strong> →{' '}
          <strong>WSL integration</strong>.
        </li>
        <li>
          Turn on <strong>Ubuntu</strong> and click <strong>Apply</strong>.
        </li>
        <li>Close Ubuntu and open it again.</li>
      </NumberedList>
      <SectionTitle>Check Docker</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHECK} />
      <Paragraph>
        Docker Desktop is free for personal use and learning. Work in a larger company needs a paid
        plan.
      </Paragraph>
      <Note>
        If you have other Docker projects, remove only what you create, by name. Do not use docker
        system prune.
      </Note>
    </StepPage>
  )
}

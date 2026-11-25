import { CommandBlock, type Command } from '../../components/CommandBlock'
import { Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const LOST: Command[] = [
  {
    command: "docker run --rm alpine sh -c 'echo saved > /a.txt'",
    purpose: 'Write a file in a container, then delete the container.',
  },
  {
    command: 'docker run --rm alpine cat /a.txt',
    purpose: 'Read it in a new container. No such file: it is lost.',
  },
]

const VOLUME: Command[] = [
  { command: 'docker volume create lab-data', purpose: 'Create storage.' },
  {
    command: "docker run --rm -v lab-data:/data alpine sh -c 'echo saved > /data/a.txt'",
    purpose: 'Connect the storage to /data and write there.',
  },
  {
    command: 'docker run --rm -v lab-data:/data alpine cat /data/a.txt',
    purpose: 'Read it in a new container. It prints saved.',
  },
]

const NETWORK: Command[] = [
  { command: 'docker network create labnet', purpose: 'Create a private network.' },
  {
    command: 'docker run -d --name lab --network labnet devops-lab:1.0',
    purpose: 'Start your app in this network.',
  },
  {
    command: 'docker run --rm --network labnet alpine wget -qO- http://lab:8080/healthz',
    purpose: 'Call the app by its name from the same network. It prints ok.',
  },
  {
    command: 'docker run --rm alpine wget -qO- -T 3 http://lab:8080/healthz',
    purpose: 'Same call from outside the network. The name is not found.',
  },
]

const CLEAN: Command[] = [
  { command: 'docker rm -f lab', purpose: 'Remove the container.' },
  { command: 'docker network rm labnet', purpose: 'Remove the network.' },
  { command: 'docker volume rm lab-data', purpose: 'Remove the storage and its files.' },
]

export function Step5() {
  return (
    <StepPage id="docker-step-5">
      <SectionTitle>Without a volume</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={LOST} />
      <SectionTitle>With a volume</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={VOLUME} />
      <Paragraph>
        The file survives because it is in the volume. Databases need this. Our app stores nothing.
      </Paragraph>
      <SectionTitle>Networks</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={NETWORK} />
      <Paragraph>
        Containers on the same network find each other <strong>by name</strong>. Kubernetes
        Services use the same idea.
      </Paragraph>
      <SectionTitle>Clean up</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CLEAN} />
    </StepPage>
  )
}

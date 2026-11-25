import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const RUN: Command[] = [
  {
    command: 'docker pull nginx:stable-alpine',
    purpose: 'Download an image. stable-alpine is a small version.',
  },
  { command: 'docker images', purpose: 'List the images on your laptop.' },
  {
    command: 'docker run -d --name web -p 8081:80 nginx:stable-alpine',
    purpose: 'Start a container in the background, with a name and a port.',
  },
  { command: 'docker ps', purpose: 'List running containers.' },
  { command: 'curl -I http://localhost:8081', purpose: 'Ask the container. 200 OK.' },
  { command: 'docker logs web', purpose: 'Show the logs of the container.' },
]

const INSIDE: Command[] = [
  { command: 'docker exec -it web sh', purpose: 'Open a terminal inside the container.' },
  { command: 'cat /etc/os-release | head -2', purpose: 'It is Alpine Linux, not your Ubuntu.' },
  { command: 'ls /usr/share/nginx/html', purpose: 'Show the website files.' },
  { command: 'id', purpose: 'Show the user. This image starts as root.' },
  { command: 'exit', purpose: 'Leave. The container keeps running.' },
]

const REMOVE: Command[] = [
  { command: 'docker stop web', purpose: 'Stop the container.' },
  { command: 'docker rm web', purpose: 'Delete the container. The image stays.' },
  { command: 'docker ps -a --filter name=web', purpose: 'Check that it is gone.' },
]

const OPTIONS = [
  { key: 'd', label: <InlineCode>-d</InlineCode>, value: 'Run in the background' },
  { key: 'name', label: <InlineCode>--name web</InlineCode>, value: 'Give it a name' },
  {
    key: 'p',
    label: <InlineCode>-p 8081:80</InlineCode>,
    value: 'Laptop port 8081 → container port 80',
  },
  { key: 'it', label: <InlineCode>-it</InlineCode>, value: 'Use it as a terminal' },
  { key: 'rm', label: <InlineCode>--rm</InlineCode>, value: 'Delete it when it stops' },
]

export function Step1() {
  return (
    <StepPage id="docker-step-1">
      <SectionTitle>Run a container</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={RUN} />
      <Paragraph>Open http://localhost:8081 in your browser too.</Paragraph>
      <SectionTitle>Options</SectionTitle>
      <ReferenceTable caption="Docker options" headers={['Option', 'Meaning']} rows={OPTIONS} />
      <SectionTitle>Go inside</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={INSIDE} />
      <SectionTitle>Remove it</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={REMOVE} />
    </StepPage>
  )
}

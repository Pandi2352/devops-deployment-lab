import { InlineCommand } from '../../components/CommandText'
import { SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

interface CommandGroup {
  title: string
  items: { command: string; use: string }[]
}

const GROUPS: CommandGroup[] = [
  {
    title: 'Images',
    items: [
      { command: 'docker pull <image>', use: 'Download an image' },
      { command: 'docker images', use: 'List images' },
      { command: 'docker build -f <file> -t <name> .', use: 'Build an image' },
      { command: 'docker tag <old> <new>', use: 'Give an image another name' },
      { command: 'docker push <image>', use: 'Upload an image' },
      { command: 'docker rmi <image>', use: 'Delete an image' },
      { command: 'docker history <image>', use: 'Show the layers' },
    ],
  },
  {
    title: 'Containers',
    items: [
      { command: 'docker run -d --name <name> -p 8080:8080 <image>', use: 'Start a container' },
      { command: 'docker ps', use: 'List running containers' },
      { command: 'docker ps -a', use: 'List all containers' },
      { command: 'docker stop <name>', use: 'Stop it' },
      { command: 'docker rm -f <name>', use: 'Stop and delete it' },
    ],
  },
  {
    title: 'Find problems',
    items: [
      { command: 'docker logs <name>', use: 'Show the logs' },
      { command: 'docker exec -it <name> sh', use: 'Go inside' },
      { command: 'docker inspect <name>', use: 'Show all details' },
      { command: 'docker system df', use: 'How much disk Docker uses' },
    ],
  },
  {
    title: 'Volumes and networks',
    items: [
      { command: 'docker volume create <name>', use: 'Create storage' },
      { command: 'docker volume ls', use: 'List storage' },
      { command: 'docker network create <name>', use: 'Create a network' },
      { command: 'docker network ls', use: 'List networks' },
    ],
  },
  {
    title: 'Compose',
    items: [
      { command: 'docker compose -f <file> up -d --build', use: 'Build and start' },
      { command: 'docker compose -f <file> ps', use: 'Show the state' },
      { command: 'docker compose -f <file> logs', use: 'Show the logs' },
      { command: 'docker compose -f <file> down', use: 'Stop and remove' },
    ],
  },
]

export function Commands() {
  return (
    <StepPage id="docker-commands">
      {GROUPS.map(({ title, items }) => (
        <section key={title} className="space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <ReferenceTable
            caption={title}
            headers={['Command', 'Use']}
            rows={items.map(({ command, use }) => ({
              key: command,
              label: <InlineCommand command={command} />,
              value: use,
            }))}
          />
        </section>
      ))}
    </StepPage>
  )
}

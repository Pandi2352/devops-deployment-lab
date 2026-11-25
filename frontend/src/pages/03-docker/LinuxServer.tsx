import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { PageLink } from '../../components/PageLink'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const CONNECT: Command[] = [
  { command: 'ssh <USER>@<SERVER_IP>', purpose: 'Log in to the server.' },
]

const SERVER: Command[] = [
  { command: 'uname -m', purpose: 'x86_64 means amd64. It must match the image.' },
  { command: 'df -h /', purpose: 'Free disk. Keep at least 1 GB free.' },
  { command: 'free -h', purpose: 'Free memory.' },
  {
    command: "sudo ss -tlnp | grep ':80 '",
    purpose: 'Is port 80 free? No output means yes.',
  },
  { command: 'docker version', purpose: 'You must see Client and Server.' },
]

const INSTALL: Command[] = [
  { command: 'sudo apt update', purpose: 'Refresh the software list.' },
  { command: 'sudo apt install -y docker.io', purpose: 'Install Docker on the server.' },
  { command: 'sudo systemctl enable --now docker', purpose: 'Start it now and on every boot.' },
  {
    command: 'sudo usermod -aG docker $USER',
    purpose: 'Use Docker without sudo. Log out and in again. This gives admin power, so be careful.',
  },
]

const PULL: Command[] = [
  {
    command: 'IMAGE=<DOCKERHUB_USER>/devops-lab:2.1',
    purpose: 'Save the image name. Type your username without < and >.',
  },
  { command: 'docker pull $IMAGE', purpose: 'Download the image.' },
  {
    command: "docker inspect --format '{{index .RepoDigests 0}}' $IMAGE",
    purpose: 'Show the digest. It must be the same as when you pushed.',
  },
  {
    command: "docker inspect --format '{{.Os}}/{{.Architecture}}' $IMAGE",
    purpose: 'It must match the server.',
  },
]

const RUN: Command[] = [
  {
    command: 'docker run -d --name lab --restart unless-stopped -p 80:8080 $IMAGE',
    purpose: 'Start it. Server port 80 goes to container port 8080.',
  },
  { command: 'docker ps --filter name=lab', purpose: 'It must show Up, not Restarting.' },
  { command: 'docker logs --tail 20 lab', purpose: 'Last 20 log lines. No errors.' },
]

const CHECK: Command[] = [
  {
    command: 'docker exec lab wget -qO- http://127.0.0.1:8080/healthz',
    purpose: 'Check 1: inside the container. It prints ok.',
  },
  {
    command: 'curl -fsS http://localhost/healthz',
    purpose: 'Check 2: on the server. It prints ok.',
  },
  {
    command: 'curl -fsS http://<SERVER_IP>/healthz',
    purpose: 'Check 3: from your laptop. It prints ok.',
  },
]

const UPDATE: Command[] = [
  {
    command: 'NEW=<DOCKERHUB_USER>/devops-lab:2.2',
    purpose: 'Save the name of the new version.',
  },
  { command: 'docker pull $NEW', purpose: 'Download first, so the downtime is short.' },
  { command: 'docker stop lab', purpose: 'Stop the old version.' },
  { command: 'docker rename lab lab-old', purpose: 'Keep it, for a rollback.' },
  {
    command: 'docker run -d --name lab --restart unless-stopped -p 80:8080 $NEW',
    purpose: 'Start the new version.',
  },
  { command: 'curl -fsS http://localhost/healthz', purpose: 'Check it. It prints ok.' },
]

const KEEP: Command[] = [
  { command: 'docker rm lab-old', purpose: 'Delete the old container when the new one is good.' },
]

const ROLLBACK: Command[] = [
  { command: 'docker logs lab', purpose: 'Read the reason first. The logs go away with rm.' },
  { command: 'docker rm -f lab', purpose: 'Remove the new, broken version.' },
  { command: 'docker rename lab-old lab', purpose: 'Give the old container its name back.' },
  { command: 'docker start lab', purpose: 'Start the old version.' },
  { command: 'curl -fsS http://localhost/healthz', purpose: 'Check it. It prints ok.' },
]

const RESULTS = [
  { key: '1', label: 'Check 1 fails', value: 'The app or the image has a problem' },
  { key: '2', label: 'Check 1 works, check 2 fails', value: 'The port setting (-p) is wrong' },
  {
    key: '3',
    label: 'Check 2 works, check 3 fails',
    value: 'The firewall or the security group blocks port 80',
  },
]

export function LinuxServer() {
  return (
    <StepPage id="docker-linux-server">
      <Note>
        Practice this in Ubuntu on your laptop now, with <InlineCode>localhost</InlineCode> as the
        server. Skip the login and the Docker install. In phase 6 you do the same on AWS EC2.
      </Note>
      <SectionTitle>1. Log in</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CONNECT} />
      <SectionTitle>2. Check the server</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={SERVER} />
      <Paragraph>If Docker is not installed on a real server:</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={INSTALL} />
      <SectionTitle>3. Pull and check the image</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PULL} />
      <SectionTitle>4. Run it</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={RUN} />
      <SectionTitle>5. Check it from three places</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHECK} />
      <ReferenceTable caption="Check results" headers={['Result', 'Problem']} rows={RESULTS} />
      <SectionTitle>6. Update to a new version</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={UPDATE} />
      <Paragraph>If the new version is good:</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={KEEP} />
      <SectionTitle>7. Roll back</SectionTitle>
      <Paragraph>If the new version is broken, bring users back first. Find the cause later.</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={ROLLBACK} />
      <Paragraph>
        Something failed? Go to <PageLink to="/phase-3/solve-issues">Solve issues</PageLink>.
      </Paragraph>
    </StepPage>
  )
}

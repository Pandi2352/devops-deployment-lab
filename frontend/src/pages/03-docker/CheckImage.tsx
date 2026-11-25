import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { PageLink } from '../../components/PageLink'
import { StepPage } from '../../components/StepPage'

const START: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the project root.' },
  { command: 'IMAGE=devops-lab:2.1', purpose: 'Save the image name, to use it below.' },
]

const DETAILS: Command[] = [
  { command: 'docker images devops-lab', purpose: 'Size: about 90 MB. Much bigger is wrong.' },
  {
    command: "docker inspect --format '{{.Config.User}}' $IMAGE",
    purpose: 'User: 101. Empty, 0 or root means it runs as root.',
  },
  {
    command: "docker inspect --format '{{json .Config.ExposedPorts}}' $IMAGE",
    purpose: 'Port: 8080/tcp.',
  },
  {
    command: "docker inspect --format '{{.Os}}/{{.Architecture}}' $IMAGE",
    purpose: 'Type: linux/amd64. It must match the server.',
  },
]

const SECRETS: Command[] = [
  {
    command: "docker inspect --format '{{json .Config.Env}}' $IMAGE",
    purpose: 'Settings inside the image. There must be no password or key.',
  },
  {
    command: "docker run --rm $IMAGE sh -c \"find / -name '.env*' -not -path '/proc/*' 2>/dev/null\"",
    purpose: 'Search for .env files. It must print nothing.',
  },
  {
    command: 'docker history --no-trunc $IMAGE | grep -iE "password|secret|token"',
    purpose: 'Search the build steps for secrets. It must print nothing.',
  },
]

const CONTENT: Command[] = [
  {
    command: 'docker run --rm $IMAGE ls -R /usr/share/nginx/html',
    purpose: 'Your files: index.html and an assets folder with js and css.',
  },
  {
    command: 'docker run --rm $IMAGE nginx -t',
    purpose: 'Test the Nginx settings. test is successful.',
  },
]

const RUN: Command[] = [
  {
    command: 'docker run -d --name check -p 8080:8080 $IMAGE',
    purpose: 'Start a test container.',
  },
  { command: 'docker ps --filter name=check', purpose: 'It must show Up.' },
  { command: 'docker logs check', purpose: 'There must be no error or emerg lines.' },
  {
    command: './scripts/health-check.sh http://localhost:8080/healthz',
    purpose: 'Health page: OK.',
  },
  { command: './scripts/health-check.sh http://localhost:8080/', purpose: 'Home page: OK.' },
  {
    command: './scripts/health-check.sh http://localhost:8080/phase-2/day-1',
    purpose: 'A React address: OK.',
  },
  {
    command: "curl -s http://localhost:8080 | grep -i '<title>'",
    purpose: 'It must show DevOps Lab, not Welcome to nginx.',
  },
  {
    command: 'docker exec check sh -c "grep -rlF 2.1 /usr/share/nginx/html/assets"',
    purpose: 'Prints a js file if the version is inside the app.',
  },
  { command: 'docker stats --no-stream check', purpose: 'Memory: only a few MiB.' },
  { command: 'docker restart check', purpose: 'Restart it once.' },
  {
    command: './scripts/health-check.sh http://localhost:8080/healthz',
    purpose: 'It must be OK again after the restart.',
  },
]

const CLEAN: Command[] = [
  { command: 'docker rm -f check', purpose: 'Remove the test container. The image stays.' },
]

export function CheckImage() {
  return (
    <StepPage id="docker-check-image">
      <Paragraph>
        A successful build does not mean a working app. Do these checks on your laptop. If one
        fails, fix it, build a <strong>new</strong> version and check again.
      </Paragraph>
      <CommandBlock terminal="Ubuntu" commands={START} />
      <SectionTitle>1. Image details</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={DETAILS} />
      <SectionTitle>2. No secrets inside</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={SECRETS} />
      <Note>
        Everyone can download a public image and read everything in it. Everything in a frontend
        build is public too.
      </Note>
      <SectionTitle>3. Files and settings</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CONTENT} />
      <SectionTitle>4. Run and test</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={RUN} />
      <Paragraph>
        Open http://localhost:8080 in your browser too. Check the version at the top, press{' '}
        <strong>F5</strong> on an inner page, and look for red errors in the console (F12).
      </Paragraph>
      <SectionTitle>5. Clean up</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CLEAN} />
      <SectionTitle>Push only if all are true</SectionTitle>
      <NumberedList>
        <li>The size is normal and the user is not root.</li>
        <li>No secret is inside.</li>
        <li>
          The health page, home page and inner page are <InlineCode>OK</InlineCode>.
        </li>
        <li>The correct version shows in the browser.</li>
        <li>It still works after a restart.</li>
      </NumberedList>
      <Paragraph>
        Then go back to <PageLink to="/phase-3/release-flow">Step 5: Push to Docker Hub</PageLink>.
        In phase 13, a scanner also checks the image for known security problems.
      </Paragraph>
    </StepPage>
  )
}

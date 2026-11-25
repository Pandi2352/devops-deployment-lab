import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const ORDER: Command[] = [
  { command: 'docker ps -a --filter name=lab', purpose: '1. Is it Up, Exited or Restarting?' },
  { command: 'docker logs --tail 50 lab', purpose: '2. What does the app say?' },
  {
    command:
      "docker inspect --format '{{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}' lab",
    purpose: '3. Why did it stop? oom=true means not enough memory.',
  },
  {
    command: "docker inspect --format '{{.Config.Image}}' lab",
    purpose: '4. Is it really the version you wanted?',
  },
  {
    command: 'docker exec lab wget -qO- http://127.0.0.1:8080/healthz',
    purpose: '5. Does it answer inside the container?',
  },
  { command: 'docker port lab', purpose: '6. Which server port goes to which container port?' },
  { command: 'curl -I http://localhost', purpose: '7. Does it answer on the server?' },
  { command: 'sudo ss -tlnp', purpose: '8. Which program listens on which port?' },
  { command: 'df -h /', purpose: '9. Is the disk full?' },
  { command: 'free -h', purpose: '10. Is the memory full?' },
]

const INSIDE: Command[] = [
  { command: 'docker exec -it lab sh', purpose: 'Open a terminal inside the container.' },
  { command: 'ls -la /usr/share/nginx/html', purpose: 'Are your files there?' },
  { command: 'cat /etc/nginx/conf.d/default.conf', purpose: 'Is it your Nginx file?' },
  { command: 'nginx -t', purpose: 'Are the Nginx settings correct?' },
  { command: 'exit', purpose: 'Leave the container.' },
]

const START_PROBLEMS = [
  {
    key: 'allocated',
    label: <InlineCode>port is already allocated</InlineCode>,
    value: 'Another container or program uses the port. Find it and stop it, or use another port',
  },
  {
    key: 'name',
    label: <InlineCode>container name is already in use</InlineCode>,
    value: 'An old container has this name. Rename it, or remove it if you do not need it',
  },
  {
    key: 'restarting',
    label: <InlineCode>Restarting (1)</InlineCode>,
    value: 'The app crashes again and again. Read docker logs, then check the Nginx settings',
  },
  {
    key: 'format',
    label: <InlineCode>exec format error</InlineCode>,
    value: 'Image and server types differ, such as amd64 and arm64. Build for the server type',
  },
  {
    key: 'oom',
    label: <InlineCode>Exited (137)</InlineCode>,
    value: 'It was killed. With oom=true, give more memory. Otherwise someone stopped it',
  },
  {
    key: 'emerg',
    label: <InlineCode>nginx: [emerg]</InlineCode>,
    value: 'Mistake in nginx.conf. The log shows the line. Fix it and build a new version',
  },
]

const PULL_PROBLEMS = [
  {
    key: 'unknown',
    label: <InlineCode>manifest unknown</InlineCode>,
    value: 'This tag does not exist on Docker Hub. Check the version, or push it first',
  },
  {
    key: 'denied',
    label: <InlineCode>pull access denied</InlineCode>,
    value: 'Wrong name, or the image is private. Run docker login on the server',
  },
  {
    key: 'limit',
    label: <InlineCode>toomanyrequests</InlineCode>,
    value: 'Docker Hub download limit. Run docker login, or wait',
  },
  {
    key: 'space',
    label: <InlineCode>no space left on device</InlineCode>,
    value: 'Disk is full. Check df -h and docker system df, then remove old images by name',
  },
  {
    key: 'socket',
    label: <InlineCode>permission denied ... docker.sock</InlineCode>,
    value: 'Your user is not in the docker group. Use sudo, or add it and log in again',
  },
  {
    key: 'daemon',
    label: <InlineCode>Cannot connect to the Docker daemon</InlineCode>,
    value: 'Docker is not running. Start it with sudo systemctl start docker',
  },
]

const BROWSER_PROBLEMS = [
  {
    key: 'timeout',
    label: 'Browser keeps loading (timeout)',
    value: 'Firewall or security group. Open port 80',
  },
  {
    key: 'refused',
    label: 'Connection refused',
    value: 'Nothing listens on that port. Check docker ps and docker port',
  },
  { key: '502', label: '502 Bad Gateway', value: 'The proxy works, but the app behind it is down' },
  {
    key: '403',
    label: '403 Forbidden',
    value: 'Files are missing or cannot be read. Look inside the container',
  },
  {
    key: '404',
    label: '404 after refresh on an inner page',
    value: 'try_files ... /index.html is missing in nginx.conf',
  },
  {
    key: 'welcome',
    label: 'Welcome to nginx!',
    value: 'App files are missing. Check COPY --from=build in the Dockerfile',
  },
  {
    key: 'blank',
    label: 'White page',
    value: 'Open the console (F12). Usually a JavaScript error or a missing assets file',
  },
  {
    key: 'old',
    label: 'Old version shows',
    value: 'Check the running image (4). If correct, refresh with Ctrl+F5',
  },
  {
    key: 'dns',
    label: 'Name not found',
    value: 'DNS problem. Try the IP address, then check the name with dig',
  },
]

const EXIT_CODES = [
  { key: '0', label: '0', value: 'Stopped normally' },
  { key: '1', label: '1', value: 'The app failed. Read the logs' },
  { key: '125', label: '125', value: 'The docker run command itself failed' },
  { key: '126', label: '126', value: 'The command in the container cannot run' },
  { key: '127', label: '127', value: 'The command in the container was not found' },
  { key: '137', label: '137', value: 'Killed, often not enough memory' },
  { key: '143', label: '143', value: 'Asked to stop, such as docker stop' },
]

export function SolveIssues() {
  return (
    <StepPage id="docker-solve-issues">
      <Note>
        Users cannot reach the site? <strong>Roll back first</strong>, then find the cause.
      </Note>
      <SectionTitle>Check in this order</SectionTitle>
      <Paragraph>Start inside and go outside. Stop at the first wrong answer.</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={ORDER} />
      <SectionTitle>Look inside the container</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={INSIDE} />
      <SectionTitle>Image does not download</SectionTitle>
      <ReferenceTable caption="Pull problems" headers={['Error', 'Fix']} rows={PULL_PROBLEMS} />
      <SectionTitle>Container does not start</SectionTitle>
      <ReferenceTable caption="Start problems" headers={['Error', 'Fix']} rows={START_PROBLEMS} />
      <SectionTitle>Website does not work</SectionTitle>
      <ReferenceTable
        caption="Website problems"
        headers={['You see', 'Fix']}
        rows={BROWSER_PROBLEMS}
      />
      <SectionTitle>Exit codes</SectionTitle>
      <ReferenceTable caption="Exit codes" headers={['Code', 'Meaning']} rows={EXIT_CODES} />
      <SectionTitle>How to fix it correctly</SectionTitle>
      <NumberedList>
        <li>Do not repair files inside the running container. They are lost with it.</li>
        <li>Fix the code, the Dockerfile or nginx.conf in Git.</li>
        <li>
          Build a <strong>new</strong> version and check the image again.
        </li>
        <li>Push it, and update the server.</li>
        <li>Write down the cause, the fix and how to prevent it.</li>
      </NumberedList>
    </StepPage>
  )
}

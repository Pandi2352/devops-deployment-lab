import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const GO: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the project, for the script.' },
]

const STOP: Command[] = [
  { command: 'sudo systemctl stop nginx', purpose: 'Stop the service.' },
  {
    command: './scripts/health-check.sh http://localhost',
    purpose: 'Read the error: FAILED with 000.',
  },
  { command: 'sudo systemctl start nginx', purpose: 'Start it again.' },
  { command: './scripts/health-check.sh http://localhost', purpose: 'It prints OK.' },
]

const PERMISSION: Command[] = [
  {
    command: 'sudo chmod 000 /var/www/html/index.nginx-debian.html',
    purpose: 'Remove all permissions from the page.',
  },
  {
    command: './scripts/health-check.sh http://localhost',
    purpose: 'Read the error: FAILED with 403.',
  },
  { command: 'sudo tail -2 /var/log/nginx/error.log', purpose: 'Find the reason in the log.' },
  {
    command: 'sudo chmod 644 /var/www/html/index.nginx-debian.html',
    purpose: 'Give the permissions back.',
  },
  { command: './scripts/health-check.sh http://localhost', purpose: 'It prints OK.' },
]

const CONFIG: Command[] = [
  {
    command: 'sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak',
    purpose: 'Make a backup before you change anything.',
  },
  {
    command: 'echo "wrongword" | sudo tee -a /etc/nginx/nginx.conf',
    purpose: 'Add a wrong word at the end of the file.',
  },
  { command: 'sudo nginx -t', purpose: 'Test the configuration and read the message.' },
  {
    command: 'sudo mv /etc/nginx/nginx.conf.bak /etc/nginx/nginx.conf',
    purpose: 'Undo it with the backup.',
  },
  { command: 'sudo nginx -t', purpose: 'The test is successful again.' },
]

const FINISH: Command[] = [
  {
    command: 'sudo systemctl disable --now nginx',
    purpose: 'Stop Nginx and do not start it again, so port 80 is free.',
  },
]

export function BreakIt() {
  return (
    <StepPage id="linux-break-it">
      <CommandBlock terminal="Ubuntu" commands={GO} />
      <SectionTitle>1. Stop the service</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={STOP} />
      <SectionTitle>2. Wrong permission</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PERMISSION} />
      <SectionTitle>3. Wrong configuration</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CONFIG} />
      <Note>
        Always run <InlineCode>nginx -t</InlineCode> before you reload Nginx.
      </Note>
      <Paragraph>When finished:</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={FINISH} />
    </StepPage>
  )
}

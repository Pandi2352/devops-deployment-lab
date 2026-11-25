import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const WATCH: Command[] = [
  {
    command: 'sudo tail -f /var/log/nginx/access.log',
    purpose: 'Show new log lines as they arrive. Stop it with Ctrl+C.',
  },
]

const REQUESTS: Command[] = [
  { command: 'curl http://localhost', purpose: 'A line with 200 appears in the log.' },
  { command: 'curl -I http://localhost/missing', purpose: 'A line with 404 appears.' },
  {
    command: 'curl -I http://localhost:8080',
    purpose: 'No line appears: the request never reached Nginx.',
  },
]

const READ_LOGS: Command[] = [
  {
    command: 'sudo tail -5 /var/log/nginx/error.log',
    purpose: 'Show the last 5 errors. It can be empty.',
  },
  {
    command: 'sudo journalctl -u nginx --since "10 minutes ago" --no-pager',
    purpose: 'Show what systemd recorded for Nginx, such as start and stop.',
  },
  {
    command: "sudo awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c",
    purpose: 'Count the answers by status code.',
  },
  {
    command: 'sudo grep " 404 " /var/log/nginx/access.log',
    purpose: 'Show only the requests that got 404.',
  },
]

const PACKAGES: Command[] = [
  { command: 'apt list --upgradable', purpose: 'Show software that has updates.' },
  { command: 'apt show nginx', purpose: 'Show details of one package.' },
]

export function Day6() {
  return (
    <StepPage id="day-6">
      <Paragraph>Logs tell you why something failed. Use two Ubuntu windows.</Paragraph>
      <SectionTitle>Window 1: watch the log</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={WATCH} />
      <SectionTitle>Window 2: make requests</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={REQUESTS} />
      <SectionTitle>Read logs</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={READ_LOGS} />
      <SectionTitle>Packages</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PACKAGES} />
      <SectionTitle>Small test</SectionTitle>
      <NumberedList>
        <li>
          How many <InlineCode>404</InlineCode> answers does your log have?
        </li>
        <li>Which log shows the time Nginx was stopped?</li>
        <li>Why is there no log line for port 8080?</li>
      </NumberedList>
    </StepPage>
  )
}

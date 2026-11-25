import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const PROCESSES: Command[] = [
  { command: 'ps aux | head', purpose: 'List running programs, first 10 lines.' },
  { command: 'top', purpose: 'Show live CPU and memory. Press q to leave.' },
  {
    command: 'sleep 300 &',
    purpose: 'Start a program that waits 300 seconds. & runs it in the background.',
  },
  { command: 'jobs', purpose: 'List your background programs.' },
  {
    command: 'ps aux | grep sleep',
    purpose: 'Find one program. The number in column 2 is its process id (PID).',
  },
  { command: 'kill %1', purpose: 'Stop background job 1. kill <PID> also works.' },
  { command: 'free -h', purpose: 'Show memory.' },
]

const SERVICES: Command[] = [
  { command: 'sudo apt update', purpose: 'Refresh the list of available software.' },
  {
    command: 'sudo apt install -y nginx',
    purpose: 'Install the Nginx web server. -y answers yes.',
  },
  {
    command: 'systemctl status nginx --no-pager',
    purpose: 'Is the service running? Look for active (running).',
  },
  { command: 'curl -I http://localhost', purpose: 'Ask for the website headers. 200 OK.' },
  { command: 'sudo systemctl stop nginx', purpose: 'Stop the service.' },
  { command: 'curl -I http://localhost', purpose: 'Try again. Failed to connect.' },
  { command: 'sudo systemctl start nginx', purpose: 'Start it again.' },
  { command: 'curl -I http://localhost', purpose: 'It works again. 200 OK.' },
]

const OUTPUT = [
  {
    key: 'active',
    label: <InlineCode>active (running)</InlineCode>,
    value: 'The service is working now',
  },
  {
    key: 'enabled',
    label: <InlineCode>enabled</InlineCode>,
    value: 'It starts by itself when Linux starts',
  },
  { key: 'pid', label: <InlineCode>Main PID</InlineCode>, value: 'The id of the main process' },
  {
    key: 'failed',
    label: <InlineCode>Failed to connect</InlineCode>,
    value: 'Nothing listens on that port: the service is down or the port is wrong',
  },
]

export function Day3() {
  return (
    <StepPage id="day-3">
      <Paragraph>
        A <strong>process</strong> is a running program. A <strong>service</strong> is a program
        that systemd runs in the background.
      </Paragraph>
      <SectionTitle>Processes</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PROCESSES} />
      <SectionTitle>Your first service: Nginx</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={SERVICES} />
      <SectionTitle>Read the output</SectionTitle>
      <ReferenceTable
        caption="Service output meaning"
        headers={['Output', 'Meaning']}
        rows={OUTPUT}
      />
    </StepPage>
  )
}

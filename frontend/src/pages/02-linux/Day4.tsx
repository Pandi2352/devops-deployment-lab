import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const NETWORK: Command[] = [
  { command: 'ip addr', purpose: 'Show your network addresses. Look for inet under eth0.' },
  {
    command: 'ping -c 3 google.com',
    purpose: 'Can I reach this server? Sends 3 tests. Some networks block it.',
  },
  { command: 'ss -tlnp', purpose: 'Show which ports are listening.' },
  { command: 'sudo ss -tlnp', purpose: 'Same, and also show the program of each port.' },
  { command: 'curl -I https://github.com', purpose: 'Ask a website for its headers.' },
  { command: 'sudo apt install -y bind9-dnsutils', purpose: 'Install the dig tool.' },
  { command: 'dig github.com +short', purpose: 'Change a name into an IP address (DNS).' },
]

const ERRORS: Command[] = [
  {
    command: 'curl -I http://localhost/missing',
    purpose: 'Ask for a page that does not exist. 404: the server works, the page is missing.',
  },
  {
    command: 'curl -I http://localhost:8080',
    purpose: 'Ask a port where nothing listens. Failed to connect.',
  },
]

const PORTS = [
  { key: '22', label: '22', value: 'SSH' },
  { key: '80', label: '80', value: 'HTTP' },
  { key: '443', label: '443', value: 'HTTPS' },
  { key: '8080', label: '8080', value: 'Our container' },
]

const ADDRESSES = [
  {
    key: 'local',
    label: <InlineCode>127.0.0.1</InlineCode>,
    value: 'Only this machine (localhost)',
  },
  {
    key: 'all',
    label: <InlineCode>0.0.0.0</InlineCode>,
    value: 'All addresses: anyone who can reach the machine can connect',
  },
]

export function Day4() {
  return (
    <StepPage id="day-4">
      <CommandBlock terminal="Ubuntu" commands={NETWORK} />
      <SectionTitle>Ports</SectionTitle>
      <ReferenceTable caption="Common ports" headers={['Port', 'Use']} rows={PORTS} />
      <SectionTitle>Addresses</SectionTitle>
      <ReferenceTable
        caption="Listening addresses"
        headers={['Address', 'Meaning']}
        rows={ADDRESSES}
      />
      <SectionTitle>Two different errors</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={ERRORS} />
      <Paragraph>
        <strong>When a site is down, check in this order:</strong> DNS, then the port, then the
        answer of the server.
      </Paragraph>
    </StepPage>
  )
}

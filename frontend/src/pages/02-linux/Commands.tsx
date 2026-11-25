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
    title: 'Files',
    items: [
      { command: 'pwd', use: 'Where am I' },
      { command: 'ls -lah', use: 'List files with details' },
      { command: 'cat file', use: 'Show a file' },
      { command: 'cp a b', use: 'Copy' },
      { command: 'mv a b', use: 'Rename or move' },
      { command: 'rm file', use: 'Delete' },
      { command: 'grep -rn "text" .', use: 'Find text inside files' },
      { command: 'find . -name "*.txt"', use: 'Find files by name' },
      { command: 'df -h', use: 'Free disk space' },
      { command: 'du -sh folder', use: 'Size of a folder' },
    ],
  },
  {
    title: 'Permissions',
    items: [
      { command: 'ls -l', use: 'Show permissions and owner' },
      { command: 'chmod 600 file', use: 'Change permissions' },
      { command: 'sudo chown user file', use: 'Change the owner' },
      { command: 'id', use: 'Show your groups' },
    ],
  },
  {
    title: 'Processes and services',
    items: [
      { command: 'ps aux', use: 'List running programs' },
      { command: 'top', use: 'Live CPU and memory' },
      { command: 'kill <PID>', use: 'Stop a program' },
      { command: 'systemctl status name', use: 'State of a service' },
      { command: 'sudo systemctl start name', use: 'Start a service' },
      { command: 'sudo systemctl stop name', use: 'Stop a service' },
      { command: 'sudo systemctl disable --now name', use: 'Stop it and do not start it again' },
    ],
  },
  {
    title: 'Network',
    items: [
      { command: 'ip addr', use: 'Show your addresses' },
      { command: 'sudo ss -tlnp', use: 'Which program uses which port' },
      { command: 'curl -I <url>', use: 'Headers and status of a website' },
      { command: 'dig <name> +short', use: 'IP address of a name' },
      { command: 'ssh <user>@<server>', use: 'Log in to a server' },
    ],
  },
  {
    title: 'Logs and packages',
    items: [
      { command: 'sudo tail -f file', use: 'Watch a log live' },
      { command: 'sudo journalctl -u name --no-pager', use: 'Log of a service' },
      { command: 'sudo apt update', use: 'Refresh the software list' },
      { command: 'sudo apt install -y name', use: 'Install software' },
      { command: 'sudo nginx -t', use: 'Test the Nginx configuration' },
    ],
  },
]

export function Commands() {
  return (
    <StepPage id="linux-commands">
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

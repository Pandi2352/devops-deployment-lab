import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const PROMPTS = [
  {
    key: 'ubuntu',
    label: <InlineCode>user@computer:~$</InlineCode>,
    value: 'Ubuntu (Linux)',
  },
  {
    key: 'powershell',
    label: <InlineCode>{'PS C:\\Users\\name>'}</InlineCode>,
    value: 'PowerShell (Windows)',
  },
]

const CHECK_ADMIN: Command[] = [
  { command: 'id', purpose: 'Show your user and groups. You need the sudo group.' },
  {
    command: 'sudo whoami',
    purpose: 'Run one command as the administrator. It must print root.',
  },
]

const FIX_ADMIN: Command[] = [
  {
    command: 'wsl -d Ubuntu -u root -- usermod -aG sudo <USER>',
    purpose: 'Add your user to the sudo group. -a keeps your other groups.',
  },
  {
    command: 'wsl -d Ubuntu -u root -- id <USER>',
    purpose: 'Check it. You must see 27(sudo).',
  },
  {
    command: 'wsl --terminate Ubuntu',
    purpose: 'Restart Ubuntu, because groups are read only at login.',
  },
]

const RESET_PASSWORD: Command[] = [
  {
    command: 'wsl -d Ubuntu -u root -- passwd <USER>',
    purpose: 'Set a new password, only if you forgot it. Nothing shows while you type.',
  },
]

const CHECK_SYSTEMD: Command[] = [
  {
    command: 'ps -p 1 -o comm=',
    purpose: 'Show the first program Linux started. If it prints systemd, skip to the end.',
  },
  { command: 'cat /etc/wsl.conf', purpose: 'Show the WSL settings file.' },
]

const ENABLE_SYSTEMD: Command[] = [
  {
    command: "printf '\\n[boot]\\nsystemd=true\\n' | sudo tee -a /etc/wsl.conf",
    purpose: 'Add the setting at the end of the file. -a keeps what is there. Run it only once.',
  },
  { command: 'cat /etc/wsl.conf', purpose: 'Check that [boot] appears only once.' },
]

const WSL_CONF = `[user]
default=<USER>

[boot]
systemd=true`

const RESTART_WSL: Command[] = [
  {
    command: 'wsl --shutdown',
    purpose: 'Stop WSL, so it reads the new setting. This also stops Docker.',
  },
  { command: 'wsl -l -v', purpose: 'Check it. Ubuntu must show Stopped.' },
]

const CONFIRM: Command[] = [
  { command: 'ps -p 1 -o comm=', purpose: 'It must print systemd.' },
  {
    command: 'systemctl is-system-running',
    purpose: 'Check the system state. running or degraded is fine.',
  },
  {
    command: 'mkdir -p ~/lab && cd ~/lab',
    purpose: 'Create the practice folder and go into it.',
  },
]

export function Setup() {
  return (
    <StepPage id="linux-setup">
      <SectionTitle>Know your terminal</SectionTitle>
      <ReferenceTable
        caption="How to recognize the terminal"
        headers={['Prompt', 'You are in']}
        rows={PROMPTS}
      />

      <SectionTitle>Check admin access</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHECK_ADMIN} />
      <Paragraph>
        If sudo refuses your user, fix it in PowerShell. Replace{' '}
        <InlineCode>{'<USER>'}</InlineCode> with your Ubuntu username.
      </Paragraph>
      <CommandBlock commands={FIX_ADMIN} />
      <CommandBlock commands={RESET_PASSWORD} />

      <SectionTitle>Turn on systemd</SectionTitle>
      <Paragraph>systemd runs services and logs. You need it on days 3 and 6.</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={CHECK_SYSTEMD} />
      <CommandBlock terminal="Ubuntu" commands={ENABLE_SYSTEMD} />
      <CodeBlock
        language="INI"
        file="/etc/wsl.conf"
        purpose="How the file should look now."
        code={WSL_CONF}
      />
      <CommandBlock commands={RESTART_WSL} />
      <Note>Open Ubuntu again from the Start menu.</Note>
      <CommandBlock terminal="Ubuntu" commands={CONFIRM} />
    </StepPage>
  )
}

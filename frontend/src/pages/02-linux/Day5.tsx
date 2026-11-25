import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const CHECK_KEY: Command[] = [
  {
    command: 'ls -la ~/.ssh',
    purpose: 'Check for an existing key. No such file is fine. If id_ed25519 exists, keep it.',
  },
]

const CREATE_KEY: Command[] = [
  {
    command: 'ssh-keygen -t ed25519 -C "devops-lab"',
    purpose: 'Create a key pair. Press Enter for the location, then type a passphrase twice.',
  },
  { command: 'ls -l ~/.ssh', purpose: 'Check the permissions of the new files.' },
  { command: 'cat ~/.ssh/id_ed25519.pub', purpose: 'Show the public key. It goes on servers.' },
  {
    command: 'ssh-keygen -lf ~/.ssh/id_ed25519.pub',
    purpose: 'Show the fingerprint, a short id of the key.',
  },
]

const PASSPHRASE: Command[] = [
  {
    command: 'ssh-keygen -p -f ~/.ssh/id_ed25519',
    purpose: 'Add or change the passphrase of an existing key.',
  },
]

const KEY_FILES = [
  {
    key: 'folder',
    label: <InlineCode>~/.ssh (700)</InlineCode>,
    value: 'Only you can open the folder',
  },
  {
    key: 'private',
    label: <InlineCode>id_ed25519 (600)</InlineCode>,
    value: 'Private key: never share or commit it',
  },
  {
    key: 'public',
    label: <InlineCode>id_ed25519.pub (644)</InlineCode>,
    value: 'Public key: can be shared',
  },
]

const START_SERVER: Command[] = [
  {
    command: 'sudo apt install -y openssh-server',
    purpose: 'Install the program that accepts SSH logins.',
  },
  { command: 'sudo systemctl start ssh', purpose: 'Start it.' },
  { command: "sudo ss -tlnp | grep ':22 '", purpose: 'Check that port 22 is listening.' },
  {
    command: 'cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys',
    purpose: 'Allow your key to log in. >> keeps the keys already there.',
  },
  {
    command: 'chmod 600 ~/.ssh/authorized_keys',
    purpose: 'Only you can read and write the list of allowed keys.',
  },
  {
    command: 'ssh $USER@localhost',
    purpose: 'Log in. The first time, compare the fingerprint and type yes.',
  },
]

const INSIDE: Command[] = [
  { command: 'whoami', purpose: 'Show your user on the server.' },
  {
    command: 'echo $SSH_CONNECTION',
    purpose: 'Shows addresses only when you are connected through SSH.',
  },
  { command: 'exit', purpose: 'Leave the SSH session.' },
]

const STOP_SERVER: Command[] = [
  {
    command: 'sudo systemctl disable --now ssh.service ssh.socket',
    purpose: 'Stop SSH and do not start it again. Your laptop does not need it.',
  },
  { command: "sudo ss -tlnp | grep ':22 '", purpose: 'No output means port 22 is closed.' },
  {
    command: 'systemctl is-active ssh.service ssh.socket',
    purpose: 'Both must print inactive.',
  },
]

export function Day5() {
  return (
    <StepPage id="day-5">
      <Paragraph>
        SSH is how you log in to a server. A key pair replaces the password: the private key stays
        with you, the public key goes on the server.
      </Paragraph>
      <SectionTitle>Create a key</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHECK_KEY} />
      <CommandBlock terminal="Ubuntu" commands={CREATE_KEY} />
      <ReferenceTable
        caption="SSH files"
        headers={['File', 'Meaning']}
        rows={KEY_FILES}
      />
      <Note>
        The <InlineCode>.pub</InlineCode> file can be shared. The other file is{' '}
        <strong>private</strong>: never share or commit it.
      </Note>
      <CommandBlock terminal="Ubuntu" commands={PASSPHRASE} />

      <SectionTitle>Practice a real login</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={START_SERVER} />
      <Paragraph>Inside the SSH session:</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={INSIDE} />
      <Paragraph>Turn it off again:</Paragraph>
      <CommandBlock terminal="Ubuntu" commands={STOP_SERVER} />
    </StepPage>
  )
}

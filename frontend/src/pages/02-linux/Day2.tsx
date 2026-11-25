import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const CHANGE_MODE: Command[] = [
  { command: 'ls -l note.txt', purpose: 'Show the permissions and the owner.' },
  { command: 'chmod 600 note.txt', purpose: 'Only the owner can read and write.' },
  { command: 'chmod u+x note.txt', purpose: 'Let the owner also run the file. u-x removes it.' },
  { command: 'whoami', purpose: 'Show your user name.' },
  { command: 'id', purpose: 'Show your groups.' },
]

const CHANGE_OWNER: Command[] = [
  { command: 'sudo chown root note.txt', purpose: 'Make root the owner.' },
  { command: 'ls -l note.txt', purpose: 'See the new owner.' },
  { command: 'cat note.txt', purpose: 'Try to read it. You get Permission denied.' },
  { command: 'sudo cat note.txt', purpose: 'Read it as root. This works.' },
  {
    command: 'sudo chown $USER note.txt',
    purpose: 'Give it back to you. $USER is your user name.',
  },
]

const NUMBERS = [
  { key: 'r', label: <InlineCode>r = 4</InlineCode>, value: 'Read' },
  { key: 'w', label: <InlineCode>w = 2</InlineCode>, value: 'Write' },
  { key: 'x', label: <InlineCode>x = 1</InlineCode>, value: 'Run. For a folder: enter it' },
]

const EXAMPLES = [
  {
    key: '600',
    label: <InlineCode>600 = rw-------</InlineCode>,
    value: 'Only the owner reads and writes. Used for SSH keys',
  },
  {
    key: '640',
    label: <InlineCode>640 = rw-r-----</InlineCode>,
    value: 'Owner reads and writes, group reads, others nothing',
  },
  {
    key: '644',
    label: <InlineCode>644 = rw-r--r--</InlineCode>,
    value: 'Owner reads and writes, everyone else reads',
  },
  {
    key: '755',
    label: <InlineCode>755 = rwxr-xr-x</InlineCode>,
    value: 'Owner does everything, everyone else reads and runs',
  },
]

export function Day2() {
  return (
    <StepPage id="day-2">
      <SectionTitle>Change permissions</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHANGE_MODE} />
      <SectionTitle>How to read the numbers</SectionTitle>
      <Paragraph>Add the numbers. The order is owner, group, others.</Paragraph>
      <ReferenceTable
        caption="Permission numbers"
        headers={['Number', 'Meaning']}
        rows={NUMBERS}
      />
      <ReferenceTable
        caption="Permission examples"
        headers={['Permission', 'Meaning']}
        rows={EXAMPLES}
      />
      <SectionTitle>Change the owner</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CHANGE_OWNER} />
      <Paragraph>
        <strong>Why it matters:</strong> an SSH key must be <InlineCode>600</InlineCode>, and
        containers should not run as root.
      </Paragraph>
      <SectionTitle>Small test</SectionTitle>
      <NumberedList>
        <li>
          Which number gives <InlineCode>rwxr-xr-x</InlineCode>?
        </li>
        <li>
          What does <InlineCode>chmod 644</InlineCode> allow?
        </li>
        <li>
          Make <InlineCode>ports.txt</InlineCode> readable and writable only by you.
        </li>
      </NumberedList>
    </StepPage>
  )
}

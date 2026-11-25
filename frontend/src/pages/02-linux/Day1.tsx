import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, NumberedList, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const FOLDERS = [
  { key: 'etc', label: <InlineCode>/etc</InlineCode>, value: 'Configuration' },
  { key: 'log', label: <InlineCode>/var/log</InlineCode>, value: 'Logs' },
  { key: 'home', label: <InlineCode>/home</InlineCode>, value: 'User files' },
  { key: 'opt', label: <InlineCode>/opt</InlineCode>, value: 'Extra software' },
  { key: 'tmp', label: <InlineCode>/tmp</InlineCode>, value: 'Temporary files' },
]

const FILES: Command[] = [
  { command: 'cd ~/lab', purpose: 'Go to the practice folder. ~ is your home folder.' },
  { command: 'pwd', purpose: 'Show which folder you are in.' },
  {
    command: 'echo "hello devops" > note.txt',
    purpose: 'Write text into a file. > replaces the old text, >> adds to the end.',
  },
  { command: 'ls -lah', purpose: 'List files with size, owner and hidden files.' },
  { command: 'cat note.txt', purpose: 'Show the content of the file.' },
  { command: 'cp note.txt copy.txt', purpose: 'Copy the file.' },
  { command: 'mv copy.txt renamed.txt', purpose: 'Rename the file. mv also moves files.' },
  { command: 'rm renamed.txt', purpose: 'Delete the file. There is no recycle bin.' },
]

const SEARCH: Command[] = [
  {
    command: 'find /etc -name "*.conf" 2>/dev/null | head',
    purpose: 'Find files by name and show the first 10. 2>/dev/null hides errors.',
  },
  {
    command: 'grep -rn "hello" .',
    purpose: 'Find text inside all files here. -r searches folders, -n shows line numbers.',
  },
  { command: 'head /etc/passwd', purpose: 'Show the first 10 lines of the user list.' },
  { command: 'df -h', purpose: 'Show free disk space.' },
  { command: 'du -sh ~/lab', purpose: 'Show the size of one folder.' },
]

const EDIT: Command[] = [
  {
    command: "sed -i 's/port 43$/port 443/' ports.txt",
    purpose: 'Change text inside a file without opening it. $ means end of line.',
  },
]

export function Day1() {
  return (
    <StepPage id="day-1">
      <SectionTitle>Important folders</SectionTitle>
      <ReferenceTable
        caption="Important Linux folders"
        headers={['Folder', 'Contains']}
        rows={FOLDERS}
      />
      <SectionTitle>Create, copy, rename, delete</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={FILES} />
      <SectionTitle>Search and disk</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={SEARCH} />
      <SectionTitle>Small test</SectionTitle>
      <NumberedList>
        <li>
          Create <InlineCode>server.txt</InlineCode> with the text <InlineCode>port 80</InlineCode>.
        </li>
        <li>
          Add a second line, <InlineCode>port 443</InlineCode>.
        </li>
        <li>
          Show only the line with <InlineCode>443</InlineCode>.
        </li>
        <li>
          Rename the file to <InlineCode>ports.txt</InlineCode>.
        </li>
      </NumberedList>
      <SectionTitle>If you typed a wrong number</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={EDIT} />
    </StepPage>
  )
}

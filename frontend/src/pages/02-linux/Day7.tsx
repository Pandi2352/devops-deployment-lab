import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const CREATE: Command[] = [
  {
    command: 'cd /mnt/d/devops/react-devops',
    purpose: 'Go to the project. /mnt/d is the Windows D: drive.',
  },
  {
    command: 'nano scripts/health-check.sh',
    purpose: 'Open a text editor. Save with Ctrl+O then Enter, leave with Ctrl+X.',
  },
  { command: 'cat scripts/health-check.sh', purpose: 'Check that the file was saved.' },
]

const SCRIPT = `#!/usr/bin/env bash
set -euo pipefail

url="\${1:?Usage: ./scripts/health-check.sh <url>}"
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$url" || true)

if [[ "$code" == "200" ]]; then
  echo "OK: $url"
else
  echo "FAILED: $url returned $code"
  exit 1
fi`

const LINES = [
  {
    key: 'shebang',
    label: <InlineCode>#!/usr/bin/env bash</InlineCode>,
    value: 'Run this file with bash',
  },
  {
    key: 'set',
    label: <InlineCode>set -euo pipefail</InlineCode>,
    value: 'Stop on errors and on missing variables',
  },
  {
    key: 'arg',
    label: <InlineCode>{'${1:?...}'}</InlineCode>,
    value: 'The first value you give. Shows the usage text if it is missing',
  },
  {
    key: 'curl',
    label: <InlineCode>{"-w '%{http_code}'"}</InlineCode>,
    value: 'Get only the status code',
  },
  { key: 'time', label: <InlineCode>--max-time 5</InlineCode>, value: 'Give up after 5 seconds' },
  {
    key: 'true',
    label: <InlineCode>|| true</InlineCode>,
    value: 'Do not stop if curl fails. The script handles it below',
  },
  {
    key: 'exit',
    label: <InlineCode>exit 1</InlineCode>,
    value: 'Report failure. 0 is success, anything else is failure',
  },
]

const RUN: Command[] = [
  { command: 'chmod +x scripts/health-check.sh', purpose: 'Make the file runnable.' },
  { command: './scripts/health-check.sh http://localhost', purpose: 'Prints OK.' },
  { command: 'echo $?', purpose: 'Show the exit code of the last command: 0.' },
  {
    command: './scripts/health-check.sh http://localhost/missing',
    purpose: 'Prints FAILED with 404.',
  },
  { command: 'echo $?', purpose: 'Now it is 1.' },
  {
    command: './scripts/health-check.sh http://localhost:8080',
    purpose: 'Prints FAILED with 000, which means no connection.',
  },
  { command: './scripts/health-check.sh', purpose: 'Without a value, it prints the usage text.' },
]

const SAVE: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch phase-2-linux', purpose: 'Use the branch of this phase.' },
  { command: 'git add scripts/health-check.sh', purpose: 'Choose the new script.' },
  {
    command: 'git update-index --chmod=+x scripts/health-check.sh',
    purpose: 'Save the run permission in Git, because Windows does not keep it.',
  },
  { command: 'git status', purpose: 'Check what will be saved.' },
  { command: 'git commit -m "Add health check script"', purpose: 'Save it.' },
  { command: 'git push', purpose: 'Upload it.' },
]

export function Day7() {
  return (
    <StepPage id="day-7">
      <Paragraph>
        A script saves commands in a file, so you can run them again. This one checks a website.
        You will reuse this idea as a health check in CI/CD.
      </Paragraph>
      <SectionTitle>Create it</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={CREATE} />
      <CodeBlock
        language="Bash"
        file="scripts/health-check.sh"
        purpose="Reports OK or FAILED for a website address."
        code={SCRIPT}
      />
      <ReferenceTable caption="Script lines" headers={['Part', 'Meaning']} rows={LINES} />
      <SectionTitle>Run it</SectionTitle>
      <Note>
        Nginx must be running. CI/CD tools decide pass or fail from the exit code.
      </Note>
      <CommandBlock terminal="Ubuntu" commands={RUN} />
      <SectionTitle>Save it in Git</SectionTitle>
      <Paragraph>
        Files on the Windows drive may not save the executable flag in Git, so{' '}
        <InlineCode>git update-index</InlineCode> sets it. Do the same for later scripts.
      </Paragraph>
      <CommandBlock commands={SAVE} />
    </StepPage>
  )
}

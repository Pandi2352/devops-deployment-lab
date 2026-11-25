import { InlineCommand } from '../../components/CommandText'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const ERRORS = [
  {
    key: 'no-file',
    label: <InlineCode>No such file or directory</InlineCode>,
    value: 'The path is wrong. Check dots, slashes and spelling. Press Tab to complete names',
  },
  {
    key: 'denied',
    label: <InlineCode>Permission denied</InlineCode>,
    value: (
      <>
        Run <InlineCommand command="ls -l" /> and check the owner and permissions
      </>
    ),
  },
  {
    key: 'not-found',
    label: <InlineCode>command not found</InlineCode>,
    value: 'Wrong spelling, not installed, or the wrong terminal. wsl works only in PowerShell',
  },
  {
    key: 'sudo',
    label: <InlineCode>{"I'm afraid I can't do that"}</InlineCode>,
    value: 'Your user is not in the sudo group. See Prepare Ubuntu',
  },
  {
    key: 'connect',
    label: <InlineCode>Failed to connect</InlineCode>,
    value: 'The service is down or the port is wrong',
  },
  {
    key: 'host-key',
    label: <InlineCode>Host key verification failed</InlineCode>,
    value: 'You did not type yes. Compare the fingerprint first, then type yes',
  },
  {
    key: 'interpreter',
    label: <InlineCode>bad interpreter: ^M</InlineCode>,
    value: 'The script has Windows line endings. Save it with LF',
  },
]

const TYPOS = [
  {
    key: 'path',
    label: <InlineCode>/etc/wsl/conf</InlineCode>,
    value: <InlineCode>/etc/wsl.conf</InlineCode>,
  },
  {
    key: 'dash',
    label: <InlineCode>grep /rn "hello"</InlineCode>,
    value: (
      <>
        <InlineCommand command={'grep -rn "hello" .'} />
        <span className="block text-muted">Linux options start with a dash, not a slash.</span>
      </>
    ),
  },
  {
    key: 'ss',
    label: <InlineCode>sudo as -tlnp</InlineCode>,
    value: <InlineCommand command="sudo ss -tlnp" />,
  },
]

export function Mistakes() {
  return (
    <StepPage id="linux-mistakes">
      <Paragraph>Read the full error first. It usually names the problem.</Paragraph>
      <SectionTitle>Errors</SectionTitle>
      <ReferenceTable caption="Linux errors" headers={['Error', 'Fix']} rows={ERRORS} />
      <SectionTitle>Typing mistakes</SectionTitle>
      <ReferenceTable caption="Typing mistakes" headers={['Wrong', 'Correct']} rows={TYPOS} />
    </StepPage>
  )
}

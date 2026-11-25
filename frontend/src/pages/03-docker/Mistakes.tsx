import { InlineCommand } from '../../components/CommandText'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const ERRORS = [
  {
    key: 'argument',
    label: <InlineCode>flag needs an argument: --build-arg</InlineCode>,
    value: 'The command was split into two lines. Use \\ at the end of each line',
  },
  {
    key: 'local',
    label: <InlineCode>Unable to find image locally, pull access denied</InlineCode>,
    value: 'The image was not built, or its name is wrong',
  },
  {
    key: 'user',
    label: <InlineCode>DOCKERHUB_USER: No such file or directory</InlineCode>,
    value: 'Remove the < and > signs. In the terminal, < means read from a file',
  },
  {
    key: 'port',
    label: <InlineCode>port is already allocated</InlineCode>,
    value: (
      <>
        Another container uses it. Find it with <InlineCommand command="docker ps" />
      </>
    ),
  },
  {
    key: 'copy',
    label: <InlineCode>nginx.conf: not found</InlineCode>,
    value: 'Check the file name, and build from the repo root',
  },
  {
    key: 'welcome',
    label: <InlineCode>Welcome to nginx!</InlineCode>,
    value: (
      <>
        The app files are missing. Check <InlineCode>COPY --from=build</InlineCode>
      </>
    ),
  },
  {
    key: 'lock',
    label: <InlineCode>npm ci ... not in sync</InlineCode>,
    value: 'Run npm install in PowerShell inside frontend, then build again',
  },
  {
    key: 'wsl',
    label: <InlineCode>could not be found in this WSL 2 distro</InlineCode>,
    value: 'Turn on Ubuntu in Docker Desktop, WSL integration',
  },
  {
    key: 'denied',
    label: <InlineCode>denied: requested access to the resource is denied</InlineCode>,
    value: 'The image name does not match the account you logged in with',
  },
]

const NAMES = [
  {
    key: 'conf',
    label: <InlineCode>docker/nginx/nginx.config</InlineCode>,
    value: <InlineCode>docker/nginx/nginx.conf</InlineCode>,
  },
  {
    key: 'ignore',
    label: <InlineCode>frontend/.dockerignore</InlineCode>,
    value: <InlineCode>.dockerignore</InlineCode>,
  },
]

export function Mistakes() {
  return (
    <StepPage id="docker-mistakes">
      <Paragraph>Read the last lines of the error first.</Paragraph>
      <SectionTitle>Errors</SectionTitle>
      <ReferenceTable caption="Docker errors" headers={['Error', 'Fix']} rows={ERRORS} />
      <SectionTitle>File names</SectionTitle>
      <ReferenceTable caption="File names" headers={['Wrong', 'Correct']} rows={NAMES} />
    </StepPage>
  )
}

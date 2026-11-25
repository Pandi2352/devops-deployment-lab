import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { PageLink } from '../../components/PageLink'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const FLOW = [
  { key: '1', label: '1. Check the code', value: 'lint, test and build must pass' },
  { key: '2', label: '2. Merge', value: 'Pull request into main, then choose a version' },
  { key: '3', label: '3. Build the image', value: 'Code becomes an image with that version' },
  { key: '4', label: '4. Check the image', value: 'Test it on your laptop before anyone gets it' },
  { key: '5', label: '5. Push to Docker Hub', value: 'Upload the checked image' },
  { key: '6', label: '6. Pull on the server', value: 'The server downloads the same image' },
  { key: '7', label: '7. Run and check', value: 'Start it, check it, keep the old one ready' },
  { key: '8', label: '8. Roll back if needed', value: 'Start the old container again' },
]

const CODE: Command[] = [
  { command: 'cd D:\\devops\\react-devops\\frontend', purpose: 'Go to the app folder.' },
  { command: 'npm run lint', purpose: 'Check the code for mistakes.' },
  { command: 'npm test', purpose: 'Run the tests.' },
  { command: 'npm run build', purpose: 'Check that the production build works.' },
]

const MERGE: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch main', purpose: 'Release only from main.' },
  { command: 'git pull', purpose: 'Get the merged code.' },
  { command: 'git status', purpose: 'It must say working tree clean.' },
  {
    command: 'git rev-parse --short HEAD',
    purpose: 'Show the commit you release. Write it down next to the version.',
  },
]

const BUILD: Command[] = [
  { command: 'cd /mnt/d/devops/react-devops', purpose: 'Go to the project root.' },
  { command: 'VERSION=2.1', purpose: 'Save the new version in a variable. No spaces around =.' },
  { command: 'bash scripts/build.sh $VERSION', purpose: 'Build the image with this version.' },
  { command: 'docker images devops-lab', purpose: 'Check that the new version is listed.' },
]

const PUSH: Command[] = [
  { command: 'docker login', purpose: 'Log in to Docker Hub.' },
  {
    command: 'docker tag devops-lab:$VERSION <DOCKERHUB_USER>/devops-lab:$VERSION',
    purpose: 'Give the checked image a name with your account.',
  },
  {
    command: 'docker push <DOCKERHUB_USER>/devops-lab:$VERSION',
    purpose: 'Upload it. Copy the sha256 digest it prints at the end.',
  },
]

export function ReleaseFlow() {
  return (
    <StepPage id="docker-release-flow">
      <Paragraph>
        This is the path of one change, from your code to a running server. Later, GitHub Actions
        does steps 1 to 5 for you.
      </Paragraph>
      <ReferenceTable caption="Deployment flow" headers={['Step', 'What happens']} rows={FLOW} />

      <SectionTitle>Step 1: Check the code</SectionTitle>
      <CommandBlock commands={CODE} />

      <SectionTitle>Step 2: Merge and choose a version</SectionTitle>
      <Paragraph>Merge the pull request on the GitHub website first, then:</Paragraph>
      <CommandBlock commands={MERGE} />

      <SectionTitle>Step 3: Build the image</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={BUILD} />
      <Note>
        Use a new version every time. Never reuse a version, and do not deploy{' '}
        <InlineCode>latest</InlineCode>: you cannot know what is running or roll back safely.
      </Note>

      <SectionTitle>Step 4: Check the image</SectionTitle>
      <Paragraph>
        Do not push yet. First do{' '}
        <PageLink to="/phase-3/check-image">Check the image before push</PageLink>.
      </Paragraph>

      <SectionTitle>Step 5: Push to Docker Hub</SectionTitle>
      <Paragraph>
        Use the same Ubuntu window, so <InlineCode>$VERSION</InlineCode> still has its value.
        Replace <InlineCode>{'<DOCKERHUB_USER>'}</InlineCode>, without the{' '}
        <InlineCode>{'<'}</InlineCode> and <InlineCode>{'>'}</InlineCode> signs.
      </Paragraph>
      <CommandBlock terminal="Ubuntu" commands={PUSH} />

      <SectionTitle>Steps 6 to 8: The server</SectionTitle>
      <Paragraph>
        Continue with <PageLink to="/phase-3/linux-server">Run it on a Linux server</PageLink>. If
        something fails, use <PageLink to="/phase-3/solve-issues">Solve issues</PageLink>.
      </Paragraph>
    </StepPage>
  )
}

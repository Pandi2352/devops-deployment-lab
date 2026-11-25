import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle, TextLink } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const IMAGE = '<DOCKERHUB_USER>/devops-lab:2.0'

const PUSH: Command[] = [
  { command: 'docker login', purpose: 'Log in through the browser.' },
  { command: 'docker images devops-lab', purpose: 'Check that version 2.0 exists.' },
  {
    command: `docker tag devops-lab:2.0 ${IMAGE}`,
    purpose: 'Give the image a name with your account.',
  },
  { command: `docker push ${IMAGE}`, purpose: 'Upload it. It is public by default.' },
]

const TEST: Command[] = [
  { command: `docker rmi ${IMAGE}`, purpose: 'Delete that name from your laptop.' },
  { command: `docker pull ${IMAGE}`, purpose: 'Download it, like a server would.' },
  {
    command: `docker run -d --name lab -p 8080:8080 ${IMAGE}`,
    purpose: 'Run the downloaded image.',
  },
  {
    command: './scripts/health-check.sh http://localhost:8080/healthz',
    purpose: 'It prints OK.',
  },
  { command: 'docker rm -f lab', purpose: 'Remove the test container.' },
]

const OUTPUT = [
  {
    key: 'mounted',
    label: <InlineCode>Mounted from</InlineCode>,
    value: 'Docker Hub already has this layer',
  },
  { key: 'pushed', label: <InlineCode>Pushed</InlineCode>, value: 'Your own layer, uploaded' },
  {
    key: 'digest',
    label: <InlineCode>digest: sha256:...</InlineCode>,
    value: 'The exact id of the image. Same on push and pull',
  },
]

export function Step7() {
  return (
    <StepPage id="docker-step-7">
      <Paragraph>
        Create a free account at <TextLink href="https://hub.docker.com">hub.docker.com</TextLink>.
      </Paragraph>
      <Note>
        Replace <InlineCode>{'<DOCKERHUB_USER>'}</InlineCode> with your username. Remove the{' '}
        <InlineCode>{'<'}</InlineCode> and <InlineCode>{'>'}</InlineCode> signs too.
      </Note>
      <SectionTitle>Upload</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PUSH} />
      <ReferenceTable caption="Push output" headers={['Output', 'Meaning']} rows={OUTPUT} />
      <SectionTitle>Test it like a server</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={TEST} />
    </StepPage>
  )
}

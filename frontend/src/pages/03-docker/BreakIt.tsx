import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const PORT: Command[] = [
  {
    command: 'docker run -d --name lab1 -p 8080:8080 devops-lab:1.0',
    purpose: 'Start the first container.',
  },
  {
    command: 'docker run -d --name lab2 -p 8080:8080 devops-lab:2.0',
    purpose: 'Start a second one on the same port. Port is already allocated.',
  },
  { command: 'docker rm -f lab1 lab2', purpose: 'Remove both.' },
]

const FILES: Command[] = [
  { command: 'bash scripts/build.sh broken', purpose: 'The build still succeeds.' },
  {
    command: 'docker run -d --name lab -p 8080:8080 devops-lab:broken',
    purpose: 'Start the broken image.',
  },
  {
    command: "curl -s http://localhost:8080 | grep -i '<title>'",
    purpose: 'It shows the Nginx welcome page, not DevOps Lab.',
  },
  { command: 'docker rm -f lab', purpose: 'Remove the container.' },
  { command: 'docker rmi devops-lab:broken', purpose: 'Delete the broken image.' },
]

const CACHE: Command[] = [
  {
    command: 'bash scripts/build.sh slow',
    purpose: 'npm ci runs again. It must not say CACHED.',
  },
  { command: 'docker rmi devops-lab:slow', purpose: 'Delete the test image.' },
]

const UNDO: Command[] = [
  {
    command: 'git restore frontend/Dockerfile frontend/src/pages/02-linux/Overview.tsx',
    purpose: 'Bring back the saved versions of both files.',
  },
  { command: 'git status', purpose: 'It must say working tree clean.' },
]

export function BreakIt() {
  return (
    <StepPage id="docker-break-it">
      <Note>Commit your work first. The undo step brings back the last saved version.</Note>
      <SectionTitle>1. Port already used</SectionTitle>
      <CommandBlock terminal="Ubuntu" commands={PORT} />
      <SectionTitle>2. App files missing</SectionTitle>
      <Paragraph>
        In <InlineCode>frontend/Dockerfile</InlineCode>, put <InlineCode>#</InlineCode> before the{' '}
        <InlineCode>COPY --from=build</InlineCode> line, save it, then:
      </Paragraph>
      <CommandBlock terminal="Ubuntu" commands={FILES} />
      <Paragraph>
        <strong>Lesson:</strong> a successful build does not mean a working app. Always test the
        image.
      </Paragraph>
      <SectionTitle>3. Slow builds (layer caching)</SectionTitle>
      <Paragraph>
        Remove the <InlineCode>#</InlineCode>. Move <InlineCode>COPY frontend/ ./</InlineCode> above{' '}
        <InlineCode>RUN npm ci</InlineCode>. Change one line of text in{' '}
        <InlineCode>frontend/src/pages/02-linux/Overview.tsx</InlineCode>. Save both files, then:
      </Paragraph>
      <CommandBlock terminal="Ubuntu" commands={CACHE} />
      <SectionTitle>Undo everything</SectionTitle>
      <CommandBlock commands={UNDO} />
    </StepPage>
  )
}

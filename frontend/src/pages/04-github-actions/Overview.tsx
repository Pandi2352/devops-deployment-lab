import { CommandLegend } from '../../components/CommandLegend'
import { Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'
import { Timeline } from '../../components/Timeline'
import { PHASE_4 } from '../../config/phases/phase-4'

const WORDS = [
  { key: 'ci', label: 'CI', value: 'Test and build every change automatically' },
  { key: 'cd', label: 'CD', value: 'Deliver it automatically' },
  { key: 'workflow', label: 'Workflow', value: 'A YAML file in .github/workflows' },
  { key: 'trigger', label: 'Trigger', value: 'What starts it, such as a pull request' },
  { key: 'job', label: 'Job', value: 'Work on one machine' },
  { key: 'step', label: 'Step', value: 'One command or action inside a job' },
  { key: 'runner', label: 'Runner', value: 'The cloud machine that runs a job' },
]

const FLOW = [
  { key: '1', label: '1. Push a branch', value: 'Open a pull request' },
  { key: '2', label: '2. verify', value: 'npm ci, lint, test, build' },
  { key: '3', label: '3. Red or green', value: 'Red blocks the merge. Green allows it' },
  { key: '4', label: '4. Merge', value: 'verify runs again on main' },
  { key: '5', label: '5. image', value: 'Build the Docker image and upload it to GHCR' },
  { key: '6', label: '6. Deploy', value: 'A server downloads the image (next phases)' },
]

export function Overview() {
  return (
    <StepPage id="actions-overview">
      <Paragraph>
        <strong>Goal:</strong> every pull request is checked; every merge to main publishes a
        Docker image automatically.
      </Paragraph>
      <Paragraph>
        Use <strong>PowerShell</strong> for Git and the <strong>GitHub website</strong> for
        settings. Use Ubuntu only to test the image.
      </Paragraph>
      <Timeline phase={PHASE_4} />
      <SectionTitle>The pipeline</SectionTitle>
      <ReferenceTable caption="Pipeline" headers={['Stage', 'What happens']} rows={FLOW} />
      <SectionTitle>Words to know</SectionTitle>
      <ReferenceTable caption="CI/CD words" headers={['Word', 'Meaning']} rows={WORDS} />
      <SectionTitle>Command colors</SectionTitle>
      <CommandLegend />
    </StepPage>
  )
}

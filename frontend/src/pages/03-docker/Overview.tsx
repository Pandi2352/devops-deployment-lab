import { CommandLegend } from '../../components/CommandLegend'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'
import { Timeline } from '../../components/Timeline'
import { PHASE_3 } from '../../config/phases/phase-3'

const WORDS = [
  { key: 'image', label: 'Image', value: 'A packaged app (the result of the recipe)' },
  { key: 'container', label: 'Container', value: 'A running image' },
  { key: 'dockerfile', label: 'Dockerfile', value: 'The recipe to build an image' },
  { key: 'registry', label: 'Registry', value: 'Where images are stored, such as Docker Hub' },
  { key: 'volume', label: 'Volume', value: 'Storage that stays when a container is deleted' },
  { key: 'network', label: 'Network', value: 'Lets containers find each other by name' },
]

export function Overview() {
  return (
    <StepPage id="docker-overview">
      <Paragraph>
        <strong>Goal:</strong> the app runs in a small, production-style container.
      </Paragraph>
      <Paragraph>
        Use <strong>Ubuntu</strong> in <InlineCode>/mnt/d/devops/react-devops</InlineCode>. Use
        PowerShell only for Git.
      </Paragraph>
      <Timeline phase={PHASE_3} />
      <SectionTitle>Words to know</SectionTitle>
      <ReferenceTable caption="Docker words" headers={['Word', 'Meaning']} rows={WORDS} />
      <SectionTitle>Command colors</SectionTitle>
      <CommandLegend />
    </StepPage>
  )
}

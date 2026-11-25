import { CommandLegend } from '../../components/CommandLegend'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'
import { Timeline } from '../../components/Timeline'
import { PHASE_2 } from '../../config/phases/phase-2'

export function Overview() {
  return (
    <StepPage id="linux-overview">
      <Paragraph>
        <strong>Goal:</strong> you can work on a Linux server using only the terminal. Servers and
        containers both run Linux.
      </Paragraph>
      <Paragraph>
        Use <strong>Ubuntu (WSL)</strong>. Practice in <InlineCode>~/lab</InlineCode>, so you
        cannot break the project.
      </Paragraph>
      <Timeline phase={PHASE_2} />
      <SectionTitle>Command colors</SectionTitle>
      <CommandLegend />
    </StepPage>
  )
}

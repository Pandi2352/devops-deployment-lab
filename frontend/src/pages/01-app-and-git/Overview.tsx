import { CommandLegend } from '../../components/CommandLegend'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'
import { Timeline } from '../../components/Timeline'
import { PHASE_1 } from '../../config/phases/phase-1'

export function Overview() {
  return (
    <StepPage id="overview">
      <Paragraph>
        <strong>Goal:</strong> a working React + TypeScript + Tailwind app in a public GitHub repo,
        changed through pull requests.
      </Paragraph>
      <Paragraph>
        Use <strong>PowerShell</strong> in <InlineCode>D:\devops\react-devops</InlineCode>.
      </Paragraph>
      <Timeline phase={PHASE_1} />
      <SectionTitle>Command colors</SectionTitle>
      <CommandLegend />
    </StepPage>
  )
}

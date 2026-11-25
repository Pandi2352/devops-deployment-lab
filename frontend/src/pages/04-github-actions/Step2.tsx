import { InlineCode, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const STATES = [
  { key: 'running', label: 'Yellow circle', value: 'Running. Wait' },
  { key: 'passed', label: 'Green check', value: 'Passed. You can merge' },
  { key: 'failed', label: 'Red cross', value: 'A step failed. Open it and read the last lines' },
  { key: 'skipped', label: 'Grey, skipped', value: 'Not needed here. This is normal' },
]

export function Step2() {
  return (
    <StepPage id="actions-step-2">
      <SectionTitle>Open a pull request</SectionTitle>
      <NumberedList>
        <li>
          On GitHub, open your repo and click <strong>Compare & pull request</strong>.
        </li>
        <li>
          Base: <InlineCode>main</InlineCode>, compare:{' '}
          <InlineCode>phase-4-github-actions</InlineCode>.
        </li>
        <li>
          Click <strong>Create pull request</strong>.
        </li>
        <li>
          Wait for the check <strong>CI / verify</strong> at the bottom.
        </li>
      </NumberedList>
      <SectionTitle>Read the result</SectionTitle>
      <ReferenceTable caption="Check results" headers={['You see', 'Meaning']} rows={STATES} />
      <SectionTitle>Find the reason of a red check</SectionTitle>
      <NumberedList>
        <li>Click the red check.</li>
        <li>Open the step with the red cross.</li>
        <li>Read the last lines. Look for the file name and line number.</li>
        <li>Fix it, test it on your laptop, then push again.</li>
      </NumberedList>
      <Paragraph>
        A new push to the same branch runs the check again in the same pull request. All runs are
        in the <strong>Actions</strong> tab.
      </Paragraph>
    </StepPage>
  )
}

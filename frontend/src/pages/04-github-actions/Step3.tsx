import { InlineCode, Note, NumberedList, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const RESULT = [
  { key: 'running', label: 'Running', value: 'Merge is blocked' },
  { key: 'failed', label: 'Failed', value: 'Merge is blocked' },
  { key: 'passed', label: 'Passed', value: 'Merge is allowed' },
]

export function Step3() {
  return (
    <StepPage id="actions-step-3">
      <Paragraph>
        Without this, GitHub only shows a red check. With it, GitHub blocks the merge.
      </Paragraph>
      <SectionTitle>On the GitHub website</SectionTitle>
      <NumberedList>
        <li>
          Open your repo → <strong>Settings</strong> → <strong>Rules</strong> →{' '}
          <strong>Rulesets</strong> → your ruleset.
        </li>
        <li>
          Tick <strong>Require status checks to pass</strong>.
        </li>
        <li>
          Click <strong>Add checks</strong>, type <InlineCode>verify</InlineCode> and choose{' '}
          <strong>verify</strong> (GitHub Actions).
        </li>
        <li>
          Leave <strong>Require branches to be up to date</strong> unticked.
        </li>
        <li>
          Click <strong>Save changes</strong>.
        </li>
      </NumberedList>
      <Note>
        Use the page under Settings. A page without <InlineCode>/settings/</InlineCode> in its
        address is only for reading.
      </Note>
      <SectionTitle>What you get</SectionTitle>
      <ReferenceTable caption="Merge rules" headers={['Check', 'Result']} rows={RESULT} />
    </StepPage>
  )
}

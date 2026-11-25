import { CommandBlock, type Command } from '../../components/CommandBlock'
import { BulletList, InlineCode, Note, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const TEST_PROTECTION: Command[] = [
  {
    command: 'git switch main',
    purpose: 'Go to the protected branch.',
  },
  {
    command: 'git pull',
    purpose: 'Get the latest main, so the push fails only because of the rule.',
  },
  {
    command: 'git commit --allow-empty -m "Test protection"',
    purpose: 'Make a test commit with no file changes.',
  },
  {
    command: 'git push',
    purpose: 'Try a direct push. It must be rejected with GH013.',
  },
]

const REMOVE_TEST: Command[] = [
  {
    command: 'git reset --soft HEAD~1',
    purpose: 'Remove the test commit from your laptop. Your files are not changed.',
  },
  {
    command: 'git status',
    purpose: 'Confirm your branch is up to date with origin/main again.',
  },
]

export function Step10() {
  return (
    <StepPage id="step-10">
      <Paragraph>GitHub → Settings → Rules → Rulesets → New branch ruleset:</Paragraph>
      <BulletList>
        <li>Target: default branch</li>
        <li>Require a pull request before merging, 0 approvals (you work alone)</li>
        <li>Block force pushes</li>
        <li>
          Enforcement status: <strong>Active</strong>. If it is Disabled, the rule does nothing.
        </li>
      </BulletList>
      <Paragraph>
        Purpose: nobody can change <InlineCode>main</InlineCode> directly, so every change is
        reviewed in a pull request.
      </Paragraph>
      <Paragraph>After phase 4 also add: require status checks.</Paragraph>

      <SectionTitle>Test the rule</SectionTitle>
      <CommandBlock commands={TEST_PROTECTION} />
      <Note>
        Run the next commands only if the push was rejected. If it succeeded, the rule is not
        active.
      </Note>
      <CommandBlock commands={REMOVE_TEST} />
    </StepPage>
  )
}

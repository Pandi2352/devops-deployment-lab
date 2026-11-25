import { CommandBlock, type Command } from '../../components/CommandBlock'
import { Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const BRANCH: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git switch main', purpose: 'Start from main.' },
  { command: 'git pull', purpose: 'Get the latest code.' },
  { command: 'git switch -c phase-4-github-actions', purpose: 'Create the branch.' },
  { command: 'git push -u origin phase-4-github-actions', purpose: 'Upload the branch.' },
  { command: 'code .', purpose: 'Open the project in VS Code.' },
]

const COST = [
  { key: 'public', label: 'Public repo, standard runner', value: 'Free' },
  { key: 'private', label: 'Private repo', value: '12 USD of usage per month, then paid' },
  { key: 'ghcr', label: 'GHCR, public image', value: 'Free' },
  { key: 'env', label: 'Environment with reviewers', value: 'Free on a public repo' },
]

export function Setup() {
  return (
    <StepPage id="actions-setup">
      <CommandBlock commands={BRANCH} />
      <SectionTitle>Cost</SectionTitle>
      <ReferenceTable caption="Cost" headers={['What', 'Cost']} rows={COST} />
      <Paragraph>Keep the repo public, and everything in this phase is free.</Paragraph>
    </StepPage>
  )
}

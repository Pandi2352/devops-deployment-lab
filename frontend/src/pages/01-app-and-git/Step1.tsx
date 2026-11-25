import { CommandBlock, type Command } from '../../components/CommandBlock'
import { StepPage } from '../../components/StepPage'

const CREATE_PROJECT: Command[] = [
  {
    command: 'cd D:\\devops\\react-devops',
    purpose: 'Go to the project folder.',
  },
  {
    command: 'npm create vite@latest frontend -- --template react-ts',
    purpose:
      'Create a React + TypeScript app in a new folder named frontend. The -- passes the template option to Vite.',
  },
  {
    command: 'cd frontend',
    purpose: 'Go into the new app folder.',
  },
  {
    command: 'npm install',
    purpose: 'Download the packages listed in package.json into node_modules.',
  },
  {
    command: 'npm install tailwindcss @tailwindcss/vite',
    purpose: 'Add Tailwind CSS and its Vite plugin.',
  },
  {
    command: 'npm install -D vitest',
    purpose: 'Add the test tool. -D means it is used only for development.',
  },
]

export function Step1() {
  return (
    <StepPage id="step-1">
      <CommandBlock commands={CREATE_PROJECT} />
    </StepPage>
  )
}

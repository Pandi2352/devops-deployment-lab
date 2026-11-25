import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const APP_TSX = `const version = import.meta.env.VITE_APP_VERSION ?? 'dev'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-white">
      <h1 className="text-4xl font-bold">DevOps Lab</h1>
      <p className="text-slate-300">React + TypeScript + Tailwind</p>
      <p className="rounded border border-slate-600 px-3 py-1 font-mono text-sm">
        Version: {version}
      </p>
    </main>
  )
}

export default App`

const DELETE_CSS: Command[] = [
  {
    command: 'Remove-Item D:\\devops\\react-devops\\frontend\\src\\App.css',
    purpose: 'Delete the template CSS file. The app uses Tailwind, so it is not needed.',
  },
]

export function Step3() {
  return (
    <StepPage id="step-3">
      <CodeBlock
        language="TSX"
        file="frontend/src/App.tsx"
        note="replace everything"
        purpose="The page. It shows a title and the version set when the app is built."
        code={APP_TSX}
      />
      <Paragraph>
        Delete <InlineCode>src/App.css</InlineCode>. The version text is important: later it shows
        you <strong>which deployment is live</strong>.
      </Paragraph>
      <CommandBlock commands={DELETE_CSS} />
    </StepPage>
  )
}

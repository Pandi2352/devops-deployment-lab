import { CodeBlock } from '../../components/CodeBlock'
import { InlineCode, Paragraph } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const APP_TEST = `import { renderToString } from 'react-dom/server'
import { expect, test } from 'vitest'
import App from './App'

test('shows the page title', () => {
  expect(renderToString(<App />)).toContain('DevOps Lab')
})`

const TEST_SCRIPT = '"test": "vitest run"'

export function Step4() {
  return (
    <StepPage id="step-4">
      <CodeBlock
        language="TSX"
        file="frontend/src/App.test.tsx"
        purpose="Renders the page and fails if the title is missing."
        code={APP_TEST}
      />
      <Paragraph>
        In <InlineCode>frontend/package.json</InlineCode> add to <InlineCode>scripts</InlineCode>:
      </Paragraph>
      <CodeBlock
        language="JSON"
        purpose="Lets you run the tests with npm test. vitest run tests once and stops."
        code={TEST_SCRIPT}
      />
    </StepPage>
  )
}

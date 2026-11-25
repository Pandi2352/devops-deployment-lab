import { CodeBlock } from '../../components/CodeBlock'
import { StepPage } from '../../components/StepPage'

const VITE_CONFIG = `import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`

const INDEX_CSS = '@import "tailwindcss";'

export function Step2() {
  return (
    <StepPage id="step-2">
      <CodeBlock
        language="TypeScript"
        file="frontend/vite.config.ts"
        purpose="Turns on React and Tailwind in Vite."
        code={VITE_CONFIG}
      />
      <CodeBlock
        language="CSS"
        file="frontend/src/index.css"
        note="replace everything"
        purpose="Loads Tailwind, so its classes work in the app."
        code={INDEX_CSS}
      />
    </StepPage>
  )
}

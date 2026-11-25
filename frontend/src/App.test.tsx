import { renderToString } from 'react-dom/server'
import { expect, test } from 'vitest'
import App from './App'

test('shows the page title', () => {
  expect(renderToString(<App />)).toContain('DevOps Lab')
})

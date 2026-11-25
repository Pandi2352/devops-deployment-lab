import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { expect, test } from 'vitest'
import App from './App'
import { GUIDE_PAGES, getPageName } from './config/guide'

function renderPath(path: string) {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

test('shows the page title', () => {
  expect(renderPath('/')).toContain('DevOps Lab')
})

test.each(GUIDE_PAGES)('shows $path', (page) => {
  const heading = renderPath(page.path).match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]
  expect(heading).toBe(getPageName(page))
})

test('shows a not found page for an unknown address', () => {
  expect(renderPath('/unknown')).toContain('Page not found')
})

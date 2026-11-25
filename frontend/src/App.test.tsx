import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { expect, test } from 'vitest'
import App from './App'
import { GUIDE_PAGES, PHASES, getPageName } from './config/guide'

function renderPath(path: string) {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

test('shows the page title', () => {
  expect(renderPath('/')).toContain('Wrong title')
})

test.each(GUIDE_PAGES)('shows $path', (page) => {
  const heading = renderPath(page.path).match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]
  expect(heading).toBe(getPageName(page))
})

test('uses each page id and path once', () => {
  expect(new Set(GUIDE_PAGES.map(({ id }) => id)).size).toBe(GUIDE_PAGES.length)
  expect(new Set(GUIDE_PAGES.map(({ path }) => path)).size).toBe(GUIDE_PAGES.length)
})

test.each(PHASES)('marks the $label tab as current on its pages', (phase) => {
  const html = renderPath(phase.groups[0].pages[0].path)
  const currentTab = html.match(/<a[^>]*aria-current="true"[^>]*>/)?.[0]
  expect(currentTab).toContain(`href="${phase.path}"`)
})

test('shows a not found page for an unknown address', () => {
  expect(renderPath('/unknown')).toContain('Page not found')
})

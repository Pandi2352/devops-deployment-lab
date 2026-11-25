import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router'
import { GUIDE_GROUPS, GUIDE_PAGES, getPageName, type GuidePageId } from '../config/guide'
import { SITE } from '../config/site'

interface StepPageProps {
  id: GuidePageId
  children: ReactNode
}

const PAGER_LINK =
  'flex min-h-11 flex-1 flex-col rounded-md border border-line bg-surface p-4 hover:border-control-line'

export function StepPage({ id, children }: StepPageProps) {
  const index = GUIDE_PAGES.findIndex((page) => page.id === id)
  const page = GUIDE_PAGES[index]
  const previous = GUIDE_PAGES[index - 1]
  const next = GUIDE_PAGES[index + 1]
  const group = GUIDE_GROUPS.find((item) => item.pages.includes(page))
  const name = getPageName(page)

  useEffect(() => {
    document.title = `${name} | ${SITE.name}`
  }, [name])

  return (
    <article className="max-w-3xl">
      <header className="border-b border-line pb-6">
        <p className="text-sm text-muted">{group?.title}</p>
        <h1 className="mt-1 text-2xl font-semibold">{name}</h1>
      </header>

      <div className="space-y-5 py-6">{children}</div>

      <nav
        aria-label="Previous and next page"
        className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row"
      >
        {previous && (
          <Link to={previous.path} className={PAGER_LINK}>
            <span className="text-sm text-muted">Previous</span>
            <span className="font-medium text-primary">{getPageName(previous)}</span>
          </Link>
        )}
        {next && (
          <Link to={next.path} className={`${PAGER_LINK} sm:text-right`}>
            <span className="text-sm text-muted">Next</span>
            <span className="font-medium text-primary">{getPageName(next)}</span>
          </Link>
        )}
      </nav>
    </article>
  )
}

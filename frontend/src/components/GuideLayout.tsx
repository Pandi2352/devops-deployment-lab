import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { findPhaseByPath } from '../config/guide'
import { SITE } from '../config/site'
import { GuideNav } from './GuideNav'
import { PhaseTabs } from './PhaseTabs'

function showActiveItem(nav: HTMLElement) {
  const item = nav.querySelector('[aria-current="page"]')
  if (!item) return
  const itemBox = item.getBoundingClientRect()
  const navBox = nav.getBoundingClientRect()
  if (itemBox.top < navBox.top || itemBox.bottom > navBox.bottom) {
    nav.scrollTop += itemBox.top - navBox.top - navBox.height / 2
  }
}

export function GuideLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const lastPathRef = useRef(pathname)
  const phase = findPhaseByPath(pathname)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (navRef.current) showActiveItem(navRef.current)
    if (lastPathRef.current === pathname) return
    lastPathRef.current = pathname
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <div className="min-h-screen">
      <a
        href="#content"
        className="sr-only rounded-md bg-surface px-4 py-3 text-primary focus:not-sr-only focus:absolute focus:z-30"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 px-4 md:flex-nowrap">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex h-header shrink-0 items-center rounded-md font-semibold focus-visible:-outline-offset-2"
          >
            {SITE.name}
          </Link>
          <PhaseTabs activePath={phase.path} onNavigate={closeMenu} />
          <div className="flex min-w-0 items-center gap-3">
            <p className="max-w-32 truncate font-mono text-xs text-muted" title={SITE.version}>
              Version: {SITE.version}
            </p>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="guide-nav"
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              className="min-h-11 shrink-0 cursor-pointer rounded-md px-2 text-sm font-medium text-primary hover:bg-subtle lg:hidden"
            >
              {isMenuOpen ? 'Close' : 'Steps'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl lg:flex lg:items-start">
        <nav
          ref={navRef}
          id="guide-nav"
          aria-label={`${phase.label} steps`}
          className={`border-b border-line bg-surface p-4 lg:sticky lg:top-header lg:block lg:h-[calc(100vh-var(--spacing-header))] lg:w-sidebar lg:shrink-0 lg:overflow-y-auto lg:scrollbar-slim lg:px-3 lg:border-r lg:border-b-0 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <GuideNav phase={phase} onNavigate={closeMenu} />
        </nav>

        <main
          id="content"
          ref={mainRef}
          tabIndex={-1}
          className="min-w-0 flex-1 px-4 py-8 outline-none md:px-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

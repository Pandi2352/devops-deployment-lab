import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { SITE } from '../config/site'
import { GuideNav } from './GuideNav'

export function GuideLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const lastPathRef = useRef(pathname)

  useEffect(() => {
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
        className="sr-only rounded-md bg-surface px-4 py-3 text-primary focus:not-sr-only focus:absolute focus:z-20"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-10 border-b border-line bg-surface">
        <div className="mx-auto flex h-header max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex min-h-11 shrink-0 items-center rounded-md font-semibold"
          >
            {SITE.name}
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <p className="truncate font-mono text-sm text-muted" title={SITE.version}>
              Version: {SITE.version}
            </p>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="guide-nav"
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              className="min-h-11 shrink-0 cursor-pointer rounded-md border border-control-line px-4 text-sm font-medium hover:bg-subtle lg:hidden"
            >
              {isMenuOpen ? 'Close' : 'Steps'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl lg:flex lg:items-start">
        <nav
          id="guide-nav"
          aria-label="Guide steps"
          className={`border-b border-line bg-surface p-4 lg:sticky lg:top-header lg:block lg:h-[calc(100vh-var(--spacing-header))] lg:w-sidebar lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <GuideNav onNavigate={() => setIsMenuOpen(false)} />
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

import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { PHASES } from '../config/guide'

interface PhaseTabsProps {
  activePath: string
  onNavigate: () => void
}

export function PhaseTabs({ activePath, onNavigate }: PhaseTabsProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current
    const activeTab = list?.querySelector('[aria-current="true"]')
    if (!list || !activeTab) return
    const listBox = list.getBoundingClientRect()
    const tabBox = activeTab.getBoundingClientRect()
    list.scrollLeft += tabBox.left - listBox.left - (listBox.width - tabBox.width) / 2
  }, [activePath])

  return (
    <nav
      aria-label="Phases"
      className="order-last w-full min-w-0 border-t border-line md:order-none md:w-auto md:flex-1 md:border-t-0"
    >
      <ul ref={listRef} className="flex gap-5 overflow-x-auto [scrollbar-width:none]">
        {PHASES.map((phase) => {
          const isActive = phase.path === activePath
          return (
            <li key={phase.path} className="shrink-0">
              <Link
                to={phase.path}
                onClick={onNavigate}
                aria-current={isActive ? 'true' : undefined}
                className={`flex h-11 items-center gap-1.5 border-b-2 text-sm focus-visible:-outline-offset-2 md:h-header ${
                  isActive
                    ? 'border-primary font-medium text-primary'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                <span>{phase.label}</span>
                <span className={isActive ? 'font-normal' : undefined}>{phase.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

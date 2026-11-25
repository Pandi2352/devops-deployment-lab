import { Link } from 'react-router'
import type { Phase } from '../config/guide.types'

interface TimelineProps {
  phase: Phase
}

export function Timeline({ phase }: TimelineProps) {
  return (
    <div className="space-y-6">
      {phase.groups.map((group) => (
        <section key={group.title}>
          <h2 className="pb-1 text-sm font-semibold">{group.title}</h2>
          <ol>
            {group.pages.map((page, index) => (
              <li key={page.id}>
                <Link
                  to={page.path}
                  className="group relative flex min-h-11 items-start gap-3 rounded-md py-2.5 pr-3 pl-8 text-sm leading-6 hover:bg-subtle sm:items-baseline"
                >
                  {group.pages.length > 1 && (
                    <span
                      aria-hidden
                      className={`absolute left-3 w-px -translate-x-1/2 bg-timeline ${
                        index === 0 ? 'top-5.5' : 'top-0'
                      } ${index === group.pages.length - 1 ? 'h-5.5' : 'bottom-0'}`}
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute top-5.5 left-3 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-surface group-hover:bg-primary"
                  />
                  {page.label && <span className="w-14 shrink-0 text-muted">{page.label}</span>}
                  <span className="min-w-0 flex-1 sm:flex sm:gap-4">
                    <span className="block font-medium group-hover:text-primary sm:w-56 sm:shrink-0">
                      {page.title}
                    </span>
                    <span className="block text-muted">{page.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

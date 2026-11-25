import { NavLink } from 'react-router'
import { GUIDE_GROUPS } from '../config/guide'

interface GuideNavProps {
  onNavigate: () => void
}

export function GuideNav({ onNavigate }: GuideNavProps) {
  return (
    <div className="space-y-6">
      {GUIDE_GROUPS.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <p className="px-3 pb-2 text-sm font-semibold">{group.title}</p>
          <ul className="space-y-1">
            {group.pages.map((page) => (
              <li key={page.id}>
                <NavLink
                  to={page.path}
                  end
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm ${
                      isActive
                        ? 'bg-subtle font-semibold text-primary'
                        : 'text-muted hover:bg-subtle hover:text-foreground'
                    }`
                  }
                >
                  {page.step && <span className="w-5 shrink-0 text-right">{page.step}</span>}
                  <span className="min-w-0 flex-1">
                    {page.id === 'overview' ? 'Overview' : page.title}
                  </span>
                  {page.done && (
                    <span className="shrink-0 text-xs font-medium text-success">Done</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

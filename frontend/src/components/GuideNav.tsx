import { NavLink } from 'react-router'
import type { GuidePage, Phase } from '../config/guide.types'

interface GuideNavProps {
  phase: Phase
  onNavigate: () => void
}

interface NavItemProps {
  page: GuidePage
  isFirst: boolean
  isLast: boolean
  onNavigate: () => void
}

function NavItem({ page, isFirst, isLast, onNavigate }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={page.path}
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `relative flex min-h-11 items-center rounded-md py-1.5 pr-2 pl-7 text-sm lg:min-h-9 ${
            isActive
              ? 'bg-command font-medium text-primary'
              : 'text-muted hover:bg-subtle hover:text-foreground'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              aria-hidden
              className={`absolute left-3 w-px -translate-x-1/2 bg-timeline ${
                isFirst ? 'top-1/2' : 'top-0'
              } ${isLast ? 'bottom-1/2' : 'bottom-0'}`}
            />
            <span
              aria-hidden
              className={`absolute top-1/2 left-3 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                isActive ? 'border-primary bg-primary' : 'border-control-line bg-surface'
              }`}
            />
            {page.title}
          </>
        )}
      </NavLink>
    </li>
  )
}

export function GuideNav({ phase, onNavigate }: GuideNavProps) {
  return (
    <div className="space-y-4">
      <NavLink
        to={phase.path}
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex min-h-11 items-center rounded-md px-2 text-sm font-medium lg:min-h-9 ${
            isActive ? 'bg-command text-primary' : 'hover:bg-subtle'
          }`
        }
      >
        Overview
      </NavLink>

      {phase.groups.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <p className="px-2 pb-1 text-xs font-semibold">{group.title}</p>
          <ol>
            {group.pages.map((page, index) => (
              <NavItem
                key={page.id}
                page={page}
                isFirst={index === 0}
                isLast={index === group.pages.length - 1}
                onNavigate={onNavigate}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

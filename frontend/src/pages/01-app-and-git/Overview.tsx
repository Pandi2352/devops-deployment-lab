import { Link } from 'react-router'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { StepPage } from '../../components/StepPage'
import { GUIDE_GROUPS, getPageName } from '../../config/guide'

const STEP_GROUPS = GUIDE_GROUPS.slice(1)

export function Overview() {
  return (
    <StepPage id="overview">
      <Paragraph>
        <strong>Goal:</strong> a working React + TypeScript + Tailwind app in a public GitHub repo,
        changed through pull requests.
      </Paragraph>
      <Paragraph>
        Use <strong>PowerShell</strong> in <InlineCode>D:\devops\react-devops</InlineCode>.
      </Paragraph>

      {STEP_GROUPS.map((group) => (
        <section key={group.title} className="space-y-3">
          <SectionTitle>{group.title}</SectionTitle>
          <ul className="divide-y divide-line rounded-md border border-line bg-surface">
            {group.pages.map((page) => (
              <li key={page.id}>
                <Link
                  to={page.path}
                  className="flex min-h-11 items-center justify-between gap-4 rounded-md px-4 py-3 hover:bg-subtle"
                >
                  <span className="text-primary">{getPageName(page)}</span>
                  {page.done && (
                    <span className="shrink-0 text-sm font-medium text-success">Done</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </StepPage>
  )
}

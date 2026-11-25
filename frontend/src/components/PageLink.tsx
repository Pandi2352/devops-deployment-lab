import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface PageLinkProps {
  to: string
  children: ReactNode
}

export function PageLink({ to, children }: PageLinkProps) {
  return (
    <Link
      to={to}
      className="rounded-md text-primary underline underline-offset-4 hover:no-underline"
    >
      {children}
    </Link>
  )
}

import type { ReactNode } from 'react'

interface ChildrenProps {
  children: ReactNode
}

export function Paragraph({ children }: ChildrenProps) {
  return <p className="leading-7">{children}</p>
}

export function SectionTitle({ children }: ChildrenProps) {
  return <h2 className="pt-2 text-lg font-semibold">{children}</h2>
}

export function InlineCode({ children }: ChildrenProps) {
  return (
    <code className="rounded-md border border-line bg-subtle px-1.5 py-0.5 font-mono text-sm wrap-anywhere">
      {children}
    </code>
  )
}

export function NumberedList({ children }: ChildrenProps) {
  return <ol className="list-decimal space-y-2 pl-6 leading-7">{children}</ol>
}

export function BulletList({ children }: ChildrenProps) {
  return <ul className="list-disc space-y-2 pl-6 leading-7">{children}</ul>
}

export function Note({ children }: ChildrenProps) {
  return <div className="rounded-md border border-line bg-subtle p-4 leading-7">{children}</div>
}

interface TextLinkProps extends ChildrenProps {
  href: string
}

export function TextLink({ href, children }: TextLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-md text-primary underline underline-offset-4 wrap-anywhere hover:no-underline"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

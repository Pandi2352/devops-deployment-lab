import { useEffect } from 'react'
import { Link } from 'react-router'
import { Paragraph } from '../components/Content'
import { SITE } from '../config/site'

export function NotFound() {
  useEffect(() => {
    document.title = `Page not found | ${SITE.name}`
  }, [])

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Paragraph>This address is not part of the guide.</Paragraph>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-md border border-control-line bg-surface px-4 font-medium text-primary hover:bg-subtle"
      >
        Go to the overview
      </Link>
    </div>
  )
}

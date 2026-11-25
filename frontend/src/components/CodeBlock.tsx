import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  code: string
  language: string
  purpose: string
  file?: string
  note?: string
}

export function CodeBlock({ code, language, purpose, file, note }: CodeBlockProps) {
  const label = file ?? language

  return (
    <figure className="overflow-hidden rounded-md border border-line bg-surface">
      <figcaption className="flex items-start justify-between gap-3 border-b border-line bg-subtle py-1 pr-1 pl-4">
        <div className="min-w-0 py-2 text-sm leading-6 wrap-anywhere">
          {file ? (
            <p>
              <span className="font-semibold">File: </span>
              <code className="font-mono">{file}</code>
              {note && <span className="text-muted"> ({note})</span>}
            </p>
          ) : (
            <p className="text-muted">{language}</p>
          )}
          <p className="text-muted">{purpose}</p>
        </div>
        <CopyButton text={code} name={label} />
      </figcaption>
      <pre
        role="region"
        aria-label={`${label} code`}
        tabIndex={0}
        className="overflow-x-auto p-4 font-mono text-sm leading-6 focus-visible:-outline-offset-2"
      >
        <code>{code}</code>
      </pre>
    </figure>
  )
}

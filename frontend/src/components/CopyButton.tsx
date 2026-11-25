import { useEffect, useState } from 'react'

type CopyState = 'idle' | 'copied' | 'failed'

interface CopyButtonProps {
  text: string
  name: string
  label?: string
}

export function CopyButton({ text, name, label = 'Copy' }: CopyButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const visibleLabel = { idle: label, copied: 'Copied', failed: 'Copy failed' }[copyState]

  useEffect(() => {
    if (copyState === 'idle') return
    const timer = window.setTimeout(() => setCopyState('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [copyState])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${visibleLabel}: ${name}`}
        className="min-h-11 shrink-0 cursor-pointer rounded-md px-3 text-sm font-medium text-primary hover:bg-line focus-visible:-outline-offset-2"
      >
        {visibleLabel}
      </button>
      <span role="status" className="sr-only">
        {copyState === 'idle' ? '' : visibleLabel}
      </span>
    </>
  )
}

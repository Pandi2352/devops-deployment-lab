import { CopyButton } from './CopyButton'

export interface Command {
  command: string
  purpose: string
}

interface CommandBlockProps {
  commands: Command[]
  terminal?: string
}

export function CommandBlock({ commands, terminal = 'PowerShell' }: CommandBlockProps) {
  const allCommands = commands.map(({ command }) => command).join('\n')

  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <div className="flex min-h-13 items-center justify-between gap-3 border-b border-line bg-subtle py-1 pr-1 pl-4">
        <span className="text-sm text-muted">{terminal}</span>
        {commands.length > 1 && (
          <CopyButton text={allCommands} name={`${terminal} commands`} label="Copy all" />
        )}
      </div>
      <ul className="divide-y divide-line">
        {commands.map(({ command, purpose }) => (
          <li key={command} className="flex items-start justify-between gap-3 py-1 pr-1 pl-4">
            <div className="min-w-0 flex-1 py-2">
              <code className="block font-mono text-sm leading-6 wrap-anywhere whitespace-pre-wrap">
                {command}
              </code>
              <p className="mt-1 text-sm leading-6 text-muted">{purpose}</p>
            </div>
            <CopyButton text={command} name={command} />
          </li>
        ))}
      </ul>
    </div>
  )
}

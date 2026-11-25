import { CommandText } from './CommandText'
import { CopyButton } from './CopyButton'

export interface Command {
  command: string
  purpose: string
}

interface CommandBlockProps {
  commands: Command[]
  terminal?: 'PowerShell' | 'Ubuntu'
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
        {commands.map(({ command, purpose }, index) => (
          <li key={`${index}-${command}`} className="p-3">
            <div className="flex items-center justify-between gap-2 rounded-md border border-command-line bg-command pl-3">
              <code className="min-w-0 flex-1 py-2 font-mono text-sm leading-6 wrap-anywhere whitespace-pre-wrap">
                <CommandText command={command} />
              </code>
              <CopyButton text={command} name={command} />
            </div>
            <p className="mt-2 px-3 text-sm leading-6 text-muted">{purpose}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { InlineCommand } from './CommandText'

const EXAMPLES = [
  'git commit -m "message"',
  'git revert --no-edit <commit>',
  'find /etc -name "*.conf" | head',
]

const LEGEND = [
  { color: 'Blue', style: 'font-bold text-command-program', meaning: 'the command' },
  { color: 'Orange', style: 'text-command-option', meaning: 'an option that changes it' },
  { color: 'Green', style: 'text-command-text', meaning: 'text inside quotes' },
  {
    color: 'Red',
    style: 'font-bold text-command-placeholder',
    meaning: 'replace it with your own value',
  },
  { color: 'Black', style: 'text-foreground', meaning: 'a name, folder or address' },
  {
    color: 'Black, bold',
    style: 'font-bold text-foreground',
    meaning: 'joins commands or sends output to a file',
  },
]

export function CommandLegend() {
  return (
    <div className="space-y-4 rounded-md border border-line bg-surface p-4">
      <ul className="flex flex-wrap gap-2">
        {EXAMPLES.map((command) => (
          <li key={command}>
            <InlineCommand command={command} />
          </li>
        ))}
      </ul>
      <ul className="grid gap-1 text-sm leading-6 sm:grid-cols-2">
        {LEGEND.map(({ color, style, meaning }) => (
          <li key={color}>
            <span className={style}>{color}:</span> {meaning}
          </li>
        ))}
      </ul>
    </div>
  )
}

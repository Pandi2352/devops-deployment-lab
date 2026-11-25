import { InlineCommand } from './CommandText'

const LEGEND = [
  { color: 'Blue', style: 'text-command-program', meaning: 'the command' },
  { color: 'Orange', style: 'text-command-option', meaning: 'an option that changes it' },
  { color: 'Green', style: 'text-command-text', meaning: 'text inside quotes' },
  { color: 'Red', style: 'text-command-placeholder', meaning: 'replace it with your own value' },
  { color: 'Black', style: 'text-foreground', meaning: 'a name, folder or address' },
]

export function CommandLegend() {
  return (
    <div className="space-y-3 rounded-md border border-line bg-surface p-4">
      <p>
        <InlineCommand command={'git commit -m "message"'} />
      </p>
      <p>
        <InlineCommand command="git revert --no-edit <commit>" />
      </p>
      <ul className="space-y-1 text-sm leading-6">
        {LEGEND.map(({ color, style, meaning }) => (
          <li key={color}>
            <span className={`font-semibold ${style}`}>{color}:</span> {meaning}
          </li>
        ))}
      </ul>
    </div>
  )
}

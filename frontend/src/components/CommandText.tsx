import { tokenizeCommand, type TokenType } from '../utils/tokenize-command'

const TOKEN_STYLES: Record<TokenType, string> = {
  program: 'font-bold text-command-program',
  subcommand: 'font-bold text-command-program',
  option: 'text-command-option',
  text: 'text-command-text',
  placeholder: 'font-bold text-command-placeholder',
  operator: 'font-bold text-foreground',
  value: 'text-foreground',
}

interface CommandTextProps {
  command: string
}

export function CommandText({ command }: CommandTextProps) {
  return tokenizeCommand(command).map((token, index) => (
    <span key={index} className={TOKEN_STYLES[token.type]}>
      {token.text}
    </span>
  ))
}

export function InlineCommand({ command }: CommandTextProps) {
  return (
    <code className="rounded-md border border-command-line bg-command px-1.5 py-0.5 font-mono text-sm wrap-anywhere">
      <CommandText command={command} />
    </code>
  )
}

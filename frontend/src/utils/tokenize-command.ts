export type TokenType = 'program' | 'subcommand' | 'option' | 'text' | 'placeholder' | 'value'

export interface CommandToken {
  type: TokenType
  text: string
}

const TOKEN_PATTERN = /"[^"]*"|<[^>]+>|\s+|[^\s<"]+|./g
const PROGRAMS_WITH_SUBCOMMAND = ['git', 'npm']

export function tokenizeCommand(command: string): CommandToken[] {
  const parts = command.match(TOKEN_PATTERN) ?? []
  const program = parts[0] ?? ''

  return parts.map((text, index) => {
    const startsWord = index === 0 || /^\s+$/.test(parts[index - 1])
    const getType = (): TokenType => {
      if (index === 0) return 'program'
      if (text.startsWith('"')) return 'text'
      if (text.startsWith('<')) return 'placeholder'
      if (startsWord && text.startsWith('-')) return 'option'
      if (index === 2 && PROGRAMS_WITH_SUBCOMMAND.includes(program)) return 'subcommand'
      return 'value'
    }
    return { type: getType(), text }
  })
}

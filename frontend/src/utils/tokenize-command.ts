export type TokenType =
  | 'program'
  | 'subcommand'
  | 'option'
  | 'text'
  | 'placeholder'
  | 'operator'
  | 'value'

export interface CommandToken {
  type: TokenType
  text: string
}

const TOKEN_PATTERN = /"[^"]*"|'[^']*'|<[^>]+>|\s+|[^\s<"']+|./g
const OPERATOR_PATTERN = /^(\||\|\||&&|&|>|>>|2>\/dev\/null)$/
const STARTS_NEW_PROGRAM = ['|', '||', '&&']
const PROGRAM_PREFIXES = ['sudo']
const PROGRAMS_WITH_SUBCOMMAND = ['git', 'npm', 'apt', 'systemctl', 'docker', 'aws']

export function tokenizeCommand(command: string): CommandToken[] {
  const tokens: CommandToken[] = []
  let expected: 'program' | 'subcommand' | 'value' = 'program'
  let startsWord = true

  for (const text of command.match(TOKEN_PATTERN) ?? []) {
    if (/^\s+$/.test(text)) {
      tokens.push({ type: 'value', text })
      startsWord = true
      continue
    }

    let type: TokenType = 'value'
    if (startsWord && OPERATOR_PATTERN.test(text)) {
      type = 'operator'
      expected = STARTS_NEW_PROGRAM.includes(text) ? 'program' : 'value'
    } else if (/^["']/.test(text)) {
      type = 'text'
    } else if (text.startsWith('<')) {
      type = 'placeholder'
    } else if (startsWord && expected === 'program') {
      type = 'program'
      if (!PROGRAM_PREFIXES.includes(text)) {
        expected = PROGRAMS_WITH_SUBCOMMAND.includes(text) ? 'subcommand' : 'value'
      }
    } else if (startsWord && text.startsWith('-')) {
      type = 'option'
    } else if (startsWord && expected === 'subcommand') {
      type = 'subcommand'
      expected = 'value'
    }

    tokens.push({ type, text })
    startsWord = false
  }

  return tokens
}

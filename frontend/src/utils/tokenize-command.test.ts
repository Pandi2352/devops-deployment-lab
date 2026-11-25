import { expect, test } from 'vitest'
import { tokenizeCommand, type TokenType } from './tokenize-command'

function pick(command: string, type: TokenType) {
  return tokenizeCommand(command)
    .filter((token) => token.type === type)
    .map((token) => token.text)
}

test.each([
  'git commit -m "Create React app and docs"',
  'git remote add origin https://github.com/<GITHUB_USER>/devops-deployment-lab.git',
  'npm create vite@latest frontend -- --template react-ts',
  'cd D:\\devops\\react-devops',
  'git commit -m "unclosed',
  "sudo awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c",
  "printf '\\n[boot]\\nsystemd=true\\n' | sudo tee -a /etc/wsl.conf",
])('keeps the full text of %s', (command) => {
  const text = tokenizeCommand(command)
    .map((token) => token.text)
    .join('')
  expect(text).toBe(command)
})

test('finds each part of a command', () => {
  const command = 'git commit --allow-empty -m "Test protection"'
  expect(pick(command, 'program')).toEqual(['git'])
  expect(pick(command, 'subcommand')).toEqual(['commit'])
  expect(pick(command, 'option')).toEqual(['--allow-empty', '-m'])
  expect(pick(command, 'text')).toEqual(['"Test protection"'])
})

test('finds a placeholder inside an address', () => {
  const command = 'git remote add origin https://github.com/<GITHUB_USER>/devops-deployment-lab.git'
  expect(pick(command, 'placeholder')).toEqual(['<GITHUB_USER>'])
  expect(pick(command, 'option')).toEqual([])
})

test('finds the program after sudo', () => {
  const command = 'sudo systemctl stop nginx'
  expect(pick(command, 'program')).toEqual(['sudo', 'systemctl'])
  expect(pick(command, 'subcommand')).toEqual(['stop'])
})

test('finds every program in a joined command', () => {
  const command = 'find /etc -name "*.conf" 2>/dev/null | head'
  expect(pick(command, 'program')).toEqual(['find', 'head'])
  expect(pick(command, 'operator')).toEqual(['2>/dev/null', '|'])
})

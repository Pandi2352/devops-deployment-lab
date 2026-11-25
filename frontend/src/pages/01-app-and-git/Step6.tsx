import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, Paragraph } from '../../components/Content'
import { StepPage } from '../../components/StepPage'

const OPEN_FOLDER: Command[] = [
  {
    command: 'cd D:\\devops\\react-devops',
    purpose: 'Go to the project root. These files belong here, not in frontend.',
  },
  {
    command: 'code .',
    purpose: 'Open this folder in VS Code, so you can create the files.',
  },
]

const GITIGNORE = `node_modules/
dist/
.env
.env.*
!.env.example
*.pem
*.key
.terraform/
*.tfstate
*.tfstate.*
*.tfvars
kubeconfig`

const GITATTRIBUTES = `* text=auto eol=lf
*.png binary
*.ico binary`

const EDITORCONFIG = `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false`

const README = `# DevOps Deployment Lab

A small React app deployed with Docker, Kubernetes, AWS and GitOps.

Plan: [docs/README.md](docs/README.md)`

export function Step6() {
  return (
    <StepPage id="step-6">
      <Paragraph>
        Go back to <InlineCode>D:\devops\react-devops</InlineCode>.
      </Paragraph>
      <CommandBlock commands={OPEN_FOLDER} />
      <CodeBlock
        language="Text"
        file=".gitignore"
        purpose="Files Git must not save: packages, build output, secrets, keys and Terraform state. The ! line keeps the safe sample file."
        code={GITIGNORE}
      />
      <CodeBlock
        language="Text"
        file=".gitattributes"
        note="stops Windows line endings from breaking Linux scripts"
        purpose="eol=lf uses Linux line endings. binary tells Git not to change image files."
        code={GITATTRIBUTES}
      />
      <CodeBlock
        language="INI"
        file=".editorconfig"
        purpose="Gives every editor the same spacing and formatting."
        code={EDITORCONFIG}
      />
      <CodeBlock
        language="Markdown"
        file="README.md"
        purpose="The front page of your GitHub repo."
        code={README}
      />
      <Paragraph>
        <strong>LICENSE:</strong> create it on GitHub after step 8 in a pull request (Add file →
        name it <InlineCode>LICENSE</InlineCode> → Choose a license template → MIT).
      </Paragraph>
      <Paragraph>Purpose: it tells other people how they may use your code.</Paragraph>
    </StepPage>
  )
}

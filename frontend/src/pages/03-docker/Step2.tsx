import { CodeBlock } from '../../components/CodeBlock'
import { CommandBlock, type Command } from '../../components/CommandBlock'
import { InlineCode, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const OPEN: Command[] = [
  { command: 'cd D:\\devops\\react-devops', purpose: 'Go to the project root.' },
  { command: 'git branch --show-current', purpose: 'It must show phase-3-docker.' },
  { command: 'code .', purpose: 'Open the project in VS Code.' },
]

const NGINX_CONF = `server {
    listen 8080;
    root /usr/share/nginx/html;
    index index.html;
    server_tokens off;

    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 "ok\\n";
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location / {
        add_header Cache-Control "no-cache";
        try_files $uri $uri/ /index.html;
    }
}`

const PARTS = [
  {
    key: 'listen',
    label: <InlineCode>listen 8080</InlineCode>,
    value: 'A port that does not need root',
  },
  {
    key: 'tokens',
    label: <InlineCode>server_tokens off</InlineCode>,
    value: 'Hide the Nginx version',
  },
  {
    key: 'health',
    label: <InlineCode>/healthz</InlineCode>,
    value: 'A small page for health checks',
  },
  {
    key: 'assets',
    label: <InlineCode>/assets/</InlineCode>,
    value: 'File names change on every build, so browsers may keep them',
  },
  {
    key: 'try',
    label: <InlineCode>try_files ... /index.html</InlineCode>,
    value: 'Makes React addresses such as /phase-2/day-1 work',
  },
]

export function Step2() {
  return (
    <StepPage id="docker-step-2">
      <CommandBlock commands={OPEN} />
      <CodeBlock
        language="Nginx"
        file="docker/nginx/nginx.conf"
        purpose="Tells Nginx how to serve the app. Check the name: nginx.conf, not nginx.config."
        code={NGINX_CONF}
      />
      <SectionTitle>What each part does</SectionTitle>
      <ReferenceTable caption="Nginx settings" headers={['Part', 'Purpose']} rows={PARTS} />
    </StepPage>
  )
}

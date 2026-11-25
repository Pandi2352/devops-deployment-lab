import { CodeBlock } from '../../components/CodeBlock'
import { InlineCode, Paragraph, SectionTitle } from '../../components/Content'
import { ReferenceTable } from '../../components/ReferenceTable'
import { StepPage } from '../../components/StepPage'

const DOCKERFILE = `FROM node:26-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_APP_VERSION=dev
ENV VITE_APP_VERSION=$VITE_APP_VERSION
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080`

const DOCKERIGNORE = `**/node_modules
**/dist
**/.env*
**/.terraform
.git
docs
terraform`

const LINES = [
  {
    key: 'stage-1',
    label: <InlineCode>FROM node ... AS build</InlineCode>,
    value: 'Stage 1: a machine with Node to build the app',
  },
  { key: 'workdir', label: <InlineCode>WORKDIR /app</InlineCode>, value: 'Work in this folder' },
  {
    key: 'packages',
    label: <InlineCode>COPY package files, RUN npm ci</InlineCode>,
    value: 'Install packages first, so Docker can reuse this layer',
  },
  {
    key: 'source',
    label: <InlineCode>COPY frontend/ ./</InlineCode>,
    value: 'Copy the code after the packages',
  },
  {
    key: 'arg',
    label: <InlineCode>ARG / ENV</InlineCode>,
    value: 'Put the version into the page',
  },
  {
    key: 'stage-2',
    label: <InlineCode>FROM nginx-unprivileged</InlineCode>,
    value: 'Stage 2: a small Nginx that does not run as root',
  },
  {
    key: 'copy-from',
    label: <InlineCode>COPY --from=build</InlineCode>,
    value: 'Take only the built files. Node stays behind',
  },
  { key: 'expose', label: <InlineCode>EXPOSE 8080</InlineCode>, value: 'The port of the app' },
]

export function Step3() {
  return (
    <StepPage id="docker-step-3">
      <CodeBlock
        language="Dockerfile"
        file="frontend/Dockerfile"
        purpose="The recipe. Stage 1 builds the app, stage 2 serves it."
        code={DOCKERFILE}
      />
      <Paragraph>
        The Dockerfile uses files from both <InlineCode>frontend/</InlineCode> and{' '}
        <InlineCode>docker/</InlineCode>, so we always build from the <strong>repo root</strong>{' '}
        (the <InlineCode>.</InlineCode> at the end of the build command).
      </Paragraph>
      <Paragraph>
        Stage 1 builds with Node. Stage 2 keeps only the built files and Nginx, so the image is
        small. This Nginx image does <strong>not</strong> run as root.
      </Paragraph>
      <SectionTitle>What each line does</SectionTitle>
      <ReferenceTable caption="Dockerfile lines" headers={['Line', 'Purpose']} rows={LINES} />
      <CodeBlock
        language="Text"
        file=".dockerignore"
        note="in the repo root"
        purpose="Files Docker must not copy. In any other folder, Docker ignores this file."
        code={DOCKERIGNORE}
      />
    </StepPage>
  )
}

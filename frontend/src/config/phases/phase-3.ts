import type { GuidePage, Phase } from '../guide.types'

export type Phase3PageId =
  | 'docker-overview'
  | 'docker-setup'
  | 'docker-step-1'
  | 'docker-step-2'
  | 'docker-step-3'
  | 'docker-step-4'
  | 'docker-step-5'
  | 'docker-step-6'
  | 'docker-step-7'
  | 'docker-release-flow'
  | 'docker-check-image'
  | 'docker-linux-server'
  | 'docker-solve-issues'
  | 'docker-commands'
  | 'docker-mistakes'
  | 'docker-break-it'
  | 'docker-final-check'

const PATH = '/phase-3'

function createStep(
  id: Phase3PageId,
  step: number,
  title: string,
  summary: string,
): GuidePage<Phase3PageId> {
  return {
    id,
    path: `${PATH}/step-${step}`,
    label: `Step ${step}`,
    title,
    summary,
  }
}

export const PHASE_3: Phase<Phase3PageId> = {
  label: 'Phase 3',
  name: 'Docker',
  path: PATH,
  overview: {
    id: 'docker-overview',
    path: PATH,
    title: 'Phase 3: Docker (Free)',
    summary: 'Goal and all steps',
  },
  groups: [
    {
      title: 'Prepare',
      pages: [
        {
          id: 'docker-setup',
          path: `${PATH}/setup`,
          title: 'Connect Docker to Ubuntu',
          summary: 'Create the branch and turn on Docker.',
        },
      ],
    },
    {
      title: 'Part A: Build your image',
      pages: [
        createStep('docker-step-1', 1, 'Basic commands', 'Run your first container.'),
        createStep('docker-step-2', 2, 'Nginx configuration', 'Tell Nginx how to serve the app.'),
        createStep('docker-step-3', 3, 'Dockerfile', 'Write the recipe in two stages.'),
        createStep('docker-step-4', 4, 'Build and run', 'Build, run, update and roll back.'),
      ],
    },
    {
      title: 'Part B: Run and share',
      pages: [
        createStep('docker-step-5', 5, 'Volumes and networks', 'Keep data and connect containers.'),
        createStep('docker-step-6', 6, 'Docker Compose', 'Start everything with one command.'),
        createStep('docker-step-7', 7, 'Docker Hub', 'Upload and download your image.'),
      ],
    },
    {
      title: 'Real deployment',
      pages: [
        {
          id: 'docker-release-flow',
          path: `${PATH}/release-flow`,
          title: 'From code to server',
          summary: 'The full path of one release.',
        },
        {
          id: 'docker-check-image',
          path: `${PATH}/check-image`,
          title: 'Check the image before push',
          summary: 'Find problems before anyone gets the image.',
        },
        {
          id: 'docker-linux-server',
          path: `${PATH}/linux-server`,
          title: 'Run it on a Linux server',
          summary: 'Pull, run, check, update and roll back.',
        },
        {
          id: 'docker-solve-issues',
          path: `${PATH}/solve-issues`,
          title: 'Solve issues',
          summary: 'Find the cause and fix it, step by step.',
        },
      ],
    },
    {
      title: 'Practice and check',
      pages: [
        {
          id: 'docker-commands',
          path: `${PATH}/commands`,
          title: 'Commands to remember',
          summary: 'Docker commands in one place.',
        },
        {
          id: 'docker-mistakes',
          path: `${PATH}/mistakes`,
          title: 'Common mistakes',
          summary: 'Errors you will see, and how to fix them.',
        },
        {
          id: 'docker-break-it',
          path: `${PATH}/break-it`,
          title: 'Break it',
          summary: 'Break the port, the image and the cache.',
        },
        {
          id: 'docker-final-check',
          path: `${PATH}/final-check`,
          title: 'Final check',
          summary: 'Save your work and finish the phase.',
        },
      ],
    },
  ],
}

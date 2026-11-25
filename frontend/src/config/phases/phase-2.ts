import type { GuidePage, Phase } from '../guide.types'

export type Phase2PageId =
  | 'linux-overview'
  | 'linux-setup'
  | 'day-1'
  | 'day-2'
  | 'day-3'
  | 'day-4'
  | 'day-5'
  | 'day-6'
  | 'day-7'
  | 'linux-commands'
  | 'linux-mistakes'
  | 'linux-break-it'
  | 'linux-final-check'

const PATH = '/phase-2'

function createDay(
  id: Phase2PageId,
  day: number,
  title: string,
  summary: string,
): GuidePage<Phase2PageId> {
  return {
    id,
    path: `${PATH}/day-${day}`,
    label: `Day ${day}`,
    title,
    summary,
  }
}

export const PHASE_2: Phase<Phase2PageId> = {
  label: 'Phase 2',
  name: 'Linux',
  path: PATH,
  overview: {
    id: 'linux-overview',
    path: PATH,
    title: 'Phase 2: Linux (Free)',
    summary: 'Goal and all days',
  },
  groups: [
    {
      title: 'Prepare',
      pages: [
        {
          id: 'linux-setup',
          path: `${PATH}/setup`,
          title: 'Prepare Ubuntu',
          summary: 'Get admin access and turn on systemd.',
        },
      ],
    },
    {
      title: 'Seven days of Linux',
      pages: [
        createDay('day-1', 1, 'Files', 'Create, copy, rename, search and delete files.'),
        createDay('day-2', 2, 'Permissions', 'Control who can read, write and run.'),
        createDay('day-3', 3, 'Processes and services', 'Run Nginx as a service.'),
        createDay('day-4', 4, 'Networking', 'Check addresses, ports and DNS.'),
        createDay('day-5', 5, 'SSH', 'Create a key and log in to a server.'),
        createDay('day-6', 6, 'Logs and packages', 'Find out why something failed.'),
        createDay('day-7', 7, 'First shell script', 'Write a website health check.'),
      ],
    },
    {
      title: 'Practice and check',
      pages: [
        {
          id: 'linux-commands',
          path: `${PATH}/commands`,
          title: 'Commands to remember',
          summary: 'Linux commands in one place.',
        },
        {
          id: 'linux-mistakes',
          path: `${PATH}/mistakes`,
          title: 'Common mistakes',
          summary: 'Errors you will see, and how to fix them.',
        },
        {
          id: 'linux-break-it',
          path: `${PATH}/break-it`,
          title: 'Break it',
          summary: 'Break a service three ways and repair it.',
        },
        {
          id: 'linux-final-check',
          path: `${PATH}/final-check`,
          title: 'Final check',
          summary: 'Save your work and finish the phase.',
        },
      ],
    },
  ],
}

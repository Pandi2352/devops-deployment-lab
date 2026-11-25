import type { GuidePage, Phase } from '../guide.types'

export type Phase5PageId =
  | 'aws-overview'
  | 'aws-setup'
  | 'aws-step-1'
  | 'aws-step-2'
  | 'aws-step-3'
  | 'aws-step-4'
  | 'aws-step-5'
  | 'aws-step-6'
  | 'aws-step-7'
  | 'aws-step-8'
  | 'aws-step-9'
  | 'aws-commands'
  | 'aws-mistakes'
  | 'aws-break-it'
  | 'aws-cleanup'
  | 'aws-final-check'

const PATH = '/phase-5'

function createStep(
  id: Phase5PageId,
  step: number,
  title: string,
  summary: string,
): GuidePage<Phase5PageId> {
  return {
    id,
    path: `${PATH}/step-${step}`,
    label: `Step ${step}`,
    title,
    summary,
  }
}

export const PHASE_5: Phase<Phase5PageId> = {
  label: 'Phase 5',
  name: 'AWS',
  path: PATH,
  overview: {
    id: 'aws-overview',
    path: PATH,
    title: 'Phase 5: AWS Basics + S3 + CloudFront (Free to very low)',
    summary: 'Goal and all steps',
  },
  groups: [
    {
      title: 'Prepare',
      pages: [
        {
          id: 'aws-setup',
          path: `${PATH}/setup`,
          title: 'Know your account',
          summary: 'Plan, region, and what never to click.',
        },
      ],
    },
    {
      title: 'Part A: Safe account',
      pages: [
        createStep('aws-step-1', 1, 'MFA and budget', 'Protect the login and get cost alerts.'),
        createStep('aws-step-2', 2, 'AWS CLI', 'Install it and log in without keys.'),
      ],
    },
    {
      title: 'Part B: Network',
      pages: [
        createStep('aws-step-3', 3, 'Look at the network', 'Read the default VPC.'),
        createStep('aws-step-4', 4, 'Build a VPC by hand', 'Make a public subnet, then delete it.'),
      ],
    },
    {
      title: 'Part C: Deployment 1',
      pages: [
        createStep('aws-step-5', 5, 'Private S3 bucket', 'Build the site and upload it.'),
        createStep('aws-step-6', 6, 'CloudFront', 'Make it public with HTTPS.'),
      ],
    },
    {
      title: 'Part D: Deploy without keys',
      pages: [
        createStep('aws-step-7', 7, 'OIDC and role', 'Let GitHub log in to AWS.'),
        createStep('aws-step-8', 8, 'GitHub settings', 'Add the variables and the secret.'),
        createStep('aws-step-9', 9, 'Deploy workflow', 'Deploy with one click and an approval.'),
      ],
    },
    {
      title: 'Practice and check',
      pages: [
        {
          id: 'aws-commands',
          path: `${PATH}/commands`,
          title: 'Commands to remember',
          summary: 'AWS CLI commands in one place.',
        },
        {
          id: 'aws-mistakes',
          path: `${PATH}/mistakes`,
          title: 'Common mistakes',
          summary: 'Errors you will see, and how to fix them.',
        },
        {
          id: 'aws-break-it',
          path: `${PATH}/break-it`,
          title: 'Break it',
          summary: 'Wrong branch and missing permission.',
        },
        {
          id: 'aws-cleanup',
          path: `${PATH}/cleanup`,
          title: 'Cleanup',
          summary: 'Delete only the lab, by name.',
        },
        {
          id: 'aws-final-check',
          path: `${PATH}/final-check`,
          title: 'Final check',
          summary: 'Save your work and finish the phase.',
        },
      ],
    },
  ],
}

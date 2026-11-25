import type { GuidePage, Phase } from './guide.types'
import { PHASE_1, type Phase1PageId } from './phases/phase-1'
import { PHASE_2, type Phase2PageId } from './phases/phase-2'
import { PHASE_3, type Phase3PageId } from './phases/phase-3'

export type GuidePageId = Phase1PageId | Phase2PageId | Phase3PageId

export const PHASES: Phase<GuidePageId>[] = [PHASE_1, PHASE_2, PHASE_3]

export const GUIDE_PAGES: GuidePage<GuidePageId>[] = PHASES.flatMap((phase) => [
  phase.overview,
  ...phase.groups.flatMap((group) => group.pages),
])

export function getPageName(page: GuidePage) {
  return page.label ? `${page.label}: ${page.title}` : page.title
}

export function findPhaseByPath(pathname: string) {
  return (
    PHASES.find(({ path }) => pathname === path || pathname.startsWith(`${path}/`)) ?? PHASES[0]
  )
}

export function findPhaseByPage(id: GuidePageId) {
  return (
    PHASES.find(
      ({ overview, groups }) =>
        overview.id === id || groups.some((group) => group.pages.some((page) => page.id === id)),
    ) ?? PHASES[0]
  )
}

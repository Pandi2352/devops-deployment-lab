import type { ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { GuideLayout } from './components/GuideLayout'
import { GUIDE_PAGES, PHASES, type GuidePageId } from './config/guide'
import { APP_AND_GIT_PAGES } from './pages/01-app-and-git'
import { LINUX_PAGES } from './pages/02-linux'
import { DOCKER_PAGES } from './pages/03-docker'
import { ACTIONS_PAGES } from './pages/04-github-actions'
import { NotFound } from './pages/NotFound'

const PAGES: Record<GuidePageId, ComponentType> = {
  ...APP_AND_GIT_PAGES,
  ...LINUX_PAGES,
  ...DOCKER_PAGES,
  ...ACTIONS_PAGES,
}

function App() {
  return (
    <Routes>
      <Route element={<GuideLayout />}>
        <Route index element={<Navigate to={PHASES[0].path} replace />} />
        {GUIDE_PAGES.map(({ id, path }) => {
          const Page = PAGES[id]
          return <Route key={id} path={path} element={<Page />} />
        })}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App

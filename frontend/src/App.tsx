import type { ComponentType } from 'react'
import { Route, Routes } from 'react-router'
import { GuideLayout } from './components/GuideLayout'
import { GUIDE_PAGES, type GuidePageId } from './config/guide'
import {
  BreakIt,
  Commands,
  FinalCheck,
  Overview,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
} from './pages/01-app-and-git'
import { NotFound } from './pages/NotFound'

const PAGES: Record<GuidePageId, ComponentType> = {
  overview: Overview,
  'step-1': Step1,
  'step-2': Step2,
  'step-3': Step3,
  'step-4': Step4,
  'step-5': Step5,
  'step-6': Step6,
  'step-7': Step7,
  'step-8': Step8,
  'step-9': Step9,
  'step-10': Step10,
  commands: Commands,
  'break-it': BreakIt,
  'final-check': FinalCheck,
}

function App() {
  return (
    <Routes>
      <Route element={<GuideLayout />}>
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

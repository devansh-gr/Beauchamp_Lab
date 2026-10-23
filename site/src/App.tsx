import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Shell from './layouts/Shell'

const Home = lazy(() => import('./pages/Home'))
const Research = lazy(() => import('./pages/Research'))
const People = lazy(() => import('./pages/People'))
const Publications = lazy(() => import('./pages/Publications'))
const Join = lazy(() => import('./pages/Join'))
const Contact = lazy(() => import('./pages/Contact'))
const VizLab = lazy(() => import('./pages/VizLab'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="research" element={<Research />} />
          <Route path="research/:slug" element={<Research />} />
          <Route path="people" element={<People />} />
          <Route path="publications" element={<Publications />} />
          <Route path="join" element={<Join />} />
          <Route path="contact" element={<Contact />} />
          <Route path="lab" element={<VizLab />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

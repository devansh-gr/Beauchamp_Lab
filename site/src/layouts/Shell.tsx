import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Container } from '../components/ui/Reveal'
import { LAB, NAV } from '../content/lab'
import { asset } from '../lib/asset'

function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-steel bg-paper">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label={`${LAB.name} home`}>
          <img src={asset('/brand/mark.png')} alt="" width={32} height={32} className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-ink-2">{LAB.name}</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.href}
              to={n.href}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors hover:text-red ${isActive ? 'text-red' : 'text-ink-2'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="text-sm font-semibold text-ink-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-steel md:hidden">
          <Container className="flex flex-col py-3">
            {NAV.map((n) => (
              <NavLink key={n.href} to={n.href} className="py-2 text-lg font-semibold text-ink-2">
                {n.label}
              </NavLink>
            ))}
          </Container>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-steel bg-paper-2 text-sm text-body">
      <Container className="grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <img src={asset('/brand/wordmark.png')} alt={LAB.name} width={520} height={124} className="h-11 w-auto" />
          <p className="mt-5 max-w-sm">
            Department of Biomedical Engineering and Neuroscience Institute
            <br />
            {LAB.university}
          </p>
          <a href={`mailto:${LAB.email}`} className="mt-3 inline-block text-red underline underline-offset-4">
            {LAB.email}
          </a>
        </div>
        <ul className="flex flex-col gap-2">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link to={n.href} className="hover:text-red">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div>
          {/* Official CMU wordmark: unmodified artwork in Carnegie Red, 300px minimum, 1 M-width clear space. */}
          <a href="https://www.cmu.edu" className="-m-3 inline-block p-3">
            <img src={asset('/brand/cmu-wordmark-red.svg')} alt="Carnegie Mellon University" width={300} height={27} className="w-[300px] max-w-full" />
          </a>
        </div>
      </Container>
      <Container className="border-t border-steel py-5 text-xs">
        © {new Date().getFullYear()} {LAB.name}, {LAB.university}
      </Container>
    </footer>
  )
}

export default function Shell() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:p-2">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="bg-paper text-ink-2">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

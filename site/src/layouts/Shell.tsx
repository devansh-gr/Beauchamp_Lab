import { AnimatePresence, motion } from 'motion/react'
import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Container } from '../components/ui/Reveal'
import { LAB, NAV } from '../content/lab'

function Nav() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between text-paper">
        <Link to="/" className="flex items-center gap-3" aria-label={`${LAB.name} home`}>
          <img src="/brand/mark.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-tight">
            Output Layer Lab <span className="hidden font-normal text-paper/50 sm:inline">/ CMU</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.href}
              to={n.href}
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-paper ${isActive ? 'text-paper' : 'text-paper/60'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="rounded-full border border-paper/30 px-4 py-1.5 text-sm transition-colors hover:border-red-bright hover:bg-red hover:text-white"
          >
            Get in touch
          </Link>
        </nav>
        <button
          className="font-mono text-xs uppercase tracking-widest md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-paper/10 md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {[...NAV, { label: 'Contact', href: '/contact' }].map((n) => (
              <NavLink key={n.href} to={n.href} className="py-2 text-2xl font-medium text-paper">
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
    <footer className="bg-ink text-paper/60">
      <Container className="grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <img src="/brand/wordmark.png" alt={LAB.name} width={520} height={124} className="h-12 w-auto invert" />
          <p className="mt-6 max-w-sm text-sm">
            Department of Biomedical Engineering and Neuroscience Institute, {LAB.university}.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} to={n.href} className="hover:text-paper">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={`mailto:${LAB.email}`} className="hover:text-paper">
            {LAB.email}
          </a>
          <Link to="/contact" className="hover:text-paper">
            Contact form
          </Link>
        </div>
      </Container>
      <Container className="flex flex-col justify-between gap-2 border-t border-paper/10 py-6 font-mono text-xs sm:flex-row">
        <span>© {new Date().getFullYear()} {LAB.name} · {LAB.university}</span>
        <span>{LAB.tagline}</span>
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
      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Suspense fallback={<div className="min-h-screen bg-ink" />}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}

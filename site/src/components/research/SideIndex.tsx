import { PROJECTS } from '../../content/lab'

export function SideIndex({ active }: { active: string }) {
  return (
    <nav
      aria-label="Research projects"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 mix-blend-difference lg:block"
    >
      <ul className="space-y-3 text-right">
        {PROJECTS.map((p) => (
          <li key={p.slug}>
            <a
              href={`#${p.slug}`}
              aria-current={active === p.slug ? 'true' : undefined}
              className={`font-mono text-xs uppercase tracking-[0.18em] text-white transition-opacity ${
                active === p.slug ? 'opacity-100' : 'opacity-40 hover:opacity-80'
              }`}
            >
              {active === p.slug && <span aria-hidden>{'> '}</span>}
              {p.num}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

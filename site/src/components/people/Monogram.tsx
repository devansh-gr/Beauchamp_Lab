export function initials(name: string) {
  const parts = name.replace(/,.*$/, '').split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export default function Monogram({ name }: { name: string }) {
  return (
    <div role="img" aria-label={`${name}, no photo`} className="flex h-full w-full items-center justify-center bg-paper-2">
      <span className="text-5xl font-semibold text-iron">{initials(name)}</span>
    </div>
  )
}

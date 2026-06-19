import { APP_NAME } from '../../lib/constants.ts'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/70 py-6">
      <div className="container flex flex-col items-center justify-between gap-3 px-4 text-center text-sm text-[var(--muted-foreground)] sm:flex-row">
        <p>© {new Date().getFullYear()} {APP_NAME}. Built for developer communities.</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Signal Grid UI</p>
      </div>
    </footer>
  )
}

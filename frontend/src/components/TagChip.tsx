import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '../lib/utils'

interface TagChipProps {
  tag: string
  count?: number
  href?: LinkProps['to']
  onClick?: () => void
  className?: string
  selected?: boolean
}

export function TagChip({ tag, count, href, onClick, className, selected = false }: TagChipProps) {
  const chip = (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
      selected
        ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)]'
        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--brand)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
      className
    )}>
      #{tag}
      {count !== undefined && <span className="tabular-nums opacity-70">({count})</span>}
    </span>
  )

  if (href) {
    return (
      <Link to={href} onClick={onClick} className="inline-flex">
        {chip}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">
      {chip}
    </button>
  )
}

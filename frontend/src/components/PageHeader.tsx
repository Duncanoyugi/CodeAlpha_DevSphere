import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface PageHeaderProps {
  kicker?: string
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ kicker, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="space-y-2">
        {kicker && <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">{kicker}</p>}
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

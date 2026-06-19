import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center", className)}>
      {icon && <div className="mb-4 text-[var(--muted-foreground)]">{icon}</div>}
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

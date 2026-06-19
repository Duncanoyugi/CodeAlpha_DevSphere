import { Badge as UIBadge } from './ui/badge.tsx'
import { cn } from '../lib/utils.ts'
import { EXPERIENCE_LEVELS } from '../lib/constants.ts'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'neutral' | 'success' | 'warning'

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children?: React.ReactNode
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-[var(--brand)] text-[var(--brand-foreground)] hover:bg-[var(--brand)]/90',
  secondary: 'border-transparent bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80',
  destructive: 'border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90',
  outline: 'border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--accent)]',
  neutral: 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)]',
  success: 'border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]',
  warning: 'border-transparent bg-[var(--muted)] text-[var(--muted-foreground)]',
}

export function Badge({ variant = 'secondary', className, children }: BadgeProps) {
  return <UIBadge className={cn(badgeVariantClasses[variant], className)}>{children}</UIBadge>
}

type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]

interface ExperienceBadgeProps {
  level: ExperienceLevel | string
  className?: string
}

export function ExperienceBadge({ level, className }: ExperienceBadgeProps) {
  const normalized = level.toLowerCase()
  const variant: BadgeVariant =
    normalized === 'principal' || normalized === 'lead'
      ? 'default'
      : normalized === 'senior'
        ? 'success'
        : normalized === 'mid'
          ? 'warning'
          : 'neutral'

  return <Badge variant={variant} className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em]', className)}>{level}</Badge>
}

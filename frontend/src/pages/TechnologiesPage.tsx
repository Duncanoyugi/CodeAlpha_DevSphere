import { Link } from 'react-router-dom'
import { Hash } from 'lucide-react'
import { useAllTechnologies } from '../features/technologies/hooks/useAllTechnologies'
import { PageHeader } from '../components/PageHeader'
import { TagChip } from '../components/TagChip'
import { EmptyState } from '../components/common/EmptyState'
import { TechnologySkeleton } from '../components/LoadingSkeleton'
import type { Technology } from '../types'

export function TechnologiesPage() {
  const { data: technologies, isLoading, error } = useAllTechnologies()

  if (isLoading) {
    return <TechnologySkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Technologies unavailable"
        description="Failed to load technologies."
        icon={<Hash className="h-12 w-12" />}
      />
    )
  }

  if (!technologies || technologies.length === 0) {
    return (
      <EmptyState
        title="No technologies found"
        description="No technology tags are available yet."
        icon={<Hash className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Technologies"
        title="Explore the stack"
        description="Browse tags by activity and community interest, then follow topics that shape your feed."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {technologies.map((tech: Technology) => (
          <Link key={tech.name} to={`/technology/${tech.name}`}>
            <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--brand)] hover:bg-[var(--accent)]/40">
              <div className="flex items-start justify-between gap-4">
                <TagChip tag={tech.name} count={tech.totalPosts} />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] tabular-nums">
                  {tech.followers} followers
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
                {tech.totalPosts || 0} posts use this tag.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

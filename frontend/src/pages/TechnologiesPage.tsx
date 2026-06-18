import { useAllTechnologies } from '../features/technologies/hooks/useAllTechnologies'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { EmptyState } from '../components/common/EmptyState'
import { Hash } from 'lucide-react'

export function TechnologiesPage() {
  const { data: technologies, isLoading, error } = useAllTechnologies()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Failed to load technologies</p>
      </div>
    )
  }

  if (!technologies || technologies.length === 0) {
    return (
      <EmptyState
        title="No technologies found"
        description="No technologies are available yet"
        icon={<Hash className="h-12 w-12 text-muted-foreground" />}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Technologies</h1>
        <p className="text-muted-foreground">
          Browse and follow technologies to customize your feed
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => window.location.href = `/technology/${tech.name}`}
          >
            <div>
              <h3 className="font-semibold">#{tech.name}</h3>
              <p className="text-sm text-muted-foreground">
                {tech.totalPosts || 0} posts
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {tech.followers || 0} followers
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
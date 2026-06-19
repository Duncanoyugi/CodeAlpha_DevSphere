import { Link, useSearchParams } from 'react-router-dom'
import { useSearchUsers } from '../hooks/useSearch'
import { PageHeader } from '../../../components/PageHeader'
import { Avatar } from '../../../components/Avatar'
import { ExperienceBadge } from '../../../components/Badge'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { Search as SearchIcon, User } from 'lucide-react'
import { FollowButton } from '../../../components/FollowButton'

export function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: users, isLoading, error } = useSearchUsers(query)

  if (!query) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Search DevSphere"
          description="Search for developers, posts, and technologies."
          icon={<SearchIcon className="h-12 w-12" />}
        />
      </div>
    )
  }

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Search unavailable"
        description="Failed to search. Please try again."
        icon={<SearchIcon className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Search"
        title="Search results"
        description={`${users?.length || 0} results for "${query}"`}
      />

      {users && users.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            <User className="h-4 w-4" aria-hidden="true" />
            Developers
          </div>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--accent)]/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar name={user.username} src={user.avatar || null} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--foreground)]">{user.username}</p>
                    {user.bio && (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        {user.bio}
                      </p>
                    )}
                    {user.experience && (
                      <div className="mt-2">
                        <ExperienceBadge level={user.experience} />
                      </div>
                    )}
                  </div>
                </Link>
                <FollowButton userId={user.id} size="sm" variant="outline" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No results found"
          description={`No results found for "${query}"`}
          icon={<SearchIcon className="h-12 w-12" />}
        />
      )}
    </div>
  )
}

import { useSearchUsers } from '../hooks/useSearch'
import { Avatar } from '../../../components/Avatar'
import { ExperienceBadge } from '../../../components/Badge'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const { data: users, isLoading, error } = useSearchUsers(query)

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Search unavailable"
        description="Failed to load search results."
        icon={<Search className="h-12 w-12" />}
      />
    )
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        title="No results found"
        description={`No results found for "${query}"`}
        className="py-8"
        icon={<Search className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <Link
          key={user.id}
          to={`/profile/${user.username}`}
          className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--accent)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <Avatar name={user.username} src={user.avatar || null} size="md" />
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-[var(--foreground)]">{user.username}</p>
            {user.bio && (
              <p className="truncate text-sm text-[var(--muted-foreground)]">{user.bio}</p>
            )}
          </div>
          {user.experience && (
            <ExperienceBadge level={user.experience} />
          )}
        </Link>
      ))}
    </div>
  )
}

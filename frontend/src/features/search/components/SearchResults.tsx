import { useSearchUsers } from '../hooks/useSearch'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { EmptyState } from '../../../components/common/EmptyState'
import { Link } from 'react-router-dom'
import { getInitials } from '../../../lib/utils'

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const { data: users, isLoading, error } = useSearchUsers(query)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-sm text-destructive">
        Failed to load search results
      </p>
    )
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        title="No results found"
        description={`No results found for "${query}"`}
        className="py-8"
      />
    )
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <Link
          key={user.id}
          to={`/profile/${user.username}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Avatar>
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{user.username}</p>
            {user.bio && (
              <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
            )}
          </div>
          {user.experience && (
            <Badge variant="secondary">{user.experience}</Badge>
          )}
        </Link>
      ))}
    </div>
  )
}
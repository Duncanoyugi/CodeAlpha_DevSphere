import { useSearchParams, Link } from 'react-router-dom'
import { useSearchUsers } from '../hooks/useSearch'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { EmptyState } from '../../../components/common/EmptyState'
import { Search as SearchIcon, User } from 'lucide-react'
import { getInitials } from '../../../lib/utils'
import { FollowButton } from '../../follows/components/FollowButton'

export function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: users, isLoading, error } = useSearchUsers(query)

  if (!query) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          title="Search DevSphere"
          description="Search for developers, posts, and technologies"
          icon={<SearchIcon className="h-12 w-12 text-muted-foreground" />}
        />
      </div>
    )
  }

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
        <p className="text-destructive">Failed to search. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          {users?.length || 0} results for "{query}"
        </p>
      </div>

      {users && users.length > 0 ? (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <User className="h-4 w-4" />
            Developers
          </h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground truncate max-w-[400px]">
                        {user.bio}
                      </p>
                    )}
                    {user.experience && (
                      <Badge variant="secondary" className="mt-1">
                        {user.experience}
                      </Badge>
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
          icon={<SearchIcon className="h-12 w-12 text-muted-foreground" />}
        />
      )}
    </div>
  )
}
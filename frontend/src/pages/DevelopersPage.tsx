import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { UserPlus, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { getInitials } from '../lib/utils'
import { usersApi } from '../api/users.api'
import { useFollow } from '../features/follows/hooks/useFollow'
import { useIsFollowing } from '../features/follows/hooks/useFollow'
import type { User } from '../types'

function DevUserCard({ user, currentUserId }: { user: User; currentUserId: string }) {
  const follow = useFollow()
  const { data: followState } = useIsFollowing(user.id)

  const isSelf = user.id === currentUserId

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Link to={`/profile/${user.username}`}>
          <Avatar>
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link to={`/profile/${user.username}`} className="hover:underline">
            <span className="font-semibold">{user.username}</span>
          </Link>
          {user.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
          )}
        </div>
        {!isSelf && (
          <Button
            size="sm"
            variant={followState?.following ? 'outline' : 'default'}
            onClick={() => follow.mutate(user.id)}
            disabled={follow.isPending}
          >
            {followState?.following ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Following
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" /> Follow
              </>
            )}
          </Button>
        )}
      </CardHeader>
      {user.experience && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{user.experience}</p>
        </CardContent>
      )}
    </Card>
  )
}

export function DevelopersPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => usersApi.getAllUsers(),
  })

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.getMyProfile(),
  })

  if (isLoading) {
    return <p className="text-muted-foreground">Loading developers...</p>
  }

  if (error) {
    return <p className="text-destructive">Failed to load developers.</p>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Developers</h1>
        <p className="text-muted-foreground">Discover and follow developers in the community.</p>
      </div>

      <div className="space-y-3">
        {(users ?? []).map((user) => (
          <DevUserCard key={user.id} user={user} currentUserId={me?.id || ''} />
        ))}
        {(users ?? []).length === 0 && (
          <p className="text-muted-foreground">No developers found yet.</p>
        )}
      </div>
    </div>
  )
}

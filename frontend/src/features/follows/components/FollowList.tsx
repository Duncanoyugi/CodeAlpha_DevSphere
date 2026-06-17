import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { getInitials } from '../../../lib/utils'
import { FollowButton } from './FollowButton'
import type { User } from '../../../types'

interface FollowListProps {
  users: User[]
  title: string
}

export function FollowList({ users, title }: FollowListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {title.toLowerCase()} yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <Link to={`/profile/${user.username}`} className="flex items-center gap-3 hover:underline">
              <Avatar>
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {user.bio}
                  </p>
                )}
              </div>
            </Link>
            <FollowButton userId={user.id} size="sm" variant="outline" />
          </div>
        ))}
      </div>
    </div>
  )
}
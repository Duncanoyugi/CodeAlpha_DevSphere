import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { FollowButton } from '../../follows/components/FollowButton'
import { formatDate, getInitials } from '../../../lib/utils'
import { useFollowCounts } from '../../follows/hooks/useFollow'
import type { User } from '../../../types'

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const { data: counts } = useFollowCounts(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback className="text-2xl">
            {getInitials(user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              {user.experience && (
                <Badge variant="secondary" className="mt-1">
                  {user.experience}
                </Badge>
              )}
            </div>
            {isOwnProfile ? (
              <Button variant="outline" asChild>
                <Link to="/settings">Edit Profile</Link>
              </Button>
            ) : (
              <FollowButton userId={user.id} />
            )}
          </div>
          {user.bio && (
            <p className="mt-2 text-muted-foreground">{user.bio}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">
                {counts?.followers || 0}
              </span>{' '}
              followers
            </span>
            <span>
              <span className="font-semibold text-foreground">
                {counts?.following || 0}
              </span>{' '}
              following
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
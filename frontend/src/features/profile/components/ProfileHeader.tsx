import { Link } from 'react-router-dom'
import { Avatar } from '../../../components/Avatar'
import { Button } from '../../../components/ui/button'
import { ExperienceBadge } from '../../../components/Badge'
import { FollowButton } from '../../../features/follows/components/FollowButton'
import { formatDate } from '../../../lib/utils'
import { useFollowCounts } from '../../follows/hooks/useFollow'
import type { User } from '../../../types'

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const { data: counts } = useFollowCounts(user.id)

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar name={user.username} src={user.avatar || null} size="xl" />
        <div className="flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">{user.username}</h1>
                {user.experience && <ExperienceBadge level={user.experience} />}
              </div>
              {user.bio && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{user.bio}</p>
              )}
            </div>
            {isOwnProfile ? (
              <Button variant="outline" className="rounded-xl" asChild>
                <Link to="/settings">Edit Profile</Link>
              </Button>
            ) : (
              <FollowButton userId={user.id} />
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted-foreground)]">
            <span className="tabular-nums">
              <span className="font-semibold text-[var(--foreground)]">{counts?.followers || 0}</span> followers
            </span>
            <span className="tabular-nums">
              <span className="font-semibold text-[var(--foreground)]">{counts?.following || 0}</span> following
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
              Joined {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

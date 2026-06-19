import { Link } from 'react-router-dom'
import { Avatar } from '../../../components/Avatar'
import { FollowButton } from './FollowButton'
import type { User } from '../../../types'

interface FollowListProps {
  users: User[]
  title: string
}

export function FollowList({ users, title }: FollowListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-8 text-center text-sm text-[var(--muted-foreground)]">
        No {title.toLowerCase()} yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <Link to={`/profile/${user.username}`} className="flex items-center gap-3 hover:text-[var(--brand)]">
              <Avatar name={user.username} src={user.avatar || null} size="md" />
              <div className="min-w-0">
                <p className="font-medium text-[var(--foreground)]">{user.username}</p>
                {user.bio && (
                  <p className="truncate max-w-[200px] text-sm text-[var(--muted-foreground)]">
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

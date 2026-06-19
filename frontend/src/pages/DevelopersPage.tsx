import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.tsx'
import { Card, CardContent } from '../components/ui/card.tsx'
import { Avatar } from '../components/Avatar.tsx'
import { ExperienceBadge } from '../components/Badge.tsx'
import { FollowButton } from '../features/follows/components/FollowButton.tsx'
import { DeveloperSkeleton } from '../components/LoadingSkeleton.tsx'
import { EmptyState } from '../components/common/index.ts'
import { Users } from 'lucide-react'
import { usersApi } from '../api/users.api.ts'
import type { User } from '../types/index.ts'

interface DevUserCardProps {
  user: User
  currentUserId: string
}

function DevUserCard({ user, currentUserId }: DevUserCardProps) {
  const isSelf = user.id === currentUserId

  return (
    <Card className="transition-colors hover:bg-[var(--accent)]/40">
      <CardContent className="flex items-center gap-4 p-5">
        <Link to={`/profile/${user.username}`} aria-label={`Open ${user.username} profile`}>
          <Avatar name={user.username} src={user.avatar || null} size="lg" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/profile/${user.username}`} className="block truncate font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--brand)]">
            {user.username}
          </Link>
          {user.bio && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">{user.bio}</p>
          )}
          {user.experience && (
            <div className="mt-3">
              <ExperienceBadge level={user.experience} />
            </div>
          )}
        </div>
        {isSelf ? (
          <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">You</span>
        ) : (
          <FollowButton userId={user.id} size="sm" variant="outline" />
        )}
      </CardContent>
    </Card>
  )
}

export function DevelopersPage() {
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users', 'all'],
    queryFn: () => usersApi.getAllUsers(),
  })

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.getMyProfile(),
  })

  if (isLoading) {
    return <DeveloperSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Developers unavailable"
        description="Failed to load the developer directory."
        icon={<Users className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Directory"
        title="Developers"
        description="Discover engineers, compare experience levels, and follow people worth learning from."
      />

      <div className="space-y-3">
        {(users ?? []).map((user) => (
          <DevUserCard key={user.id} user={user} currentUserId={me?.id || ''} />
        ))}
        {(users ?? []).length === 0 && (
          <EmptyState
            title="No developers found"
            description="The directory is empty for now."
            icon={<Users className="h-12 w-12" />}
          />
        )}
      </div>
    </div>
  )
}

import { CheckCircle2, UserPlus } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useFollow, useUnfollow, useIsFollowing } from '../hooks/useFollow'
import { useAuth } from '../../auth/hooks/useAuth'

interface FollowButtonProps {
  userId: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline'
}

export function FollowButton({ userId, size = 'default', variant = 'default' }: FollowButtonProps) {
  const { user } = useAuth()
  const { data: isFollowingData, isLoading: isChecking } = useIsFollowing(userId)
  const follow = useFollow()
  const unfollow = useUnfollow()

  const isFollowing = isFollowingData?.isFollowing || false
  const isOwnProfile = user?.id === userId

  if (isOwnProfile || isChecking) {
    return null
  }

  const handleClick = () => {
    if (isFollowing) {
      unfollow.mutate(userId)
    } else {
      follow.mutate(userId)
    }
  }

  const isLoading = follow.isPending || unfollow.isPending

  return (
    <Button
      size={size}
      variant={isFollowing ? 'outline' : variant}
      onClick={handleClick}
      disabled={isLoading}
      className="rounded-xl"
      aria-pressed={isFollowing}
    >
      {isLoading ? (
        'Loading...'
      ) : isFollowing ? (
        <>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Follow
        </>
      )}
    </Button>
  )
}

export type { FollowButtonProps }

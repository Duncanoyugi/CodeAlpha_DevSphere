import { useParams } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { ProfileHeader } from './ProfileHeader'
import { ProfilePosts } from './ProfilePosts'
import { SkillsManager } from './SkillsManager'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useAuth } from '../../auth/hooks/useAuth'
import { useFollowers, useFollowing } from '../../follows/hooks/useFollow'
import { FollowList } from '../../follows/components/FollowList'
import { User } from 'lucide-react'
import type { User as UserProfile } from '../../../types'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const { data: profile, isLoading, error } = useProfile(username)
  const { data: followers } = useFollowers(profile?.id || '')
  const { data: following } = useFollowing(profile?.id || '')

  const followerUsers: UserProfile[] = (followers || []).map((follow) => follow.follower).filter(Boolean) as UserProfile[]
  const followingUsers: UserProfile[] = (following || []).map((follow) => follow.following).filter(Boolean) as UserProfile[]
  const isOwnProfile = currentUser?.username === profile?.username

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error || !profile) {
    return (
      <EmptyState
        title="User not found"
        description="We couldn't find a developer with that username."
        icon={<User className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="space-y-6">
      <ProfileHeader user={profile} isOwnProfile={isOwnProfile} />

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-[var(--muted)] p-1">
          <TabsTrigger value="posts" className="rounded-lg">Posts</TabsTrigger>
          <TabsTrigger value="skills" className="rounded-lg">Skills</TabsTrigger>
          <TabsTrigger value="followers" className="rounded-lg">Followers</TabsTrigger>
          <TabsTrigger value="following" className="rounded-lg">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <ProfilePosts userId={profile.id} />
        </TabsContent>
        <TabsContent value="skills" className="mt-6">
          <SkillsManager userId={profile.id} isOwnProfile={isOwnProfile} />
        </TabsContent>
        <TabsContent value="followers" className="mt-6">
          <FollowList users={followerUsers} title="Followers" isLoading={followers === undefined} />
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          <FollowList users={followingUsers} title="Following" isLoading={following === undefined} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

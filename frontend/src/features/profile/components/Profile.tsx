import { useParams } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { ProfileHeader } from './ProfileHeader'
import { ProfilePosts } from './ProfilePosts'
import { SkillsManager } from './SkillsManager'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useAuth } from '../../auth/hooks/useAuth'
import { User } from 'lucide-react'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const { data: profile, isLoading, error } = useProfile(username)

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
          <EmptyState
            title="Followers coming soon"
            description="This list will show developers who follow this profile."
            icon={<User className="h-12 w-12" />}
          />
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          <EmptyState
            title="Following coming soon"
            description="This list will show developers this profile follows."
            icon={<User className="h-12 w-12" />}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

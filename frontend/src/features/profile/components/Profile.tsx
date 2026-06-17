import { useParams } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { ProfileHeader } from './ProfileHeader'
import { ProfilePosts } from './ProfilePosts'
import { SkillsManager } from './SkillsManager'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useAuth } from '../../auth/hooks/useAuth'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const { data: profile, isLoading, error } = useProfile(username)

  const isOwnProfile = currentUser?.username === profile?.username

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">User not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={profile} isOwnProfile={isOwnProfile} />

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <ProfilePosts userId={profile.id} />
        </TabsContent>
        <TabsContent value="skills" className="mt-6">
          <SkillsManager userId={profile.id} isOwnProfile={isOwnProfile} />
        </TabsContent>
        <TabsContent value="followers" className="mt-6">
          {/* Followers list will go here */}
          <p className="text-muted-foreground">Followers list coming soon</p>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          {/* Following list will go here */}
          <p className="text-muted-foreground">Following list coming soon</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
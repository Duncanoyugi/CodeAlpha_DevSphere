import { useAuth } from '../features/auth/hooks/useAuth'
import { EditProfile } from '../features/profile/components/EditProfile'
import { PageHeader } from '../components/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Settings } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Account"
        title="Settings"
        description="Manage your profile details and how other developers see your experience level."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)]">
              <Settings className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your public bio and experience level.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EditProfile
            defaultValues={{
              bio: user?.bio || '',
              experience: user?.experience || 'Junior',
              githubUrl: user?.githubUrl || '',
              linkedInUrl: user?.linkedInUrl || '',
              portfolioUrl: user?.portfolioUrl || '',
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

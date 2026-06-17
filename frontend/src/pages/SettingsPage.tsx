import { useAuth } from '../features/auth/hooks/useAuth'
import { EditProfile } from '../features/profile/components/EditProfile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfile
            defaultValues={{
              bio: user?.bio || '',
              experience: user?.experience || 'Junior',
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}